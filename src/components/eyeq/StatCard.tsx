import React from 'react';
import GlassCard from './GlassCard';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  accent?: string;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, sub, accent, icon, className }) => {
  return (
    <GlassCard className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
        </div>
        {icon && <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-black/10 neon-outline">{icon}</div>}
      </div>
    </GlassCard>
  );
};

export default StatCard;
