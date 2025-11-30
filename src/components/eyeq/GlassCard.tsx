import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'glass-card rounded-lg p-4 border border-opacity-10 neon-outline neon-glow card-3d',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
