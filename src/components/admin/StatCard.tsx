import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  /** Period-over-period change as a percentage. Omit to hide the indicator (preferred to showing 0%). */
  change?: number;
  period?: string;
  icon: LucideIcon;
  /** Use 'hero' for primary KPIs (larger), 'compact' for secondary row. */
  variant?: 'hero' | 'compact';
  hint?: string;
}

const StatCard = ({ title, value, change, period, icon: Icon, variant = 'hero', hint }: StatCardProps) => {
  const showChange = typeof change === 'number';
  return (
    <div className={cn(
      'rounded-lg border border-border bg-card transition-all hover:border-gold/40 hover:shadow-card',
      variant === 'hero' ? 'p-5' : 'p-4'
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className={cn('text-muted-foreground', variant === 'hero' ? 'text-xs uppercase tracking-wider' : 'text-xs')}>{title}</span>
        <Icon className={cn(variant === 'hero' ? 'h-4 w-4 text-gold' : 'h-3.5 w-3.5 text-muted-foreground')} />
      </div>
      <div className={cn(
        'text-foreground',
        variant === 'hero' ? 'font-display text-3xl font-semibold tracking-tight mb-1' : 'text-lg font-semibold'
      )}>
        {value}
      </div>
      {showChange ? (
        <div className="flex items-center gap-1 text-xs">
          {change! >= 0 ? (
            <TrendingUp className="h-3 w-3 text-green-600" />
          ) : (
            <TrendingDown className="h-3 w-3 text-destructive" />
          )}
          <span className={cn(change! >= 0 ? 'text-green-600' : 'text-destructive')}>
            {change! >= 0 ? '+' : ''}{change}%
          </span>
          {period && <span className="text-muted-foreground">{period}</span>}
        </div>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : period ? (
        <p className="text-xs text-muted-foreground">{period}</p>
      ) : null}
    </div>
  );
};

export default StatCard;
