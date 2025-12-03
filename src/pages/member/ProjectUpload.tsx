import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Github, Image as ImageIcon, X, Eye, Loader2 } from 'lucide-react';
import GlassCard from '@/components/eyeq/GlassCard';
import NeonButton from '@/components/eyeq/NeonButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ProjectUpload = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [demoUrl, setDemoUrl] = useState('');
    const [projectType, setProjectType] = useState<'Solo' | 'Team'>('Solo');

    const createProjectMutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['user-projects'] });
            toast.success('Project uploaded successfully!');
            navigate('/projects');
        },
        onError: (error) => {
            toast.error(`Failed to upload project: ${error.message}`);
        }
    });

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentTag.trim()) {
            e.preventDefault();
            if (!tags.includes(currentTag.trim())) {
                setTags([...tags, currentTag.trim()]);
            }
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = () => {
        if (!title || !description) {
            toast.error("Title and description are required");
            return;
        }
        if (!user) return;

        createProjectMutation.mutate({
            user_id: user.uid,
            title,
            description,
            tags, // Ensure DB supports array or JSONB for tags
            github_url: githubUrl,
            // demo_url: demoUrl, // Add to schema if missing
            type: projectType,
            image_url: null // Placeholder or implement image upload later
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 pb-20">
            {/* Upload Form */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
            >
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Upload Project</h1>
                    <p className="text-gray-400">Share your latest creation with the EyeQ community.</p>
                </div>

                <GlassCard className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Project Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. AI Vision Assistant"
                            className="bg-black/20 border-white/10 focus:border-cyan-500/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what your project does..."
                            className="min-h-[100px] bg-black/20 border-white/10 focus:border-cyan-500/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Tech Stack Tags</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border-cyan-500/20 gap-1">
                                    {tag}
                                    <X size={12} className="cursor-pointer" onClick={() => removeTag(tag)} />
                                </Badge>
                            ))}
                        </div>
                        <Input
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder="Type tag and press Enter (e.g. React, Python)"
                            className="bg-black/20 border-white/10 focus:border-cyan-500/50"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="github">GitHub Repository</Label>
                            <div className="relative">
                                <Github className="absolute left-3 top-3 text-gray-500" size={16} />
                                <Input
                                    id="github"
                                    value={githubUrl}
                                    onChange={(e) => setGithubUrl(e.target.value)}
                                    placeholder="https://github.com/..."
                                    className="pl-10 bg-black/20 border-white/10 focus:border-cyan-500/50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="demo">Live Demo Link</Label>
                            <div className="relative">
                                <Eye className="absolute left-3 top-3 text-gray-500" size={16} />
                                <Input
                                    id="demo"
                                    value={demoUrl}
                                    onChange={(e) => setDemoUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="pl-10 bg-black/20 border-white/10 focus:border-cyan-500/50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Project Type</Label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setProjectType('Solo')}
                                className={`flex-1 py-3 rounded-xl border transition-all ${projectType === 'Solo'
                                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                    : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'
                                    }`}
                            >
                                Solo Project
                            </button>
                            <button
                                onClick={() => setProjectType('Team')}
                                className={`flex-1 py-3 rounded-xl border transition-all ${projectType === 'Team'
                                    ? 'bg-purple-500/10 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                    : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'
                                    }`}
                            >
                                Team Project
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <NeonButton variant="ghost" onClick={() => navigate('/projects')}>Cancel</NeonButton>
                        <NeonButton className="w-full sm:w-auto" onClick={handleSubmit} disabled={createProjectMutation.isPending}>
                            {createProjectMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload size={18} className="mr-2" />}
                            Publish Project
                        </NeonButton>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Preview Section */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
            >
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Preview</h2>
                    <p className="text-gray-400">How your project card will look.</p>
                </div>

                <div className="sticky top-6 perspective-1000">
                    <div className="card-3d transform transition-all duration-500">
                        <GlassCard className="overflow-hidden border-t-4 border-t-cyan-500 group">
                            <div className="aspect-video bg-black/40 relative overflow-hidden group-hover:shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] transition-all">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-600 bg-gradient-to-br from-gray-900 to-black">
                                    <ImageIcon size={48} className="opacity-50" />
                                </div>
                                <div className="absolute top-3 right-3">
                                    <Badge className={`${projectType === 'Solo' ? 'bg-cyan-500' : 'bg-purple-500'} text-white border-0`}>
                                        {projectType}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-5 space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{title || 'Project Title Preview'}</h3>
                                    <p className="text-sm text-gray-400 line-clamp-2">
                                        {description || 'Your project description will appear here. It should be concise and engaging to attract views.'}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {tags.length > 0 ? tags.map(tag => (
                                        <span key={tag} className="text-xs px-2 py-1 rounded bg-white/5 text-cyan-300 border border-white/10">
                                            {tag}
                                        </span>
                                    )) : (
                                        <>
                                            <span className="text-xs px-2 py-1 rounded bg-white/5 text-cyan-300 border border-white/10">React</span>
                                            <span className="text-xs px-2 py-1 rounded bg-white/5 text-cyan-300 border border-white/10">Tailwind</span>
                                        </>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                                        <span className="text-xs text-gray-300">By You</span>
                                    </div>
                                    <div className="flex gap-3 text-gray-400">
                                        <Github size={18} className="hover:text-white cursor-pointer" />
                                        <Eye size={18} className="hover:text-white cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm">
                        <p className="flex items-start gap-2">
                            <span className="text-xl">💡</span>
                            <span>
                                <strong>Pro Tip:</strong> Adding a "What I Learned" section boosts your project's visibility by 2x! It helps others learn from your journey.
                            </span>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProjectUpload;
