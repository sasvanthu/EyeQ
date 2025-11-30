import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/eyeq/GlassCard';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <GlassCard className='max-w-md w-full p-8'>
        <h2 className='text-xl font-semibold mb-2'>Member Login</h2>
        <form onSubmit={submit} className='space-y-3'>
          <Input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
          <Input placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
          <div className='flex items-center justify-between'>
            <Button type='submit' disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <Button variant='ghost' type="button" onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </div>
          <div className="text-center mt-4">
            <Button variant="link" className="text-xs text-neutral-400" onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default Login;
