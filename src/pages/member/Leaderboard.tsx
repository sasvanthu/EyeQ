import React, { useState } from 'react';
import MemberLayout from '@/components/eyeq/MemberLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboard } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Star, TrendingUp } from 'lucide-react';
import { LoaderOne } from '@/components/ui/loader';
import { motion } from 'framer-motion';

const Leaderboard = () => {
    const [filter, setFilter] = useState<'all' | 'monthly'>('all');

    const { data: leaderboard, isLoading } = useQuery({
        queryKey: ['leaderboard', filter],
        queryFn: fetchLeaderboard,
    });

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Trophy className="w-6 h-6 text-yellow-500" />;
            case 1: return <Medal className="w-6 h-6 text-gray-400" />;
            case 2: return <Medal className="w-6 h-6 text-amber-700" />;
            default: return <span className="text-muted-foreground font-bold w-6 text-center">{index + 1}</span>;
        }
    };

    return (
        <MemberLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Leaderboard</h2>
                        <p className="text-muted-foreground">Top performing members of the community.</p>
                    </div>
                    <div className="flex gap-2 bg-muted p-1 rounded-lg">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            All Time
                        </button>
                        <button
                            onClick={() => setFilter('monthly')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'monthly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            This Month
                        </button>
                    </div>
                </div>

                {/* Top 3 Cards */}
                {!isLoading && leaderboard && leaderboard.length >= 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* 2nd Place */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="order-2 md:order-1 mt-4 md:mt-8"
                        >
                            <Card className="border-gray-400/50 bg-gradient-to-b from-gray-400/10 to-transparent">
                                <CardContent className="flex flex-col items-center p-6">
                                    <div className="relative mb-4">
                                        <Avatar className="w-20 h-20 border-4 border-gray-400">
                                            <AvatarImage src={leaderboard[1].avatar_url} />
                                            <AvatarFallback>{leaderboard[1].full_name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                                            #2
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg text-center">{leaderboard[1].full_name}</h3>
                                    <p className="text-muted-foreground text-sm mb-2">{leaderboard[1].project_count} Projects</p>
                                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                                        <Star className="w-4 h-4 fill-current" />
                                        {leaderboard[1].score}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* 1st Place */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="order-1 md:order-2"
                        >
                            <Card className="border-yellow-500/50 bg-gradient-to-b from-yellow-500/10 to-transparent transform md:-translate-y-4 shadow-lg shadow-yellow-500/10">
                                <CardContent className="flex flex-col items-center p-6">
                                    <div className="relative mb-4">
                                        <Avatar className="w-24 h-24 border-4 border-yellow-500">
                                            <AvatarImage src={leaderboard[0].avatar_url} />
                                            <AvatarFallback>{leaderboard[0].full_name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                            <Trophy className="w-8 h-8 text-yellow-500 fill-yellow-500/20" />
                                        </div>
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                                            #1
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-xl text-center">{leaderboard[0].full_name}</h3>
                                    <Badge variant="secondary" className="mb-2 bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30">Top Performer</Badge>
                                    <p className="text-muted-foreground text-sm mb-2">{leaderboard[0].project_count} Projects</p>
                                    <div className="flex items-center gap-1 text-amber-500 font-bold text-lg">
                                        <Star className="w-5 h-5 fill-current" />
                                        {leaderboard[0].score}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* 3rd Place */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="order-3 mt-4 md:mt-8"
                        >
                            <Card className="border-amber-700/50 bg-gradient-to-b from-amber-700/10 to-transparent">
                                <CardContent className="flex flex-col items-center p-6">
                                    <div className="relative mb-4">
                                        <Avatar className="w-20 h-20 border-4 border-amber-700">
                                            <AvatarImage src={leaderboard[2].avatar_url} />
                                            <AvatarFallback>{leaderboard[2].full_name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            #3
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg text-center">{leaderboard[2].full_name}</h3>
                                    <p className="text-muted-foreground text-sm mb-2">{leaderboard[2].project_count} Projects</p>
                                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                                        <Star className="w-4 h-4 fill-current" />
                                        {leaderboard[2].score}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                )}

                {/* Full List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Rankings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center p-8"><LoaderOne /></div>
                        ) : leaderboard?.length === 0 ? (
                            <p className="text-center text-muted-foreground p-8">No data available yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {leaderboard?.map((user: any, index: number) => (
                                    <div
                                        key={user.user_id}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 flex justify-center">
                                                {getRankIcon(index)}
                                            </div>
                                            <Avatar className="w-10 h-10 border border-border">
                                                <AvatarImage src={user.avatar_url} />
                                                <AvatarFallback>{user.full_name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{user.full_name}</div>
                                                <div className="text-xs text-muted-foreground md:hidden">
                                                    {user.project_count} Projects • {user.score} pts
                                                </div>
                                            </div>
                                        </div>

                                        <div className="hidden md:flex items-center gap-8 text-sm">
                                            <div className="text-muted-foreground w-24 text-right">
                                                <span className="font-medium text-foreground">{user.project_count}</span> Projects
                                            </div>
                                            <div className="font-bold text-amber-500 w-16 text-right">
                                                {user.score} pts
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MemberLayout>
    );
};

export default Leaderboard;
