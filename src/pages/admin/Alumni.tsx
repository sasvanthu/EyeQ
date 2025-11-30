import React from 'react';
import EyeQLayout from '@/components/eyeq/EyeQLayout';
import GlassCard from '@/components/eyeq/GlassCard';
import { Button } from '@/components/ui/button';

const Alumni: React.FC = () => {
  return (
    <EyeQLayout>
      <div className='space-y-4'>
        <div>
          <h3 className='text-2xl font-semibold'>Alumni Network</h3>
          <div className='text-sm text-muted-foreground'>Profiles, companies, and opportunities</div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <GlassCard>
            <h4 className='text-lg font-semibold'>Alumni Profiles</h4>
            <p className='text-sm text-muted-foreground mt-2'>Showcase alumni and connect</p>
            <div className='mt-4'>
              <Button>Explore</Button>
            </div>
          </GlassCard>
          <GlassCard>
            <h4 className='text-lg font-semibold'>Companies & Openings</h4>
            <p className='text-sm text-muted-foreground mt-2'>View alumni companies and opportunities</p>
            <div className='mt-4'>
              <Button>See Jobs</Button>
            </div>
          </GlassCard>
          <GlassCard>
            <h4 className='text-lg font-semibold'>Connect</h4>
            <p className='text-sm text-muted-foreground mt-2'>Messaging & mentorship requests for alumni</p>
            <div className='mt-4'>
              <Button>Message</Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </EyeQLayout>
  );
};

export default Alumni;
