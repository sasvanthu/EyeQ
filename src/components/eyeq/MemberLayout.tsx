import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
    Sidebar,
    SidebarProvider,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
    SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bell } from 'lucide-react';
import GlassCard from './GlassCard';
import NeonButton from './NeonButton';
import { NeonLogo } from '@/components/eyeq';

const MemberLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
                <Sidebar side="left" className="w-[var(--sidebar-width)] z-30">
                    <SidebarHeader>
                        <Link to="/" className="flex items-center gap-3 px-2 py-3">
                            <NeonLogo className="h-10 w-10" />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">EyeQ Club</span>
                                <span className="text-xs text-muted-foreground">Member Portal</span>
                            </div>
                        </Link>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Menu</SidebarGroupLabel>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to="/dashboard">Home</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to="/projects">Projects</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to="/learning">Learning Log</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to="/profile">My Profile</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter>
                        <div className="px-2 py-3">
                            <GlassCard className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src="/avatars/alex.jpg" alt="User Avatar" />
                                        <AvatarFallback>AC</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">Alex Chen</span>
                                        <span className="text-xs text-muted-foreground">Member</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <NeonButton variant="ghost">Settings</NeonButton>
                                    <NeonButton variant="ghost">Logout</NeonButton>
                                </div>
                            </GlassCard>
                        </div>
                    </SidebarFooter>
                </Sidebar>
                <SidebarInset className="p-4 md:p-6">
                    {/* Topbar */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <SidebarTrigger />
                            <h2 className="text-xl font-bold">Member Dashboard</h2>
                            <div className="text-xs text-muted-foreground">Welcome back, Alex!</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-md neon-outline neon-glow"><Bell /></button>
                        </div>
                    </div>
                    {/* Content */}
                    {children}
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};

export default MemberLayout;
