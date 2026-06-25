// Referência: docs/parte_diaria_v46.html linha ~3950 — renderMgmtDashboard()
// Card de KPI para o painel gerencial (tema claro). Exibe um indicador
// operacional chave com valor, unidade, rótulo e tendência opcional.

import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { PetraIcon, IconName } from '@/components/petra/PetraIcon';

const kpiAccentVariants = cva('h-1 w-full rounded-t-lg', {
  variants: {
    color: {
      blue:   'bg-petra-blue',
      green:  'bg-op-green',
      orange: 'bg-op-orange',
      red:    'bg-op-red',
    },
  },
  defaultVariants: { color: 'blue' },
});

export type KpiCardProps = VariantProps<typeof kpiAccentVariants> & {
  className?: string;
  label: string;
  value: string | number;
  unit?: string;
  icon?: IconName;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
};

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  unit,
  icon,
  trend,
  trendValue,
  color = 'blue',
  className,
}) => {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className={kpiAccentVariants({ color })} />
      <CardContent className="pt-4 pb-5 px-5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          {icon && (
            <PetraIcon
              name={icon}
              size={20}
              className={cn(
                color === 'blue'   && 'text-petra-blue',
                color === 'green'  && 'text-op-green',
                color === 'orange' && 'text-op-orange',
                color === 'red'    && 'text-op-red',
              )}
            />
          )}
        </div>

        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-display text-4xl font-black tabular-nums leading-none">
            {value}
          </span>
          {unit && (
            <span className="text-sm font-semibold text-muted-foreground">{unit}</span>
          )}
        </div>

        {trendValue && (
          <p className={cn(
            'mt-2 text-xs font-semibold',
            trend === 'up'   && 'text-op-green',
            trend === 'down' && 'text-op-red',
            trend === 'neutral' && 'text-muted-foreground',
          )}>
            {trend === 'up' && '▲ '}
            {trend === 'down' && '▼ '}
            {trendValue}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
