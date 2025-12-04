import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRequests, updateRequestStatus, createInvite } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2, UserPlus, Copy, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AdminLayout from '@/components/eyeq/AdminLayout';

const MemberApproval = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: fetchRequests,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'approved' | 'rejected' }) => {
      await updateRequestStatus(id, status);
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

  const sendInviteMutation = useMutation({
    mutationFn: async ({ requestId, email }: { requestId: string, email: string }) => {
      const inviteData = await createInvite(email, requestId);
      // Mark request as approved
      await updateRequestStatus(requestId, 'approved');
      return inviteData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast({
        title: "Invite Sent!",
        description: "The user will receive the invitation link.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error sending invite",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleApprove = (id: string, email: string) => {
    sendInviteMutation.mutate({ requestId: id, email });
  };

  const handleReject = (id: string) => {
    updateStatusMutation.mutate({ id, status: 'rejected' });
  };

  const copyToClipboard = (token: string, email: string) => {
    const inviteUrl = `${window.location.origin}/signup?invite=${token}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
    toast({
      title: "Link Copied!",
      description: `Invitation link for ${email} copied to clipboard.`,
    });
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
                  onClick={() => handleApprove(request.id, request.email)}
                  disabled={sendInviteMutation.isPending}
                >
                  <Mail className="w-4 h-4 mr-2" /> {sendInviteMutation.isPending ? 'Sending...' : 'Send Invite'}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleReject(request.id)}
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
