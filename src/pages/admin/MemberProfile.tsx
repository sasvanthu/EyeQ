import React from 'react';
import { useParams } from 'react-router-dom';
import EyeQLayout from '@/components/eyeq/EyeQLayout';
import GlassCard from '@/components/eyeq/GlassCard';
import { Button } from '@/components/ui/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMember, updateMember } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const MemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: member, isLoading, error } = useQuery<any>({
    queryKey: ['member', id],
    queryFn: () => fetchMember(id!),
    enabled: !!id,
    retry: false
  });

  if (isLoading) {
    return (
      <EyeQLayout>
        <div className='p-6'>Loading profile...</div>
      </EyeQLayout>
    );
  }

  if (error || !member) {
    return (
      <EyeQLayout>
        <div className='p-6'>Member not found or error loading profile.</div>
      </EyeQLayout>
    );
  }

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleRoleToggle = async () => {
    try {
      const newRole = member.role === 'admin' ? 'member' : 'admin';
      await updateMember(member.id, { role: newRole });
      await queryClient.invalidateQueries({ queryKey: ['member', id] });
      toast({
        title: "Role Updated",
        description: `User is now a ${newRole}.`,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update role.",
        variant: "destructive"
      });
    }
  };

  return (
    <EyeQLayout>
      <div className='space-y-4'>
        <div className="flex justify-between items-start">
          <div>
            <h3 className='text-2xl font-semibold'>{member.full_name}</h3>
            <div className='text-sm text-muted-foreground capitalize'>{member.role} • Joined {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : 'Unknown'}</div>
          </div>
          <Button
            variant={member.role === 'admin' ? 'destructive' : 'default'}
            onClick={handleRoleToggle}
          >
            {member.role === 'admin' ? 'Demote to Member' : 'Promote to Admin'}
          </Button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <GlassCard className='col-span-1 p-4'>
            <div className='mb-3'>Contact</div>
            <div className='text-sm'><b>Email:</b> {member.email}</div>
            <div className='text-sm mt-1'><b>Phone:</b> {member.phone || 'N/A'}</div>
            <div className='mt-3'>
              <Button variant='ghost'>Message</Button>
              {member.linkedin_url && <Button className='ml-2' onClick={() => window.open(member.linkedin_url, '_blank')}>LinkedIn</Button>}
            </div>
          </GlassCard>

          <GlassCard className='col-span-2 p-4'>
            <h4 className='text-lg font-semibold'>Bio</h4>
            <div className='mt-2 text-sm text-muted-foreground'>{member.bio || 'No bio provided.'}</div>

            <h4 className='text-lg font-semibold mt-6'>Skills</h4>
            <div className='mt-2 flex flex-wrap gap-2'>
              {member.skills && member.skills.length > 0 ? (
                member.skills.map((skill: string, idx: number) => (
                  <span key={idx} className='px-2 py-1 bg-white/10 rounded text-xs'>{skill}</span>
                ))
              ) : (
                <span className='text-sm text-muted-foreground'>No skills listed.</span>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </EyeQLayout>
  );
};

export default MemberProfile;
