import React from 'react';
import EyeQLayout from '@/components/eyeq/EyeQLayout';
import GlassCard from '@/components/eyeq/GlassCard';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents, fetchMembers, fetchAllAttendance } from '@/lib/supabase';

const Analytics: React.FC = () => {
  const { data: eventsData } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });
  const { data: membersData } = useQuery({ queryKey: ['members'], queryFn: fetchMembers });
  const { data: attendanceData } = useQuery({ queryKey: ['attendance-all'], queryFn: fetchAllAttendance });

  const events = (eventsData as any[]) || [];
  const members = (membersData as any[]) || [];
  const attendanceLogs = (attendanceData as any[]) || [];

  // Calculate event attendance for chart
  const eventChartData = events.map(e => {
    const count = attendanceLogs.filter(l => l.eventId === e.id).length;
    return { name: e.title, attendees: count };
  });

  // Calculate member growth (mock logic for now as we don't have historical data easily accessible without more complex queries)
  // We can group members by joined_at month
  const memberGrowthData = React.useMemo(() => {
    const months: Record<string, number> = {};
    members.forEach(m => {
      const date = new Date(m.joined_at);
      const key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      months[key] = (months[key] || 0) + 1;
    });
    // Cumulative sum
    let sum = 0;
    return Object.entries(months).map(([month, count]) => {
      sum += count;
      return { month, members: sum };
    });
  }, [members]);

  const exportCSV = () => {
    const csvRows = [
      ['Name', 'Email', 'Role', 'Approved', 'Joined At'].join(','),
      ...members.map((m) => [m.full_name, m.email, m.role, m.is_approved ? 'Yes' : 'No', new Date(m.joined_at).toLocaleDateString()].join(',')),
    ];
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'members.csv';
    a.click();
  };

  const exportAttendanceAll = () => {
    const rows = [['Event', 'Member Name', 'Member Email', 'Attended At']];
    attendanceLogs.forEach((l) => {
      const ev = events.find((e) => e.id === l.eventId);
      const mem = members.find((m) => m.id === l.memberId); // Note: memberId might be UUID now, check supabase response structure
      // In fetchAllAttendance, we select members(*), so l.members should be populated if relation exists
      const memberName = l.members?.full_name || 'Unknown';
      const memberEmail = l.members?.email || 'Unknown';
      const eventTitle = l.events?.title || ev?.title || 'Unknown';

      rows.push([eventTitle, memberName, memberEmail, new Date(l.marked_at || l.time || l.created_at).toLocaleString()]);
    });
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_all.csv';
    a.click();
  };

  return (
    <EyeQLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Analytics & Reports</h3>
            <div className="text-sm text-muted-foreground">Insights & downloadable reports</div>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportCSV}>Export Members</Button>
            <Button onClick={exportAttendanceAll} variant="outline">Export Attendance</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard>
            <h4 className="text-lg font-semibold mb-2">Event Attendance</h4>
            <div className="w-full h-64">
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={eventChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey='name' stroke='rgba(255,255,255,0.45)' />
                  <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                  <Bar dataKey='attendees' fill='#00D1FF' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
          <GlassCard>
            <h4 className="text-lg font-semibold mb-2">Member Growth</h4>
            <div className="text-sm text-muted-foreground">Cumulative members over time</div>
            <div className='mt-4'>
              <div className='w-full h-56'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={memberGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey='month' stroke='rgba(255,255,255,0.45)' />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                    <Legend />
                    <Line type="monotone" dataKey='members' stroke='#00D1FF' strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <GlassCard>
            <h4 className='text-lg font-semibold'>Recent Attendance Logs</h4>
            <div className='max-h-64 overflow-auto mt-3 space-y-2'>
              {attendanceLogs.slice(0, 20).map((l) => {
                const memberName = l.members?.full_name || 'Unknown';
                const eventTitle = l.events?.title || 'Unknown Event';
                return (
                  <div key={l.id} className='flex items-center justify-between p-2 bg-black/3 rounded-md'>
                    <div>
                      <div className='text-sm font-medium'>{memberName}</div>
                      <div className='text-xs text-muted-foreground'>{eventTitle}</div>
                    </div>
                    <div className='text-xs text-muted-foreground'>{new Date(l.marked_at || l.created_at).toLocaleString()}</div>
                  </div>
                );
              })}
              {attendanceLogs.length === 0 && <div className="text-sm text-muted-foreground">No attendance records found.</div>}
            </div>
          </GlassCard>

          <GlassCard>
            <h4 className='text-lg font-semibold'>Quick Stats</h4>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-lg bg-white/5 text-center">
                <div className="text-3xl font-bold text-neon-blue">{members.length}</div>
                <div className="text-xs text-muted-foreground">Total Members</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 text-center">
                <div className="text-3xl font-bold text-neon-purple">{events.length}</div>
                <div className="text-xs text-muted-foreground">Total Events</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 text-center">
                <div className="text-3xl font-bold text-green-400">{attendanceLogs.length}</div>
                <div className="text-xs text-muted-foreground">Total Check-ins</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 text-center">
                <div className="text-3xl font-bold text-yellow-400">{members.filter(m => !m.is_approved).length}</div>
                <div className="text-xs text-muted-foreground">Pending Approvals</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </EyeQLayout>
  );
};

export default Analytics;
