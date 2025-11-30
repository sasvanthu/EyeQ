import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMembers, updateMember, deleteMember } from '@/lib/supabase';
import EyeQLayout from '@/components/eyeq/EyeQLayout';
import GlassCard from '@/components/eyeq/GlassCard';
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const ApproveRoleSelect: React.FC<{ member: any; onApprove: (role?: string) => void }> = ({ member, onApprove }) => {
  const [selected, setSelected] = useState(member.role || 'Member');
  return (
    <div className='grid grid-cols-1 gap-2 mt-3'>
      <select value={selected} onChange={(e) => setSelected(e.target.value)} className='bg-transparent border p-2 rounded-md'>
        <option>Member</option>
        <option>PR</option>
        <option>Events</option>
        <option>Tech Lead</option>
        <option>Vice President</option>
        <option>Admin</option>
      </select>
      <div className='flex gap-2 justify-end'>
        <Button onClick={() => onApprove(selected)}>Approve</Button>
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
    // This would ideally be a batch update or server-side function.
    // For now, we'll just show a toast that it's not fully implemented client-side for batch.
    toast({ title: "Auto-Assign", description: "Batch auto-assign is not yet implemented." });
  };

  const approveAll = async () => {
    // Batch approve logic would go here
    toast({ title: "Approve All", description: "Batch approve is not yet implemented." });
  };

  return (
    <EyeQLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold">Member Approvals</h3>
            <div className="text-sm text-muted-foreground">Review incoming member applications</div>
          </div>
          <div className="flex items-center gap-2">
            <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search by name or email" />
            <Button variant="ghost">Import CSV</Button>
            <Button onClick={autoAssignRoles} variant="outline">Auto-Assign Roles</Button>
            <Button onClick={approveAll}>Approve All</Button>
          </div>
        </div>
        <GlassCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : pending.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No pending approvals.</TableCell>
                </TableRow>
              ) : (
                pending
                  .filter((m: any) => (m.full_name || '').toLowerCase().includes(filter.toLowerCase()) || m.email.toLowerCase().includes(filter.toLowerCase()))
                  .map((m: any) => (
                    <TableRow key={m.id}>
                      <TableCell>{m.full_name}</TableCell>
                      <TableCell>{m.email}</TableCell>
                      <TableCell>{m.role}</TableCell>
                      <TableCell>{new Date(m.joined_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" className="text-green-400 hover:text-green-300"><Check className="h-4 w-4" /></Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Approve Member</DialogTitle>
                                <DialogDescription>Assign a role and confirm approval for this member.</DialogDescription>
                                <ApproveRoleSelect member={m} onApprove={(role) => approve(m.id, role)} />
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" className="text-red-400 hover:text-red-300"><X className="h-4 w-4" /></Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Member</DialogTitle>
                                <DialogDescription>Are you sure you want to reject this member? This action cannot be undone.</DialogDescription>
                                <div className="mt-3 flex gap-2 justify-end">
                                  <Button variant="destructive" onClick={() => reject(m.id)}>Reject</Button>
                                </div>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">View</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Member Profile: {m.full_name}</DialogTitle>
                                <DialogDescription>
                                  <div className='space-y-2 mt-2'>
                                    <div><b>Email:</b> {m.email}</div>
                                    <div><b>Role:</b> {m.role}</div>
                                    <div><b>Joined:</b> {new Date(m.joined_at).toLocaleDateString()}</div>
                                    <div className='mt-2 text-sm text-muted-foreground'>Full profile details & resume upload will be implemented here.</div>
                                  </div>
                                </DialogDescription>
                                <div className='mt-4 flex gap-2 justify-end'>
                                  <Button variant='ghost' onClick={() => navigate(`/admin/members/${m.id}`)}>Open Profile</Button>
                                </div>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </GlassCard>
      </div>
    </EyeQLayout>
  );
};

export default MemberApproval;
