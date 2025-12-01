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
