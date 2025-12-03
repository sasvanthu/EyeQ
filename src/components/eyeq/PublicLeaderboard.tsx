import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboard } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const PublicLeaderboard = () => {
    const { data: leaderboard, isLoading } = useQuery({
        queryKey: ['leaderboard', 'public'],
        queryFn: fetchLeaderboard,
    });

    const top5 = leaderboard?.slice(0, 5) || [];

    return (
        <section className="py-20 px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Top Performers</h2>
                    <p className="text-muted-foreground">Celebrating our most active contributors and innovators.</p>
                </div>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 shadow-2xl">
                    <CardHeader className="border-b border-border/50">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                            Leaderboard
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : top5.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground">
                                No data available yet.
                            </div>
                        ) : (
                            <div className="divide-y divide-border/50">
                                {top5.map((user: any, index: number) => (
                                    <motion.div
                                        key={user.user_id}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`
                        w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                        ${index === 0 ? 'bg-yellow-500 text-black' :
                                                    index === 1 ? 'bg-gray-400 text-black' :
                                                        index === 2 ? 'bg-amber-700 text-white' : 'bg-muted text-muted-foreground'}
                      `}>
                                                {index + 1}
                                            </div>
                                            <Avatar className="w-10 h-10 border border-border">
                                                <AvatarImage src={user.avatar_url} />
                                                <AvatarFallback>{user.full_name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{user.full_name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {user.project_count} Projects
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 font-bold text-amber-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            {user.score}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                        <div className="p-4 border-t border-border/50 bg-muted/20 text-center">
                            <Link to="/portal" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                                View Full Leaderboard <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default PublicLeaderboard;
