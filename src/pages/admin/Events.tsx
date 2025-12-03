import React, { useState } from 'react';
import AdminLayout from '@/components/eyeq/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QRScanner from '@/components/QRScanner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEvents, createEvent, updateEvent, deleteEvent, fetchAttendance, markAttendance } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Calendar as CalendarIcon, MapPin, Users, QrCode, Trash2, Edit2, CheckCircle, X } from 'lucide-react';

const Events: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: eventsData, isLoading } = useQuery({ queryKey: ['events'], queryFn: fetchEvents, retry: false });
  const events = (eventsData as any[] | undefined) ?? [];

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    venue: '',
    organizer: '',
    type: 'Workshop',
    prize: ''
  });

  const [editing, setEditing] = useState<any | null>(null);
  const [attendanceOpen, setAttendanceOpen] = useState<string | null>(null);
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);

  // Fetch attendance logs when opening modal
  const { refetch: refetchAttendance } = useQuery({
    queryKey: ['attendance', attendanceOpen],
    queryFn: async () => {
      if (!attendanceOpen) return [];
      const logs = await fetchAttendance(attendanceOpen);
      setAttendanceLogs(logs || []);
      return logs;
    },
    enabled: !!attendanceOpen
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setOpen(false);
      resetForm();
      toast({ title: "Event Created", description: "New event has been successfully created." });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" })
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) => updateEvent(payload.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setOpen(false);
      setEditing(null);
      resetForm();
      toast({ title: "Event Updated", description: "Event details have been updated." });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({ title: "Event Deleted", description: "The event has been removed." });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" })
  });

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      date: formData.date || new Date().toISOString()
    };

    if (editing) {
      await updateMutation.mutateAsync({ ...payload, id: editing.id });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      description: '',
      venue: '',
      organizer: '',
      type: 'Workshop',
      prize: ''
    });
  };

  const handleEdit = (e: any) => {
    setEditing(e);
    setFormData({
      title: e.title,
      date: e.date,
      description: e.description || '',
      venue: e.venue || '',
      organizer: e.organizer || '',
      type: e.type || 'Workshop',
      prize: e.prize || ''
    });
    setOpen(true);
  };

  const [viewLogsEvent, setViewLogsEvent] = useState<string | null>(null);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);

  const toggleAttendance = async (eventId: string, memberId: string) => { // memberId is string (UUID)
    // Check if already attended? (Ideally handled by DB constraint or check)
    // For now just insert
    try {
      await markAttendance(eventId, memberId as any);
      refetchAttendance();
      toast({ title: "Attendance Marked", description: "Member marked as present." });
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to mark attendance. Already marked?", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-3xl font-bold tracking-tight">Events Management</h3>
            <p className="text-muted-foreground mt-1">Create and manage events, track attendance, and generate QR codes.</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) { setEditing(null); resetForm(); } }}>
              <DialogTrigger asChild>
                <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-2">
                  <Plus className="h-4 w-4" /> Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border">
                <DialogHeader>
                  <DialogTitle>{editing ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                  <DialogDescription>Fill details and generate QR for attendance</DialogDescription>
                  <div className="mt-4 grid grid-cols-1 gap-4">
                    <div className="grid gap-2">
                      <Label>Title</Label>
                      <Input placeholder="Event title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-background" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Date (ISO format)</Label>
                      <Input placeholder="YYYY-MM-DDTHH:mm:ss" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="bg-background" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Type</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option>Workshop</option>
                        <option>Hackathon</option>
                        <option>Seminar</option>
                        <option>Meetup</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Venue</Label>
                      <Input placeholder="Room 303, Lab, etc." value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} className="bg-background" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Organizer</Label>
                      <Input placeholder="Organizer Name" value={formData.organizer} onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} className="bg-background" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Description</Label>
                      <Textarea placeholder="Event details..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-background" />
                    </div>
                    <div className="flex gap-2 justify-end mt-4">
                      <Button onClick={() => setOpen(false)} variant="ghost">Cancel</Button>
                      <Button onClick={handleSubmit} className="bg-amber-500 hover:bg-amber-600 text-black">{editing ? 'Save Changes' : 'Create Event'}</Button>
                    </div>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2 border-border bg-card">
            <CardHeader>
              <CardTitle>Upcoming & Past Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading events...</div>
                ) : events.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No events found. Create one to get started.</div>
                ) : (
                  events.map((e) => (
                    <div key={e.id} className='flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-background/50 border border-border gap-4 hover:border-amber-500/30 transition-colors'>
                      <div className="space-y-1">
                        <div className='text-lg font-semibold text-foreground'>{e.title}</div>
                        <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                          <span className="flex items-center gap-1"><CalendarIcon size={14} /> {new Date(e.date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><MapPin size={14} /> {e.venue}</span>
                          <span className="px-2 py-0.5 rounded-full bg-secondary text-xs">{e.type}</span>
                        </div>
                      </div>
                      <div className='flex flex-wrap items-center gap-2'>
                        <a target='_blank' rel='noreferrer' href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify({ id: e.id, title: e.title, type: 'event_checkin' }))}`}>
                          <Button variant='outline' size="sm" className="gap-1"><QrCode size={14} /> QR</Button>
                        </a>
                        <Button variant='outline' size="sm" onClick={() => handleEdit(e)} className="gap-1"><Edit2 size={14} /> Edit</Button>
                        <Button variant='outline' size="sm" onClick={() => setAttendanceOpen(e.id)} className="gap-1"><Users size={14} /> Attendance</Button>
                        <Button variant='ghost' size="sm" className='text-red-500 hover:text-red-400 hover:bg-red-500/10' onClick={() => deleteMutation.mutate(e.id)}><Trash2 size={14} /></Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className='border-border bg-card h-fit'>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-2" onClick={() => setQrScannerOpen(true)}>
                <QrCode className="h-4 w-4" /> Scan Member QR
              </Button>
              <div className="text-xs text-muted-foreground text-center px-4">
                Use this scanner to check-in members at the venue entrance.
              </div>

              <div className="pt-4 border-t border-border mt-4">
                <h4 className="text-sm font-medium mb-3">Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-md bg-background/50 border border-border text-center">
                    <div className="text-2xl font-bold text-amber-500">{events.length}</div>
                    <div className="text-xs text-muted-foreground">Total Events</div>
                  </div>
                  <div className="p-3 rounded-md bg-background/50 border border-border text-center">
                    <div className="text-2xl font-bold text-green-500">Active</div>
                    <div className="text-xs text-muted-foreground">Status</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Scanner Modal */}
        {qrScannerOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'>
            <div className='max-w-xl w-full'>
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Scan QR Code</CardTitle>
                  <Button variant='ghost' size="sm" onClick={() => setQrScannerOpen(false)}><X size={20} /></Button>
                </CardHeader>
                <CardContent>
                  <QRScanner
                    onResult={(txt) => {
                      if (!txt) return;
                      try {
                        const parsed = JSON.parse(txt);
                        alert(`Scanned: ${JSON.stringify(parsed)}`);
                        setQrScannerOpen(false);
                      } catch {
                        alert('Invalid QR payload.');
                      }
                    }}
                    onClose={() => setQrScannerOpen(false)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Attendance Modal */}
        {attendanceOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'>
            <div className='max-w-2xl w-full max-h-[80vh] overflow-y-auto'>
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-card z-10 border-b border-border">
                  <CardTitle>Attendance List</CardTitle>
                  <Button variant='ghost' size="sm" onClick={() => setAttendanceOpen(null)}><X size={20} /></Button>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    {attendanceLogs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No attendance records found for this event.</div>
                    ) : (
                      attendanceLogs.map((l: any) => (
                        <div key={l.id} className="flex items-center justify-between p-3 bg-background/50 rounded-md border border-border">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-xs">
                              {(l.members?.full_name || 'U').charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{l.members?.full_name || l.member_id}</div>
                              <div className="text-xs text-muted-foreground">{l.members?.email}</div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <CheckCircle size={12} className="text-green-500" />
                            {new Date(l.marked_at || l.time).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default Events;
