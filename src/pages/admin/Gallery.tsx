import React, { useState } from 'react';
import AdminLayout from '@/components/eyeq/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAlbums, createAlbum, deleteAlbum, fetchGalleryImages, uploadGalleryImage, deleteGalleryImage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDropzone } from 'react-dropzone';
import { Loader2, Plus, Trash2, Upload, Image as ImageIcon, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const AdminGallery = () => {
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
    const [newAlbum, setNewAlbum] = useState({ title: '', description: '', event_date: '' });

    // Fetch Albums
    const { data: albums, isLoading: albumsLoading } = useQuery({
        queryKey: ['albums'],
        queryFn: fetchAlbums,
    });

    // Fetch Images for selected album
    const { data: images, isLoading: imagesLoading } = useQuery({
        queryKey: ['gallery-images', selectedAlbum],
        queryFn: () => fetchGalleryImages(selectedAlbum || undefined),
        enabled: !!selectedAlbum,
    });

    // Create Album Mutation
    const createAlbumMutation = useMutation({
        mutationFn: createAlbum,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['albums'] });
            setIsCreateOpen(false);
            setNewAlbum({ title: '', description: '', event_date: '' });
            toast.success('Album created successfully');
        },
        onError: (error) => toast.error(`Failed to create album: ${error.message}`),
    });

    // Delete Album Mutation
    const deleteAlbumMutation = useMutation({
        mutationFn: deleteAlbum,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['albums'] });
            if (selectedAlbum) setSelectedAlbum(null);
            toast.success('Album deleted');
        },
    });

    // Upload Image Mutation
    const uploadImageMutation = useMutation({
        mutationFn: async (files: File[]) => {
            if (!selectedAlbum) throw new Error("No album selected");
            const promises = files.map(file => uploadGalleryImage(file, selectedAlbum));
            await Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gallery-images', selectedAlbum] });
            toast.success('Images uploaded successfully');
        },
        onError: (error) => toast.error(`Upload failed: ${error.message}`),
    });

    // Delete Image Mutation
    const deleteImageMutation = useMutation({
        mutationFn: ({ id, url }: { id: string, url: string }) => deleteGalleryImage(id, url),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gallery-images', selectedAlbum] });
            toast.success('Image deleted');
        },
    });

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            uploadImageMutation.mutate(acceptedFiles);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        disabled: !selectedAlbum || uploadImageMutation.isPending
    });

    const handleCreateAlbum = (e: React.FormEvent) => {
        e.preventDefault();
        createAlbumMutation.mutate(newAlbum);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Gallery Management</h2>
                        <p className="text-muted-foreground">Manage albums and upload photos.</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary text-primary-foreground">
                                <Plus className="mr-2 h-4 w-4" /> Create Album
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Album</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateAlbum} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Album Title</Label>
                                    <Input
                                        id="title"
                                        value={newAlbum.title}
                                        onChange={e => setNewAlbum({ ...newAlbum, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Event Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={newAlbum.event_date}
                                        onChange={e => setNewAlbum({ ...newAlbum, event_date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={newAlbum.description}
                                        onChange={e => setNewAlbum({ ...newAlbum, description: e.target.value })}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={createAlbumMutation.isPending}>
                                    {createAlbumMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Create Album
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Albums List */}
                    <Card className="md:col-span-1 h-[calc(100vh-200px)] flex flex-col">
                        <CardHeader>
                            <CardTitle>Albums</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto space-y-2">
                            {albumsLoading ? (
                                <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
                            ) : albums?.length === 0 ? (
                                <p className="text-muted-foreground text-center p-4">No albums yet.</p>
                            ) : (
                                albums?.map((album: any) => (
                                    <div
                                        key={album.id}
                                        className={`p-3 rounded-lg border cursor-pointer transition-colors flex justify-between items-center group ${selectedAlbum === album.id
                                            ? 'bg-primary/10 border-primary'
                                            : 'bg-card hover:bg-accent'
                                            }`}
                                        onClick={() => setSelectedAlbum(album.id)}
                                    >
                                        <div>
                                            <h4 className="font-medium">{album.title}</h4>
                                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {album.event_date || 'No date'}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('Are you sure you want to delete this album?')) {
                                                    deleteAlbumMutation.mutate(album.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Images Area */}
                    <Card className="md:col-span-2 h-[calc(100vh-200px)] flex flex-col">
                        <CardHeader>
                            <CardTitle>
                                {selectedAlbum
                                    ? `Photos: ${(albums?.find((a: any) => a.id === selectedAlbum) as any)?.title}`
                                    : 'Select an album to manage photos'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col overflow-hidden">
                            {selectedAlbum ? (
                                <>
                                    {/* Dropzone */}
                                    <div
                                        {...getRootProps()}
                                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-4 ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                                            } ${uploadImageMutation.isPending ? 'opacity-50 pointer-events-none' : ''}`}
                                    >
                                        <input {...getInputProps()} />
                                        {uploadImageMutation.isPending ? (
                                            <div className="flex flex-col items-center">
                                                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                                                <p>Uploading...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                                <p className="text-sm text-muted-foreground">
                                                    Drag & drop photos here, or click to select
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Images Grid */}
                                    <div className="flex-1 overflow-y-auto">
                                        {imagesLoading ? (
                                            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                                        ) : images?.length === 0 ? (
                                            <p className="text-muted-foreground text-center p-8">No photos in this album yet.</p>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-4">
                                                {images?.map((image: any) => (
                                                    <div key={image.id} className="relative group aspect-square rounded-md overflow-hidden bg-muted">
                                                        <img
                                                            src={image.url}
                                                            alt="Gallery"
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                                onClick={() => deleteImageMutation.mutate({ id: image.id, url: image.url })}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                                    <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                                    <p>Select an album from the list to view and upload photos.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminGallery;
