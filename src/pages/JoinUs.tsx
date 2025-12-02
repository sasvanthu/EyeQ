import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import GlassCard from '@/components/eyeq/GlassCard';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const JoinUs = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        department: '',
        skills: '',
        reason: ''
    });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Split skills by comma and trim
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);

            const { error } = await supabase
                .from('requests')
                .insert([
                    {
                        full_name: formData.full_name,
                        email: formData.email,
                        phone: formData.phone,
                        department: formData.department,
                        skills: skillsArray,
                        reason: formData.reason,
                        status: 'pending'
                    }
                ]);

            if (error) throw error;

            toast({
                title: "Request Submitted!",
                description: "Your request to join EyeQ has been sent to the admins. We will contact you soon.",
            });

            // Optional: Redirect to home after delay
            setTimeout(() => navigate('/'), 2000);

        } catch (error: any) {
            console.error('Error submitting request:', error);
            toast({
                title: "Submission Failed",
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            <Navbar />

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-24 relative z-10 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-2xl"
                >
                    <GlassCard className="p-8 md:p-12">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Join EyeQ Club</h1>
                            <p className="text-muted-foreground">
                                Ready to explore the world of Computer Vision? Fill out the form below to request membership.
                                Membership is by approval only.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input
                                        name="full_name"
                                        placeholder="John Doe"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="bg-background/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Address</label>
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="bg-background/50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <Input
                                        name="phone"
                                        placeholder="+91 98765 43210"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="bg-background/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Department & Year</label>
                                    <Input
                                        name="department"
                                        placeholder="CSE - 3rd Year"
                                        value={formData.department}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="bg-background/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Skills / Interests</label>
                                <Input
                                    name="skills"
                                    placeholder="Python, OpenCV, React, Design (comma separated)"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="bg-background/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Why do you want to join EyeQ?</label>
                                <Textarea
                                    name="reason"
                                    placeholder="Tell us about your interest in Computer Vision and what you hope to achieve..."
                                    value={formData.reason}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="bg-background/50 min-h-[120px]"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-6 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                                disabled={loading}
                            >
                                {loading ? 'Submitting Request...' : 'Submit Request'}
                            </Button>
                        </form>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
};

export default JoinUs;
