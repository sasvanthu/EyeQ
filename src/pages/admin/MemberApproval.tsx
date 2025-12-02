import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRequests, updateRequestStatus, createMember } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AdminLayout from '@/components/eyeq/AdminLayout';

const MemberApproval = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: fetchRequests,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, requestData }: { id: number, status: 'approved' | 'rejected', requestData?: any }) => {
      // 1. Update request status
      await updateRequestStatus(id, status);

      // 2. If approved, create a profile (Note: Auth user creation is separate)
      if (status === 'approved' && requestData) {
        // We can't create the Auth User here without Service Role, so we just create the profile
        // The Admin must manually create the Auth User in Supabase Dashboard to match this email/id
        // OR we assume the Auth User will be created later and linked.

        // Actually, 'profiles' relies on 'id' being the Auth ID. 
        // Since we don't have the Auth ID yet, we CANNOT create the profile row correctly linked to auth.
        // So, we will just mark the request as approved. 
        // The workflow should be: Admin sees approved request -> Admin goes to Supabase -> Creates User -> User ID is generated -> Admin creates Profile (or User fills it on first login).

        // REVISED FLOW: 
        // 1. Admin clicks Approve.
        // 2. Request marked 'approved'.
        // 3. Admin manually invites user or creates account.

        return;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast({
        title: "Status Updated",
        description: "The request has been processed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAction = (id: number, status: 'approved' | 'rejected', request: any) => {
    updateStatusMutation.mutate({ id, status, requestData: request });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const pendingRequests = requests?.filter((r: any) => r.status === 'pending') || [];
  const processedRequests = requests?.filter((r: any) => r.status !== 'pending') || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Member Requests</h2>
        <p className="text-muted-foreground">Review and manage applications to join the club.</p>
      </div>

      {pendingRequests.length === 0 && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Pending Requests</h3>
            <p className="text-muted-foreground">All caught up! Check back later for new applicants.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pendingRequests.map((request: any) => (
          <Card key={request.id} className="relative overflow-hidden border-l-4 border-l-yellow-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{request.full_name}</CardTitle>
                  <CardDescription>{request.email}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                  Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <p className="font-medium text-muted-foreground mb-1">Department</p>
                <p>{request.department}</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-muted-foreground mb-1">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {request.skills?.map((skill: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-sm">
                <p className="font-medium text-muted-foreground mb-1">Reason for Joining</p>
                <p className="text-muted-foreground italic">"{request.reason}"</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleAction(request.id, 'approved', request)}
                  disabled={updateStatusMutation.isPending}
                >
                  <Check className="w-4 h-4 mr-2" /> Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleAction(request.id, 'rejected', request)}
                  disabled={updateStatusMutation.isPending}
                >
                  <X className="w-4 h-4 mr-2" /> Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {processedRequests.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">History</h3>
          <div className="rounded-md border">
            <div className="p-4 grid grid-cols-4 gap-4 font-medium border-b bg-muted/50">
              <div>Name</div>
              <div>Email</div>
              <div>Status</div>
              <div>Date</div>
            </div>
            {processedRequests.map((request: any) => (
              <div key={request.id} className="p-4 grid grid-cols-4 gap-4 border-b last:border-0 items-center">
                <div>{request.full_name}</div>
                <div className="text-muted-foreground text-sm">{request.email}</div>
                <div>
                  <Badge variant={request.status === 'approved' ? 'default' : 'destructive'}>
                    {request.status}
                  </Badge>
                </div>
                <div className="text-muted-foreground text-sm">
                  {new Date(request.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberApproval;
