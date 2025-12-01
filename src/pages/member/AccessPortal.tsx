import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    UploadCloud,
    ChevronRight,
    Zap,
    MessageSquare,
    LogOut,
    User,
    FileText,
    Flame,
    Bell,
    ArrowRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

const AccessPortal: React.FC = () => {
    const { user, signOut } = useAuth();

    // Mock data for the UI
    const stats = [
        { label: 'Streak', value: '12 Days', icon: Flame, color: 'text-orange-500' },
        { label: 'Messages', value: '1 New', icon: MessageSquare, color: 'text-blue-400' },
        { label: 'Updates', value: '3 Pending', icon: Bell, color: 'text-yellow-400' },
        { label: 'Projects', value: '0 This Week', icon: UploadCloud, color: 'text-purple-400' },
    ];

    const news = [
        { title: 'Weekly Challenge: AI Chatbot', type: 'Challenge' },
        { title: 'Hackathon 2025 Registration Open', type: 'Event' },
        { title: 'New Badge: "Code Ninja" Available', type: 'Achievement' },
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-neon-blue selection:text-black font-sans overflow-x-hidden relative">
            {/* Background Ambient Glows */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            {/* Header Section */}
            <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,209,255,0.5)]">
                            <Zap className="text-white fill-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-wider">EyeQ<span className="text-neon-blue">Club</span></h1>
                            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Member Access Portal</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-medium text-muted-foreground">System Online</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => signOut()} className="text-muted-foreground hover:text-white hover:bg-white/10">
                            <LogOut size={20} />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12 relative z-10">

                {/* Welcome & Profile Preview */}
                <div className="flex flex-col lg:flex-row gap-8 mb-16">
                    <div className="flex-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                                Welcome back, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-purple-500">
                                    {user?.user_metadata?.full_name || 'Member'}
                                </span>
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl">
                                Your space to learn, build, collaborate, and grow. Ready to continue your journey?
                            </p>
                        </motion.div>

                        {/* Today's Summary Stat Bar */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                            {stats.map((stat, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`p-2 rounded-lg bg-black/40 ${stat.color}`}>
                                            <stat.icon size={16} />
                                        </div>
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                                    </div>
                                    <div className="text-xl font-bold group-hover:text-neon-blue transition-colors">{stat.value}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Mini Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="w-full lg:w-80"
                    >
                        <div className="p-6 rounded-2xl bg-gradient-to-b from-white/10 to-black/40 border border-white/10 backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 rounded-full bg-neon-blue blur-md opacity-50" />
                                    <Avatar className="w-24 h-24 border-2 border-neon-blue relative">
                                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                                        <AvatarFallback className="bg-black text-neon-blue text-2xl font-bold">
                                            {(user?.user_metadata?.full_name || 'M').charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute bottom-0 right-0 bg-black rounded-full p-1 border border-white/20">
                                        <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-1">{user?.user_metadata?.full_name || 'Member'}</h3>
                                <p className="text-sm text-neon-blue mb-4">Level 5 Developer</p>

                                <div className="w-full grid grid-cols-2 gap-2 mb-4">
                                    <div className="p-2 rounded bg-black/30 border border-white/5">
                                        <div className="text-xs text-muted-foreground">XP</div>
                                        <div className="font-bold">1,250</div>
                                    </div>
                                    <div className="p-2 rounded bg-black/30 border border-white/5">
                                        <div className="text-xs text-muted-foreground">Badges</div>
                                        <div className="font-bold">8</div>
                                    </div>
                                </div>

                                <Link to="/profile" className="w-full">
                                    <Button variant="outline" className="w-full border-neon-blue/30 text-neon-blue hover:bg-neon-blue hover:text-black transition-all">
                                        View Full Profile
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Glowing Separator */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent mb-16" />

                {/* Quick Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
                    {/* Dashboard Card */}
                    <Link to="/dashboard" className="group">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="h-full p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md relative overflow-hidden group-hover:border-neon-blue/50 transition-colors"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-neon-blue group-hover:text-black transition-colors duration-300">
                                    <LayoutDashboard size={28} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Member Dashboard</h3>
                                <p className="text-muted-foreground mb-8 flex-1">
                                    Access your projects, daily logs, streaks, and badges. Your central command center.
                                </p>
                                <div className="flex items-center text-neon-blue font-medium group-hover:translate-x-2 transition-transform">
                                    Enter Dashboard <ArrowRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Upload Card */}
                    <Link to="/projects/new" className="group">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="h-full p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md relative overflow-hidden group-hover:border-green-500/50 transition-colors"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:text-black transition-colors duration-300">
                                    <UploadCloud size={28} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Upload Projects</h3>
                                <p className="text-muted-foreground mb-8 flex-1">
                                    Share your work with the world. Upload projects and document what you learned.
                                </p>
                                <div className="flex items-center text-green-500 font-medium group-hover:translate-x-2 transition-transform">
                                    Share Your Work <ArrowRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </div>

                {/* What's New Carousel */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold">What's New</h3>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="rounded-full border border-white/10 hover:bg-white/10"><ChevronRight className="rotate-180" /></Button>
                            <Button variant="ghost" size="icon" className="rounded-full border border-white/10 hover:bg-white/10"><ChevronRight /></Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {news.map((item, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/10 text-white group-hover:bg-neon-blue group-hover:text-black transition-colors">
                                        {item.type}
                                    </span>
                                    <ArrowRight size={14} className="text-muted-foreground group-hover:text-white -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                                </div>
                                <h4 className="font-semibold text-lg">{item.title}</h4>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions Bar */}
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                    <div className="flex items-center gap-2 p-2 rounded-full bg-black/80 border border-white/10 backdrop-blur-xl shadow-2xl shadow-neon-blue/20">
                        <Link to="/learning">
                            <Button variant="ghost" size="icon" className="rounded-full w-12 h-12 hover:bg-white/10 hover:text-purple-500" title="Daily Log">
                                <FileText size={20} />
                            </Button>
                        </Link>
                        <Link to="/projects/new">
                            <Button variant="ghost" size="icon" className="rounded-full w-12 h-12 bg-neon-blue text-black hover:bg-neon-blue/80 hover:scale-105 transition-all" title="Upload">
                                <UploadCloud size={24} />
                            </Button>
                        </Link>
                        <Link to="/profile">
                            <Button variant="ghost" size="icon" className="rounded-full w-12 h-12 hover:bg-white/10 hover:text-green-500" title="Profile">
                                <User size={20} />
                            </Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => signOut()} className="rounded-full w-12 h-12 hover:bg-white/10 hover:text-red-500" title="Log Out">
                            <LogOut size={20} />
                        </Button>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default AccessPortal;
