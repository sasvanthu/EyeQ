import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Upload, BookOpen, MessageSquare, Bell, Zap, Calendar, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import GlassCard from '@/components/eyeq/GlassCard';
import NeonButton from '@/components/eyeq/NeonButton';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';
import { fetchMember, fetchUserProjects, fetchUserLogs, fetchUserNotifications } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

const DashboardHome = () => {
    const { user } = useAuth();

    // Fetch User Profile
    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ['profile', user?.id],
        queryFn: () => fetchMember(user?.id!),
        enabled: !!user?.id,
    });

    // Fetch User Projects
    const { data: projects, isLoading: projectsLoading } = useQuery({
        queryKey: ['user-projects', user?.id],
        queryFn: () => fetchUserProjects(user?.id!),
        enabled: !!user?.id,
    });

    // Fetch User Logs
    const { data: logs, isLoading: logsLoading } = useQuery({
        queryKey: ['user-logs', user?.id],
        queryFn: () => fetchUserLogs(user?.id!),
        enabled: !!user?.id,
    });

    // Fetch Notifications
    const { data: notifications, isLoading: notificationsLoading } = useQuery({
        queryKey: ['user-notifications', user?.id],
        queryFn: () => fetchUserNotifications(user?.id!),
        enabled: !!user?.id,
    });

    // Combine recent updates
    const recentUpdates = [
        ...(projects?.map((p: any) => ({
            id: `proj-${p.id}`,
            type: 'project',
            title: p.title,
            action: 'uploaded',
            time: p.created_at
        })) || []),
        ...(logs?.map((l: any) => ({
            id: `log-${l.id}`,
            type: 'learning',
            title: l.title,
            action: 'logged',
            time: l.date
        })) || [])
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

    if (profileLoading) {
        return <div className="flex items-center justify-center h-full min-h-[50vh]"><Loader2 className="animate-spin text-cyan-500" size={48} /></div>;
    }

    // Default values if profile is missing (shouldn't happen for valid members)
    const displayUser = {
        name: profile?.full_name || user?.email?.split('@')[0] || "Member",
        role: profile?.role || "Member",
        avatar: profile?.avatar_url || "",
        streak: profile?.streaks?.current || 0,
        xp: profile?.xp || 0, // Assuming XP is added to profile, else 0
        nextLevelXp: 1000, // Placeholder
        level: Math.floor((profile?.xp || 0) / 1000) + 1
    };

    return (
        <div className="space-y-8 p-6 pb-20">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/5 p-8"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={120} />
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full blur opacity-75"></div>
                        <Avatar className="h-24 w-24 border-2 border-black relative">
                            <AvatarImage src={displayUser.avatar} />
                            <AvatarFallback className="bg-black text-2xl font-bold text-cyan-400">
                                {displayUser.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-black border border-cyan-500/30 rounded-full p-1.5 shadow-lg shadow-cyan-500/20">
                            <div className="flex items-center gap-1 px-2">
                                <Flame className="text-orange-500 fill-orange-500 animate-pulse" size={16} />
                                <span className="text-xs font-bold text-white">{displayUser.streak}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-2">
                        <h1 className="text-3xl font-bold text-white">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{displayUser.name}</span>
                        </h1>
                        <p className="text-gray-400 capitalize">{displayUser.role} • Level {displayUser.level}</p>

                        <div className="flex items-center gap-4 max-w-md mt-2">
                            <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-cyan-400 font-medium">{displayUser.xp} XP</span>
                                    <span className="text-gray-500">{displayUser.nextLevelXp} XP</span>
                                </div>
                                <Progress value={(displayUser.xp / displayUser.nextLevelXp) * 100} className="h-2 bg-gray-800" indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <GlassCard className="p-3 flex flex-col items-center justify-center w-24 hover:border-cyan-500/50 transition-colors cursor-pointer group">
                            <Trophy className="text-yellow-500 mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-xs text-gray-300">Projects</span>
                            <span className="text-sm font-bold">{projects?.length || 0}</span>
                        </GlassCard>
                        <GlassCard className="p-3 flex flex-col items-center justify-center w-24 hover:border-cyan-500/50 transition-colors cursor-pointer group">
                            <Calendar className="text-green-500 mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-xs text-gray-300">Logs</span>
                            <span className="text-sm font-bold">{logs?.length || 0}</span>
                        </GlassCard>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/projects/new" className="group">
                    <GlassCard className="h-full p-6 flex flex-col items-center text-center gap-4 hover:bg-white/5 transition-all border-l-4 border-l-cyan-500">
                        <div className="p-4 rounded-full bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                            <Upload size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Upload Project</h3>
                            <p className="text-sm text-gray-400">Share your latest build with the community</p>
                        </div>
                    </GlassCard>
                </Link>

                <Link to="/learning" className="group">
                    <GlassCard className="h-full p-6 flex flex-col items-center text-center gap-4 hover:bg-white/5 transition-all border-l-4 border-l-purple-500">
                        <div className="p-4 rounded-full bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                            <BookOpen size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Daily Log</h3>
                            <p className="text-sm text-gray-400">Update your learning streak & notes</p>
                        </div>
                    </GlassCard>
                </Link>
            </div>

            {/* Recent Updates & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Zap className="text-yellow-400" size={20} /> Recent Activity
                        </h2>
                        <NeonButton variant="ghost" size="sm">View All</NeonButton>
                    </div>

                    <div className="space-y-3">
                        {recentUpdates.length === 0 ? (
                            <p className="text-gray-500 text-sm">No recent activity.</p>
                        ) : (
                            recentUpdates.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <GlassCard className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                                        <div className={`p-2 rounded-lg ${item.type === 'project' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-purple-500/20 text-purple-400'
                                            }`}>
                                            {item.type === 'project' ? <Upload size={18} /> : <BookOpen size={18} />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium">
                                                {item.action === 'uploaded' ? 'Uploaded new project' :
                                                    'Logged learning activity'}: <span className="text-cyan-400">{item.title}</span>
                                            </p>
                                            <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(item.time), { addSuffix: true })}</p>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Bell className="text-red-400" size={20} /> Notifications
                        </h2>
                        <button className="text-xs text-gray-400 hover:text-white">Mark all read</button>
                    </div>

                    <GlassCard className="p-0 overflow-hidden">
                        {notificationsLoading ? (
                            <div className="p-4 text-center"><Loader2 className="animate-spin inline" /></div>
                        ) : notifications?.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">No new notifications</div>
                        ) : (
                            notifications?.map((notif: any) => (
                                <div key={notif.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                                    <div className="flex gap-3">
                                        <div className={`h-2 w-2 mt-2 rounded-full ${notif.is_read ? 'bg-transparent' : 'bg-blue-500'}`}></div>
                                        <div>
                                            <p className="text-sm text-gray-200">{notif.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
