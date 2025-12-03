import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/eyeq/GlassCard';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { checkApprovedRequest, createMember } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const Signup = () => {
  const [step, setStep] = useState<'check' | 'register'>('check');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request = await checkApprovedRequest(email);
      if (request) {
        setRequestData(request);
        setStep('register');
        toast({
          title: "Request Found!",
          description: "Your request has been approved. Please set a password.",
        });
      } else {
        toast({
          title: "No Approved Request",
          description: "We couldn't find an approved request for this email. Please check the email or contact support.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create Profile
      await createMember({
        id: user.uid,
        email: email,
        full_name: requestData.full_name,
        phone: requestData.phone,
        department: requestData.department,
        skills: requestData.skills,
        role: 'member', // Default role
        created_at: new Date().toISOString(),
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${requestData.full_name}` // Default avatar
      });

      toast({
        title: "Account Created!",
        description: "Welcome to EyeQ. You are now logged in.",
      });
      navigate('/dashboard');

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black -z-10" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] -z-10" />

      <GlassCard className='max-w-md w-full p-8'>
        <h2 className='text-2xl font-bold mb-2 text-center'>Complete Registration</h2>
        <p className="text-center text-muted-foreground mb-6 text-sm">
          {step === 'check' ? "Enter your email to verify your approval status." : "Set a password to secure your account."}
        </p>

        {step === 'check' ? (
          <form onSubmit={handleCheck} className='space-y-4'>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email Address</label>
              <Input
                placeholder='john@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-background/50"
              />
            </div>
            <Button type='submit' className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className='space-y-4'>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</label>
              <Input value={email} disabled className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</label>
              <Input
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Confirm Password</label>
              <Input
                type='password'
                placeholder='••••••••'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="bg-background/50"
              />
            </div>
            <Button type='submit' className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        )}

        <div className="text-center mt-6">
          <Button variant="link" className="text-xs text-muted-foreground" onClick={() => navigate('/login')}>
            Already have an account? Login
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};

export default Signup;
