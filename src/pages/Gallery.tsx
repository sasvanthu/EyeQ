import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAlbums, fetchGalleryImages } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { LoaderOne } from '@/components/ui/loader';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Calendar, ImageIcon, X } from 'lucide-react';

const Gallery = () => {
    const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const { data: albums, isLoading: albumsLoading } = useQuery({
        queryKey: ['albums'],
        queryFn: fetchAlbums,
    });

    const { data: images, isLoading: imagesLoading } = useQuery({
        queryKey: ['gallery-images', selectedAlbum],
        queryFn: () => fetchGalleryImages(selectedAlbum || undefined),
        enabled: !!albums,
    });

    if (albumsLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <LoaderOne />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="container mx-auto px-4 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary">
                        Gallery
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Capturing moments from our events, workshops, and hackathons.
                    </p>
                </motion.div>

                {/* Album Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button
                        onClick={() => setSelectedAlbum(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedAlbum === null
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                    >
                        All Photos
                    </button>
                    {albums?.map((album: any) => (
                        <button
                            key={album.id}
                            onClick={() => setSelectedAlbum(album.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedAlbum === album.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            {album.title}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                {imagesLoading ? (
                    <div className="flex justify-center py-20">
                        <LoaderOne />
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                        <AnimatePresence>
                            {images?.map((image: any) => (
                                <motion.div
                                    layout
                                    key={image.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative group cursor-pointer overflow-hidden rounded-xl aspect-square bg-muted"
                                    onClick={() => setSelectedImage(image.url)}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.caption || 'Gallery Image'}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <ImageIcon className="text-white w-8 h-8" />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {(!images || images.length === 0) && !imagesLoading && (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>No images found.</p>
                    </div>
                )}
            </main>

            {/* Lightbox Modal */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none overflow-hidden flex items-center justify-center">
                    <div className="relative w-full h-full max-h-[90vh] flex items-center justify-center">
                        {selectedImage && (
                            <img
                                src={selectedImage}
                                alt="Full view"
                                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            />
                        )}
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Gallery;
