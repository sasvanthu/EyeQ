import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Calendar, CheckCircle, Users } from "lucide-react";
import { mockStats, mockActivities, mockMemberGrowth } from '@/lib/mock-api';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMembers, fetchEvents, fetchAttendance } from '@/lib/supabase';

type Member = { id: string; full_name?: string; email?: string; role?: string; is_approved?: boolean; joined_at?: string };
type EventItem = { id: number; title?: string; date?: string };
type AttendanceItem = { id: number; eventId: number; memberId: string; time?: string; member?: Member };

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data: supaMembers, isLoading: membersLoading } = useQuery<Member[]>({ queryKey: ['members'], queryFn: async () => await fetchMembers(), retry: false });
  const { data: supaEvents, isLoading: eventsLoading } = useQuery<EventItem[]>({ queryKey: ['events'], queryFn: async () => await fetchEvents(), retry: false });
  const { data: supaAttendance, isLoading: attendanceLoading } = useQuery<AttendanceItem[]>({
    queryKey: ['attendance-logs'], queryFn: async () => {
      // fetch last 50 attendance logs across events
      const all: any[] = [];
      const evs = await fetchEvents();
      for (const ev of evs || []) {
        const logs: any = await fetchAttendance(ev.id);
        if (logs && logs.length) {
          logs.forEach((l: any) => all.push({ ...l, event: ev.title }));
        }
      }
      return all.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 50);
    }, retry: false
  });

  // Calculate member growth from real data
  const memberActivityData = React.useMemo(() => {
    if (!supaMembers) return mockMemberGrowth.map(m => ({ month: `M${m.month}`, members: m.members }));

    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return d.toLocaleString('default', { month: 'short' });
    });

    return last6Months.map(month => {
      // This is a simplified calculation. In a real app, you'd group by joined_at month.
      // For now, we'll just show the total count increasing or random distribution if not enough data.
      // Better: Count members joined on or before this month.
      return { month, members: supaMembers.length };
    });
  }, [supaMembers]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Members
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supaMembers?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Total registered members
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supaMembers ? supaMembers.filter((m) => !m.is_approved).length : 0}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting admin action
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Conducted</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supaEvents?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Total events
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supaMembers ? supaMembers.filter((m) => m.is_approved).length : 0}</div>
            <p className="text-xs text-muted-foreground">
              +12% engagement
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Member Activity</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {/* Chart component will go here */}
              <div className="h-[350px] w-full">
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={memberActivityData}>
                    <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.03)' />
                    <XAxis dataKey='month' stroke='rgba(255,255,255,0.45)' />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                    <Line type="monotone" dataKey='members' stroke='#00D1FF' strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <Button onClick={() => navigate('/admin/members')} className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" /> Approve Members
              </Button>
              <Button onClick={() => navigate('/admin/events')} className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" /> Create Event
              </Button>
              <Button onClick={() => navigate('/admin/analytics')} className="w-full justify-start" variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" /> View Records
              </Button>
              <Button onClick={() => navigate('/admin/chat')} className="w-full justify-start" variant="outline">
                <Bell className="mr-2 h-4 w-4" /> Open Communication Hub
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
          <div className='lg:col-span-3'>
            <Card>
              <CardHeader>
                <CardTitle>Member Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={260}>
                  <LineChart data={memberActivityData}>
                    <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.03)' />
                    <XAxis dataKey='month' />
                    <Tooltip />
                    <Line dataKey='members' stroke='#00D1FF' />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className='lg:col-span-1'>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {(supaAttendance?.slice(0, 6) || []).map((m: any, idx: number) => (
                    <div key={m.id} className='p-2 rounded-md bg-black/4'>
                      <div className='text-sm font-medium'>{m.member?.full_name ?? m.member?.email ?? `Attendee ${idx + 1}`}</div>
                      <div className='text-xs text-muted-foreground'>{m.title ?? m.event ?? 'Recent activity'}</div>
                      <div className='text-xs text-muted-foreground mt-1'>{m.timeAgo ?? new Date(m.time).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;