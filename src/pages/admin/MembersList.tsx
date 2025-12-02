import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMembers, deleteMember } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, UserCog, MoreVertical } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoaderOne } from "@/components/ui/loader";

const MembersList = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: members, isLoading } = useQuery({
        queryKey: ['members'],
        queryFn: fetchMembers,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
            toast({
                title: "Member Deleted",
                description: "The member has been removed from the system.",
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

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this member? This action cannot be undone.")) {
            deleteMutation.mutate(id);
        }
    };

    const filteredMembers = members?.filter((member: any) =>
        member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoaderOne />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Members Directory</h2>
                    <p className="text-muted-foreground">Manage all registered members and admins.</p>
                </div>
                <Button onClick={() => navigate('/admin/members')}>
                    Review Requests
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Members ({filteredMembers.length})</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search members..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredMembers.map((member: any) => (
                            <div key={member.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10 border border-border">
                                        <AvatarImage src={member.avatar_url} />
                                        <AvatarFallback>{member.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium flex items-center gap-2">
                                            {member.full_name}
                                            {member.role === 'admin' && <Badge variant="secondary" className="text-xs">Admin</Badge>}
                                        </div>
                                        <div className="text-sm text-muted-foreground">{member.email}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="hidden md:block text-sm text-right mr-4">
                                        <div className="text-foreground">{member.department || 'No Dept'}</div>
                                        <div className="text-muted-foreground text-xs">Joined {new Date(member.created_at).toLocaleDateString()}</div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => navigate(`/admin/members/${member.id}`)}>
                                                <UserCog className="mr-2 h-4 w-4" /> View Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(member.id)}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete Member
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}

                        {filteredMembers.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                No members found matching your search.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MembersList;
