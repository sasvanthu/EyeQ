import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/eyeq/GlassCard';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create member record
        const { error: memberError } = await supabase
          .from('members')
          .insert([
            {
              id: authData.user.id, // Link to auth user
              email: email,
              full_name: name,
              role: role,
              is_approved: false, // Default to pending
            },
          ]);

        if (memberError) {
          console.error('Error creating member record:', memberError);
          // Optional: Delete auth user if member creation fails to maintain consistency
          // await supabase.auth.admin.deleteUser(authData.user.id);
          throw new Error('Failed to create member profile. Please try again.');
        }

        toast({
          title: "Account Created",
          description: "Please check your email to verify your account.",
        });

        navigate('/login');
      }
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "An error occurred during signup.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <GlassCard className='max-w-md w-full p-8'>
        <h2 className='text-xl font-semibold mb-2'>Sign Up</h2>
        <form onSubmit={submit} className='space-y-3'>
          <Input placeholder='Full name' value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
          <Input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
          <Input placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
          <div className='flex items-center gap-2'>
            <select className='bg-transparent border p-2 rounded-md w-full' value={role} onChange={(e) => setRole(e.target.value)} disabled={loading}>
              <option>Member</option>
              <option>PR</option>
              <option>Events</option>
              <option>Tech Lead</option>
            </select>
          </div>
          <div className='flex justify-end'>
            <Button type='submit' disabled={loading}>
              {loading ? 'Signing up...' : 'Sign up'}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default SignUp;
