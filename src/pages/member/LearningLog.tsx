import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar as CalendarIcon, Save, Share2, Plus, CheckCircle2 } from 'lucide-react';
import GlassCard from '@/components/eyeq/GlassCard';
import NeonButton from '@/components/eyeq/NeonButton';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

const LearningLog = () => {
    const [logContent, setLogContent] = useState('');
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Mock data for heatmap
    const activityData = Array.from({ length: 365 }).map((_, i) => ({
        date: new Date(Date.now() - (364 - i) * 24 * 60 * 60 * 1000),
        count: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
    }));

    const recentLogs = [
        { id: 1, date: 'Today', content: 'Learned about React Context API and how to avoid prop drilling.', tags: ['React', 'State Management'] },
        { id: 2, date: 'Yesterday', content: 'Built a simple REST API using Express and MongoDB.', tags: ['Node.js', 'Backend'] },
        { id: 3, date: '2 days ago', content: 'Solved 3 LeetCode problems on Arrays and Hashing.', tags: ['DSA', 'Python'] },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 pb-20">
            {/* Left Column: Editor & Streak */}
            <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Daily Learning Log</h1>
                        <p className="text-gray-400">Track your journey, one day at a time.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full">
                        <Flame className="text-orange-500 fill-orange-500 animate-pulse" />
                        <span className="text-xl font-bold text-orange-500">12 Day Streak</span>
                    </div>
                </div>

                {/* Editor */}
                <GlassCard className="p-6 space-y-4 border-l-4 border-l-purple-500">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold text-white">What did you learn today?</h2>
                        <span className="text-sm text-gray-400">{date?.toLocaleDateString()}</span>
                    </div>

                    <Textarea
                        value={logContent}
                        onChange={(e) => setLogContent(e.target.value)}
                        placeholder="I learned about..."
                        className="min-h-[200px] bg-black/20 border-white/10 focus:border-purple-500/50 text-lg resize-none p-4"
                    />

                    <div className="flex justify-between items-center pt-2">
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5">
                                <Plus size={16} className="mr-1" /> Add Image
                            </Button>
                            <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5">
                                <Plus size={16} className="mr-1" /> Add Code Snippet
                            </Button>
                        </div>
                        <NeonButton className="px-6">
                            <Save size={18} className="mr-2" /> Save Log
                        </NeonButton>
                    </div>
                </GlassCard>

                {/* Recent Logs Timeline */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                    <div className="relative border-l-2 border-white/10 ml-3 space-y-8 pl-8 py-2">
                        {recentLogs.map((log, i) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative"
                            >
                                <div className="absolute -left-[41px] top-0 h-5 w-5 rounded-full bg-black border-2 border-purple-500 z-10"></div>
                                <GlassCard className="p-4 hover:bg-white/5 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm font-bold text-purple-400">{log.date}</span>
                                        <div className="flex gap-2">
                                            <button className="text-gray-500 hover:text-white"><Share2 size={14} /></button>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mb-3">{log.content}</p>
                                    <div className="flex gap-2">
                                        {log.tags.map(tag => (
                                            <span key={tag} className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Calendar & Stats */}
            <div className="space-y-6">
                <GlassCard className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <CalendarIcon size={18} className="text-cyan-400" /> Activity Calendar
                    </h3>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border border-white/10 bg-black/20 pointer-events-none"
                    />
                    <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-500">
                        <span>Less</span>
                        <div className="flex gap-1">
                            <div className="h-3 w-3 rounded-sm bg-gray-800"></div>
                            <div className="h-3 w-3 rounded-sm bg-purple-900"></div>
                            <div className="h-3 w-3 rounded-sm bg-purple-700"></div>
                            <div className="h-3 w-3 rounded-sm bg-purple-500"></div>
                            <div className="h-3 w-3 rounded-sm bg-purple-300"></div>
                        </div>
                        <span>More</span>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white mb-2">Weekly Goals</h3>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-green-500" size={20} />
                            <span className="text-gray-300 line-through decoration-gray-500">Log 3 days in a row</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 rounded-full border-2 border-gray-600"></div>
                            <span className="text-gray-300">Complete 1 project</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 rounded-full border-2 border-gray-600"></div>
                            <span className="text-gray-300">Help 2 peers in chat</span>
                        </div>
                    </div>

                    <div className="pt-4 mt-2 border-t border-white/10">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Weekly XP</span>
                            <span className="text-white font-bold">350 / 500</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 w-[70%]"></div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default LearningLog;
