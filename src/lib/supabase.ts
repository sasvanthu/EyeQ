import { createClient } from '@supabase/supabase-js';

// Read from env variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Note: We don't throw here anymore so the App component can render a proper error screen
// if (!supabaseUrl || !supabaseKey) {
//   throw new Error('Supabase credentials missing. Check .env file.');
// }

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
  }
});

// Example wrapper functions
export async function fetchEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createEvent(event: any) {
  const { data, error } = await supabase.from('events').insert([event]).select();
  if (error) throw error;
  return data?.[0];
}

export async function updateEvent(id: number, payload: any) {
  const { data, error } = await supabase.from('events').update(payload).eq('id', id).select();
  if (error) throw error;
  return data?.[0];
}

export async function deleteEvent(id: number) {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function fetchAttendance(eventId: number) {
  const { data, error } = await supabase.from('attendance').select('*, members(*)').eq('eventId', eventId).order('time', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchAllAttendance() {
  const { data, error } = await supabase.from('attendance').select('*, members(*), events(*)').order('time', { ascending: false });
  if (error) throw error;
  return data;
}

export async function markAttendance(eventId: number, memberId: number) {
  const { data, error } = await supabase.from('attendance').insert([{ eventId, memberId }]).select();
  if (error) throw error;
  return data?.[0];
}

export async function fetchMembers() {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('joined_at', { ascending: false });

  if (error) throw error;
  if (error) throw error;
  return data;
}

export async function fetchMember(id: string) {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createMember(member: any) {
  const { data, error } = await supabase.from('members').insert([member]).select();
  if (error) throw error;
  return data?.[0];
}

export async function updateMember(id: string, payload: any) {
  const { data, error } = await supabase.from('members').update(payload).eq('id', id).select();
  if (error) throw error;
  return data?.[0];
}

export async function deleteMember(id: string) {
  const { error } = await supabase.from('members').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function fetchMessages(channelId: string = 'general') {
  const { data, error } = await supabase
    .from('messages')
    .select('*, members(full_name, avatar_url)')
    .eq('channel_id', channelId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function sendMessage(content: string, channelId: string = 'general', userId: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ content, channel_id: channelId, sender_id: userId }])
    .select();
  if (error) throw error;
  return data?.[0];
}

export function subscribeToMessages(channelId: string = 'general', callback: (payload: any) => void) {
  return supabase
    .channel(`public:messages:${channelId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${channelId}` }, callback)
    .subscribe();
}

export default supabase;

// --- Gallery Functions ---

export async function fetchAlbums() {
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .order('event_date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createAlbum(album: any) {
  const { data, error } = await supabase.from('albums').insert([album]).select();
  if (error) throw error;
  return data?.[0];
}

export async function deleteAlbum(id: string) {
  // First delete images from storage (optional, but good practice)
  // For now, we rely on cascade delete in DB, but storage files remain.
  // TODO: Implement storage cleanup trigger or manual cleanup.

  const { error } = await supabase.from('albums').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function fetchGalleryImages(albumId?: string) {
  let query = supabase.from('gallery_images').select('*').order('created_at', { ascending: false });

  if (albumId) {
    query = query.eq('album_id', albumId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function uploadGalleryImage(file: File, albumId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${albumId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('gallery')
    .getPublicUrl(filePath);

  const { data, error: dbError } = await supabase
    .from('gallery_images')
    .insert([{ album_id: albumId, url: publicUrl }])
    .select();

  if (dbError) throw dbError;
  return data?.[0];
}

export async function deleteGalleryImage(id: string, url: string) {
  // Extract path from URL to delete from storage
  // URL format: .../storage/v1/object/public/gallery/albumId/filename
  const path = url.split('/gallery/')[1];

  if (path) {
    await supabase.storage.from('gallery').remove([path]);
  }

  const { error } = await supabase.from('gallery_images').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// --- Leaderboard Functions ---

export async function fetchLeaderboard() {
  // If the view exists
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .limit(50); // Top 50

  if (error) {
    // Fallback if view doesn't exist or fails: fetch profiles and count projects manually (less efficient)
    console.warn("Leaderboard view fetch failed, falling back to manual aggregation", error);
    const { data: profiles } = await supabase.from('profiles').select('id, full_name, avatar_url');
    const { data: projects } = await supabase.from('projects').select('user_id');

    if (!profiles || !projects) return [];

    const stats = profiles.map(p => {
      const count = projects.filter(proj => proj.user_id === p.id).length;
      return {
        user_id: p.id,
        full_name: p.full_name,
        avatar_url: p.avatar_url,
        project_count: count,
        score: count * 10 // Simple score logic
      };
    });

    return stats.sort((a, b) => b.score - a.score);
  }

  return data;
}
