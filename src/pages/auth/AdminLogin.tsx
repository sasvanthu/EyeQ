import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/eyeq/GlassCard';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { fetchMember } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Allow login with username (append @eyeq.com if no domain)
            const loginEmail = email.includes('@') ? email : `${email}@eyeq.com`;

            const userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);
            const user = userCredential.user;

            // Check if user is actually an admin
            if (user) {
                const profile = await fetchMember(user.uid);

                // Add null/undefined check for profile
                if (!profile || (profile as any)?.role !== 'admin') {
                    await auth.signOut();
                    throw new Error('Unauthorized access. Admin privileges required. Please ensure your profile is set to admin role.');
                }

                toast({
                    title: "Welcome back, Admin",
                    description: "Access granted to the control center.",
                });
                navigate('/admin/dashboard');
            }
        } catch (error: any) {
            toast({
                title: "Access Denied",
                description: error.message || "Invalid credentials.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden p-4">
            {/* Dark/Neon Background Vibe */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />

            <GlassCard className="max-w-md w-full p-8 relative z-10 border-primary/20 shadow-2xl shadow-primary/10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/30">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Access</h1>
                    <p className="text-muted-foreground text-sm mt-2">Restricted Area. Authorized Personnel Only.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Admin ID (Username or Email)</label>
                        <Input
                            type="text"
                            placeholder="admineyeq"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-black/50 border-white/10 focus:border-primary/50"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Passcode</label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-black/50 border-white/10 focus:border-primary/50"
                            disabled={loading}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-semibold tracking-wide"
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Enter Control Center'}
                    </Button>
                </form>
            </GlassCard>
        </div>
    );
};

export default AdminLogin;
