import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/eyeq/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMessages, sendMessage, subscribeToMessages } from '@/lib/supabase';
import { Send, Hash, Volume2, MessageSquare } from 'lucide-react';

const CHANNELS = [
    { id: 'general', name: 'General', icon: Hash },
    { id: 'announcements', name: 'Announcements', icon: Volume2 },
    { id: 'tech-talk', name: 'Tech Talk', icon: Hash },
    { id: 'random', name: 'Random', icon: Hash },
];

const Chat: React.FC = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [activeChannel, setActiveChannel] = useState('general');
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const { data: messages = [], isLoading } = useQuery({
        queryKey: ['messages', activeChannel],
        queryFn: () => fetchMessages(activeChannel),
    });

    useEffect(() => {
        // Subscribe to real-time changes
        const subscription = subscribeToMessages(activeChannel, (payload) => {
            // Optimistically update or invalidate query
            queryClient.invalidateQueries({ queryKey: ['messages', activeChannel] });
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [activeChannel, queryClient]);

    useEffect(() => {
        // Scroll to bottom on new messages
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMutation = useMutation({
        mutationFn: async () => {
            if (!user || !newMessage.trim()) return;
            await sendMessage(newMessage, activeChannel, user.id);
        },
        onSuccess: () => {
            setNewMessage('');
            queryClient.invalidateQueries({ queryKey: ['messages', activeChannel] });
        },
    });

    const handleSend = () => {
        if (newMessage.trim()) {
            sendMutation.mutate();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col h-[calc(100vh-100px)] gap-4">
                <div>
                    <h3 className="text-3xl font-bold tracking-tight">Admin Chat</h3>
                    <p className="text-muted-foreground mt-1">Internal communication channels.</p>
                </div>

                <div className="flex flex-1 gap-4 overflow-hidden">
                    {/* Sidebar */}
                    <Card className="w-64 flex flex-col p-0 overflow-hidden hidden md:flex border-border bg-card">
                        <div className="p-4 border-b border-border bg-muted/20">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-amber-500" />
                                Channels
                            </h3>
                        </div>
                        <ScrollArea className="flex-1 p-2">
                            <div className="space-y-1">
                                {CHANNELS.map((channel) => (
                                    <button
                                        key={channel.id}
                                        onClick={() => setActiveChannel(channel.id)}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${activeChannel === channel.id
                                            ? 'bg-amber-500/10 text-amber-500 font-medium'
                                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        <channel.icon className="w-4 h-4" />
                                        {channel.name}
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </Card>

                    {/* Main Chat Area */}
                    <Card className="flex-1 flex flex-col p-0 overflow-hidden border-border bg-card">
                        {/* Header */}
                        <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-2">
                            <Hash className="w-5 h-5 text-muted-foreground" />
                            <h3 className="font-semibold text-lg">{CHANNELS.find(c => c.id === activeChannel)?.name}</h3>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4 bg-background/30">
                            <div className="space-y-4">
                                {isLoading ? (
                                    <div className="text-center text-muted-foreground">Loading messages...</div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-10">
                                        No messages yet. Be the first to say hello!
                                    </div>
                                ) : (
                                    messages.map((msg: any) => {
                                        const isMe = msg.sender_id === user?.id;
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                                            >
                                                <Avatar className="w-8 h-8 border border-border">
                                                    <AvatarImage src={msg.members?.avatar_url} />
                                                    <AvatarFallback className="bg-muted text-muted-foreground">{msg.members?.full_name?.[0] || '?'}</AvatarFallback>
                                                </Avatar>
                                                <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-medium text-muted-foreground">
                                                            {msg.members?.full_name || 'Unknown'}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground/60">
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className={`px-3 py-2 rounded-lg text-sm shadow-sm ${isMe
                                                            ? 'bg-amber-500 text-black rounded-tr-none font-medium'
                                                            : 'bg-muted text-foreground rounded-tl-none border border-border'
                                                            }`}
                                                    >
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-4 border-t border-border bg-muted/20">
                            <div className="flex gap-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={`Message #${CHANNELS.find(c => c.id === activeChannel)?.name}`}
                                    className="bg-background border-border focus-visible:ring-amber-500"
                                />
                                <Button onClick={handleSend} disabled={!newMessage.trim() || sendMutation.isPending} className="bg-amber-500 hover:bg-amber-600 text-black">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Chat;
