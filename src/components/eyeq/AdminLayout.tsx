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

const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <SidebarProvider>
            <div className="admin-theme min-h-screen flex flex-col md:flex-row bg-background text-foreground">
                <Sidebar side="left" className="w-[var(--sidebar-width)] z-30 border-r border-border bg-card">
                    <SidebarHeader>
                        <Link to="/" className="flex items-center gap-3 px-2 py-3">
                            <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/50">
                                <span className="font-bold text-amber-500 text-xl">A</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-amber-500">EyeQ Admin</span>
                                <span className="text-xs text-muted-foreground">Control Center</span>
                            </div>
                        </Link>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-amber-500/80">Management</SidebarGroupLabel>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild className="hover:bg-amber-500/10 hover:text-amber-500 data-[active=true]:bg-amber-500/20 data-[active=true]:text-amber-500">
                                        <Link to="/admin/dashboard">Dashboard</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild className="hover:bg-amber-500/10 hover:text-amber-500">
                                        <Link to="/admin/members">Approvals</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild className="hover:bg-amber-500/10 hover:text-amber-500">
                                        <Link to="/admin/events">Events</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild className="hover:bg-amber-500/10 hover:text-amber-500">
                                        <Link to="/admin/analytics">Analytics</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild className="hover:bg-amber-500/10 hover:text-amber-500">
                                        <Link to="/admin/chat">Chat Logs</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild className="hover:bg-amber-500/10 hover:text-amber-500">
                                        <Link to="/admin/portfolio">Portfolio</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild className="hover:bg-amber-500/10 hover:text-amber-500">
                                        <Link to="/admin/gallery">Gallery</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild className="hover:bg-amber-500/10 hover:text-amber-500">
                                        <Link to="/admin/alumni">Alumni</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter>
                        <div className="px-2 py-3">
                            <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-black/20 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 border border-amber-500/30">
                                        <AvatarImage src="/team/President.JPG" alt="Admin Avatar" />
                                        <AvatarFallback className="bg-amber-500/20 text-amber-500">AS</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-foreground">Aswath</span>
                                        <span className="text-xs text-amber-500">Super Admin</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="p-1.5 text-muted-foreground hover:text-amber-500 transition-colors">
                                        <Bell size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SidebarFooter>
                </Sidebar>
                <SidebarInset className="p-4 md:p-6 bg-background/50">
                    {/* Topbar */}
                    <div className="flex items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
                        <div className="flex items-center gap-3">
                            <SidebarTrigger />
                            <h2 className="text-xl font-bold text-foreground">Admin Console</h2>
                            <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">PRO</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-xs text-muted-foreground">Last login: Today, 10:30 AM</div>
                        </div>
                    </div>
                    {/* Content */}
                    {children}
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};

export default AdminLayout;
