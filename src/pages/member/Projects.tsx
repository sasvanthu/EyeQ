import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Github, Eye, Heart, MessageSquare, Loader2 } from 'lucide-react';
import GlassCard from '@/components/eyeq/GlassCard';
import NeonButton from '@/components/eyeq/NeonButton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/lib/api';

const Projects = () => {
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', 'AI/ML', 'Web Dev', 'App Dev', 'Cloud', 'Cybersec'];

    const { data: projects, isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
    });

    const filteredProjects = projects?.filter((project: any) => {
        const matchesFilter = filter === 'All' || (project.tags && project.tags.includes(filter)); // Assuming tags are stored as array
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    }) || [];

    return (
        <div className="space-y-8 p-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Project Gallery</h1>
                    <p className="text-gray-400">Explore what the community is building.</p>
                </div>
                <Link to="/projects/new">
                    <NeonButton>+ Upload Project</NeonButton>
                </Link>
            </div>

            {/* Search & Filter */}
            <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <Input
                        placeholder="Search projects, tags, or authors..."
                        className="pl-10 bg-black/20 border-white/10 focus:border-cyan-500/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${filter === cat
                                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </GlassCard>

            {/* Projects Grid */}
            {isLoading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin text-cyan-500" size={48} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-12">No projects found matching your criteria.</div>
                    ) : (
                        filteredProjects.map((project: any, i: number) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="card-3d h-full">
                                    <GlassCard className="h-full flex flex-col overflow-hidden group hover:border-cyan-500/30 transition-colors">
                                        {/* Image/Thumbnail */}
                                        <div className={`aspect-video bg-gradient-to-br from-gray-900 to-black relative overflow-hidden`}>
                                            {project.image_url ? (
                                                <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20" />
                                            )}
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                            <div className="absolute top-3 right-3">
                                                <Badge className={`${project.type === 'Solo' ? 'bg-cyan-500' : 'bg-purple-500'} text-white border-0 shadow-lg`}>
                                                    {project.type || 'Project'}
                                                </Badge>
                                            </div>

                                            {/* Overlay Actions */}
                                            <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm">
                                                {project.github_url && (
                                                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                                                        <Github size={20} />
                                                    </a>
                                                )}
                                                <button className="p-2 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 transition-colors">
                                                    <Eye size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-5 flex-1 flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                                            </div>

                                            <p className="text-sm text-gray-400 line-clamp-2 flex-1">{project.description}</p>

                                            <div className="flex flex-wrap gap-2">
                                                {project.tags && project.tags.map((tag: string) => (
                                                    <span key={tag} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-300 border border-white/10">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-5 w-5 rounded-full bg-gray-700 overflow-hidden">
                                                        {project.profiles?.avatar_url && <img src={project.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />}
                                                    </div>
                                                    <span>{project.profiles?.full_name || 'Unknown'}</span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer">
                                                        <Heart size={14} /> {project.likes || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Eye size={14} /> {project.views || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Projects;
