// Referência: docs/parte_diaria_v46.html CSS linhas 53–55, 124–128
// Indicador de status com animação de pulso. A animação 'petra-dot-pulse'
// está definida em app/globals.css.

import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusDotVariants = cva(
  'inline-block shrink-0 rounded-full',
  {
    variants: {
      color: {
        green:  'bg-op-green  text-op-green',
        orange: 'bg-op-orange text-op-orange',
        red:    'bg-op-red    text-op-red',
        gray:   'text-[#6b7280] bg-[#6b7280]',
        purple: 'text-op-purple bg-op-purple',
      },
    },
    defaultVariants: { color: 'gray' },
  }
);

export type StatusDotProps = VariantProps<typeof statusDotVariants> & {
  className?: string;
  fast?: boolean;
  size?: number;
};

export const StatusDot: React.FC<StatusDotProps> = ({
  color = 'gray',
  fast = false,
  size = 10,
  className,
}) => {
  return (
    <span
      className={cn(statusDotVariants({ color }), className)}
      style={{
        width: size,
        height: size,
        animation: `petra-dot-pulse ${fast ? '1s' : '2s'} infinite`,
      }}
      aria-hidden="true"
    />
  );
};

// Helper: converte status do equipamento → cor do dot
export const equipmentStatusColor = (
  status: 'operating' | 'stopped' | 'maintenance' | 'off' | string
): NonNullable<StatusDotProps['color']> => {
  const map: Record<string, NonNullable<StatusDotProps['color']>> = {
    operating:   'green',
    stopped:     'orange',
    maintenance: 'red',
    off:         'gray',
  };
  return map[status] ?? 'gray';
};
