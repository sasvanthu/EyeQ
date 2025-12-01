import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Link as LinkIcon, Calendar, Trophy, Flame, Github, Twitter, Linkedin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlassCard from '@/components/eyeq/GlassCard';
import NeonButton from '@/components/eyeq/NeonButton';

const Profile = () => {
    const user = {
        name: "Alex Chen",
        username: "@alexc",
        role: "Full Stack Developer",
        bio: "Building the future of web with React & AI. EyeQ Club Member since 2024.",
        location: "Chennai, India",
        website: "alexchen.dev",
        joinDate: "August 2024",
        avatar: "/avatars/alex.jpg",
        stats: {
            streak: 12,
            xp: 2450,
            projects: 8,
            badges: 5
        },
        skills: ["React", "TypeScript", "Node.js", "Python", "TailwindCSS", "PostgreSQL"]
    };

    return (
        <div className="max-w-5xl mx-auto p-6 pb-20 space-y-8">
            {/* Profile Header */}
            <div className="relative">
                {/* Banner */}
                <div className="h-48 rounded-2xl bg-gradient-to-r from-cyan-900 via-blue-900 to-purple-900 overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>

                {/* Profile Info */}
                <div className="px-6 relative -mt-16 flex flex-col md:flex-row items-end md:items-end gap-6">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur opacity-75"></div>
                        <Avatar className="h-32 w-32 border-4 border-black relative z-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-black text-3xl font-bold text-cyan-400">AC</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-2 right-2 z-20 bg-black border border-cyan-500/30 rounded-full p-1.5 shadow-lg">
                            <div className="flex items-center gap-1 px-2">
                                <Flame className="text-orange-500 fill-orange-500 animate-pulse" size={16} />
                                <span className="text-xs font-bold text-white">{user.stats.streak}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 mb-2 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                        <p className="text-gray-400 font-medium">{user.username}</p>
                    </div>

                    <div className="flex gap-3 mb-4">
                        <NeonButton variant="ghost" size="sm">Edit Profile</NeonButton>
                        <NeonButton size="sm">Share</NeonButton>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Sidebar: About & Stats */}
                <div className="space-y-6">
                    <GlassCard className="p-6 space-y-4">
                        <div>
                            <h2 className="text-lg font-bold text-white mb-2">About</h2>
                            <p className="text-gray-400 text-sm leading-relaxed">{user.bio}</p>
                        </div>

                        <div className="space-y-2 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-cyan-500" />
                                <span>{user.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <LinkIcon size={16} className="text-cyan-500" />
                                <a href="#" className="hover:text-cyan-400 transition-colors">{user.website}</a>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-cyan-500" />
                                <span>Joined {user.joinDate}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex gap-4 justify-center">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map(skill => (
                                <Badge key={skill} variant="secondary" className="bg-white/5 text-gray-300 hover:bg-white/10 border-white/10">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Stats</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                                <div className="text-2xl font-bold text-white">{user.stats.xp}</div>
                                <div className="text-xs text-purple-400 uppercase font-bold">Total XP</div>
                            </div>
                            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                                <div className="text-2xl font-bold text-white">{user.stats.projects}</div>
                                <div className="text-xs text-cyan-400 uppercase font-bold">Projects</div>
                            </div>
                            <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center">
                                <div className="text-2xl font-bold text-white">{user.stats.badges}</div>
                                <div className="text-xs text-yellow-400 uppercase font-bold">Badges</div>
                            </div>
                            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
                                <div className="text-2xl font-bold text-white">{user.stats.streak}</div>
                                <div className="text-xs text-orange-400 uppercase font-bold">Streak</div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Right Content: Tabs */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="projects" className="w-full">
                        <TabsList className="w-full bg-black/40 border border-white/10 p-1 rounded-xl mb-6">
                            <TabsTrigger value="projects" className="flex-1 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">Projects</TabsTrigger>
                            <TabsTrigger value="activity" className="flex-1 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">Activity</TabsTrigger>
                            <TabsTrigger value="achievements" className="flex-1 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">Achievements</TabsTrigger>
                        </TabsList>

                        <TabsContent value="projects" className="space-y-4">
                            {[1, 2].map(i => (
                                <GlassCard key={i} className="p-4 flex gap-4 hover:bg-white/5 transition-colors group">
                                    <div className="h-24 w-40 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex-shrink-0"></div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">Project Title {i}</h3>
                                        <p className="text-sm text-gray-400 mb-2">A short description of the project goes here.</p>
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className="text-xs border-white/10 text-gray-500">React</Badge>
                                            <Badge variant="outline" className="text-xs border-white/10 text-gray-500">Node.js</Badge>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </TabsContent>

                        <TabsContent value="activity">
                            <GlassCard className="p-8 text-center text-gray-500">
                                Activity feed coming soon...
                            </GlassCard>
                        </TabsContent>

                        <TabsContent value="achievements" className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <GlassCard key={i} className="p-4 flex flex-col items-center text-center gap-2 hover:bg-white/5 transition-colors">
                                    <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                                        <Trophy size={24} className="text-yellow-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Achievement {i}</h4>
                                        <p className="text-xs text-gray-500">Unlocked 2 days ago</p>
                                    </div>
                                </GlassCard>
                            ))}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default Profile;
