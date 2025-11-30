import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NeonButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ children, className, ...props }) => {
  return (
    <Button {...props} className={cn('neon-btn neon-outline neon-glow', className)}>
      {children}
    </Button>
  );
};

export default NeonButton;
