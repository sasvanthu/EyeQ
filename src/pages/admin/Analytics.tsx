import React from 'react';
import AdminLayout from '@/components/eyeq/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents, fetchMembers, fetchAllAttendance } from '@/lib/api';
import { Download, FileText, Users, Calendar, CheckSquare, Clock } from 'lucide-react';

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
      const mem = members.find((m) => m.id === l.memberId); // Note: memberId is UUID
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
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-3xl font-bold tracking-tight">Analytics & Reports</h3>
            <p className="text-muted-foreground mt-1">Insights, data visualization, and downloadable reports.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportCSV} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-2">
              <Download className="h-4 w-4" /> Export Members
            </Button>
            <Button onClick={exportAttendanceAll} variant="outline" className="gap-2">
              <FileText className="h-4 w-4" /> Export Attendance
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Event Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64">
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={eventChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey='name' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px' }}
                      itemStyle={{ color: '#f59e0b' }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar dataKey='attendees' fill='#f59e0b' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Member Growth</CardTitle>
              <p className="text-sm text-muted-foreground">Cumulative members over time</p>
            </CardHeader>
            <CardContent>
              <div className='w-full h-64'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={memberGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey='month' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px' }}
                      itemStyle={{ color: '#f59e0b' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey='members' stroke='#f59e0b' strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Recent Attendance Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='max-h-64 overflow-auto space-y-2 pr-2'>
                {attendanceLogs.slice(0, 20).map((l) => {
                  const memberName = l.members?.full_name || 'Unknown';
                  const eventTitle = l.events?.title || 'Unknown Event';
                  return (
                    <div key={l.id} className='flex items-center justify-between p-3 bg-background/50 rounded-md border border-border'>
                      <div>
                        <div className='text-sm font-medium'>{memberName}</div>
                        <div className='text-xs text-muted-foreground'>{eventTitle}</div>
                      </div>
                      <div className='text-xs text-muted-foreground flex items-center gap-1'>
                        <Clock size={12} />
                        {new Date(l.marked_at || l.created_at).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
                {attendanceLogs.length === 0 && <div className="text-sm text-muted-foreground text-center py-4">No attendance records found.</div>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-background/50 border border-border text-center hover:border-amber-500/30 transition-colors">
                  <div className="flex justify-center mb-2 text-amber-500"><Users /></div>
                  <div className="text-3xl font-bold text-foreground">{members.length}</div>
                  <div className="text-xs text-muted-foreground">Total Members</div>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border text-center hover:border-amber-500/30 transition-colors">
                  <div className="flex justify-center mb-2 text-amber-500"><Calendar /></div>
                  <div className="text-3xl font-bold text-foreground">{events.length}</div>
                  <div className="text-xs text-muted-foreground">Total Events</div>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border text-center hover:border-amber-500/30 transition-colors">
                  <div className="flex justify-center mb-2 text-green-500"><CheckSquare /></div>
                  <div className="text-3xl font-bold text-foreground">{attendanceLogs.length}</div>
                  <div className="text-xs text-muted-foreground">Total Check-ins</div>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border text-center hover:border-amber-500/30 transition-colors">
                  <div className="flex justify-center mb-2 text-red-500"><Clock /></div>
                  <div className="text-3xl font-bold text-foreground">{members.filter(m => !m.is_approved).length}</div>
                  <div className="text-xs text-muted-foreground">Pending Approvals</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
