import React from 'react';
import EyeQLayout from '@/components/eyeq/EyeQLayout';
import GlassCard from '@/components/eyeq/GlassCard';
import { Button } from '@/components/ui/button';

const Portfolio: React.FC = () => {
  return (
    <EyeQLayout>
      <div className='space-y-4'>
        <div>
          <h3 className='text-2xl font-semibold'>Portfolio & Projects</h3>
          <div className='text-sm text-muted-foreground'>Portfolio generator and project showcase</div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <GlassCard>
            <h4 className='text-lg font-semibold'>Portfolio Generator</h4>
            <p className='text-sm text-muted-foreground mt-2'>One-click portfolio creation with AI bio and skills</p>
            <div className='mt-4'>
              <Button>Generate Portfolio</Button>
            </div>
          </GlassCard>
          <GlassCard>
            <h4 className='text-lg font-semibold'>Project Listing</h4>
            <p className='text-sm text-muted-foreground mt-2'>Upload projects and add GitHub links</p>
            <div className='mt-4'>
              <Button>Upload Project</Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </EyeQLayout>
  );
};

export default Portfolio;
