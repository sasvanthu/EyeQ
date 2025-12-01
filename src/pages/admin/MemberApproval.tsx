import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMembers, updateMember, deleteMember } from '@/lib/supabase';
import AdminLayout from '@/components/eyeq/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Check, X, Search, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const ApproveRoleSelect: React.FC<{ member: any; onApprove: (role?: string) => void }> = ({ member, onApprove }) => {
  const [selected, setSelected] = useState(member.role || 'Member');
  return (
    <div className='grid grid-cols-1 gap-4 mt-4'>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Assign Role</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
        >
          <option>Member</option>
          <option>PR</option>
          <option>Events</option>
          <option>Tech Lead</option>
          <option>Vice President</option>
          <option>Admin</option>
        </select>
      </div>
      <div className='flex gap-2 justify-end'>
        <Button
          onClick={() => onApprove(selected)}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
        >
          Confirm Approval
        </Button>
      </div>
    </div>
  );
};

const MemberApproval: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: membersData, isLoading } = useQuery({ queryKey: ['members'], queryFn: fetchMembers, retry: false });
  const members = membersData ?? [];
  const [filter, setFilter] = useState('');

  const pending = useMemo(() => members.filter((m: any) => !m.is_approved), [members]);

  const navigate = useNavigate();

  const approveMutation = useMutation({
    mutationFn: (payload: any) => updateMember(payload.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast({ title: "Member Approved", description: "The member has been approved successfully." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const approve = async (id: string, role?: string) => {
    await approveMutation.mutateAsync({ id, is_approved: true, role });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast({ title: "Member Rejected", description: "The member request has been rejected." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const reject = async (id: string) => { await deleteMutation.mutateAsync(id); };

  const autoAssignRoles = () => {
    toast({ title: "Auto-Assign", description: "Batch auto-assign is not yet implemented." });
  };

  const approveAll = async () => {
    toast({ title: "Approve All", description: "Batch approve is not yet implemented." });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-3xl font-bold tracking-tight">Member Approvals</h3>
            <p className="text-muted-foreground mt-1">Review and manage incoming member applications.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search applicants..."
                className="pl-9 w-[250px] bg-card border-border"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <FileDown className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="md:col-span-3 border-border bg-card">
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Requested Role</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading requests...</TableCell>
                    </TableRow>
                  ) : pending.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No pending approvals found.</TableCell>
                    </TableRow>
                  ) : (
                    pending
                      .filter((m: any) => (m.full_name || '').toLowerCase().includes(filter.toLowerCase()) || m.email.toLowerCase().includes(filter.toLowerCase()))
                      .map((m: any) => (
                        <TableRow key={m.id} className="border-border hover:bg-white/5">
                          <TableCell className="font-medium">{m.full_name}</TableCell>
                          <TableCell>{m.email}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              {m.role || 'Member'}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(m.joined_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-green-500 hover:text-green-400 hover:bg-green-500/10 border-green-500/20">
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-card border-border">
                                  <DialogHeader>
                                    <DialogTitle>Approve Member</DialogTitle>
                                    <DialogDescription>Assign a role and confirm approval for <b>{m.full_name}</b>.</DialogDescription>
                                    <ApproveRoleSelect member={m} onApprove={(role) => approve(m.id, role)} />
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10 border-red-500/20">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-card border-border">
                                  <DialogHeader>
                                    <DialogTitle>Reject Application</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to reject <b>{m.full_name}</b>? This action cannot be undone.
                                    </DialogDescription>
                                    <div className="mt-4 flex gap-2 justify-end">
                                      <Button variant="ghost" onClick={() => { }}>Cancel</Button>
                                      <Button variant="destructive" onClick={() => reject(m.id)}>Confirm Rejection</Button>
                                    </div>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => navigate(`/admin/members/${m.id}`)}
                                className="h-8 text-xs"
                              >
                                View Profile
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-border bg-card h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={approveAll} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                Approve All Pending
              </Button>
              <Button onClick={autoAssignRoles} variant="outline" className="w-full border-border hover:bg-white/5">
                Auto-Assign Roles
              </Button>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Stats</p>
                <div className="flex justify-between text-sm mb-1">
                  <span>Pending</span>
                  <span className="font-bold text-amber-500">{pending.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Members</span>
                  <span className="font-bold">{members.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MemberApproval;
