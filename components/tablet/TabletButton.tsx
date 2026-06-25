// Referência: docs/parte_diaria_v46.html CSS linhas 50–52 (.tablet-btn/lg/xl)
// Botão de toque para tablet fixado na cabine do equipamento.
// Dimensões mínimas grandes para uso com luva (80/110/140 px de altura).
// Usa shadcn Button internamente mas com layout e tamanhos customizados.

'use client'

import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { PetraIcon, IconName } from '@/components/petra/PetraIcon';

const tabletButtonVariants = cva(
  'relative flex w-full flex-col items-center justify-center gap-2 rounded-2xl font-display font-black tracking-wide transition-all active:scale-[0.97] active:brightness-75 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      size: {
        md: 'min-h-[80px]  text-xl   px-4 py-3',
        lg: 'min-h-[110px] text-2xl  px-4 py-4',
        xl: 'min-h-[140px] text-3xl  px-4 py-5',
      },
      variant: {
        primary:   'bg-petra-blue   text-white',
        success:   'bg-op-green     text-white',
        danger:    'bg-op-red       text-white',
        warning:   'bg-op-orange    text-white',
        secondary: 'bg-tablet-surface-2 text-tablet-text border border-tablet-border',
      },
    },
    defaultVariants: {
      size: 'lg',
      variant: 'secondary',
    },
  }
);

export type TabletButtonProps = VariantProps<typeof tabletButtonVariants> & {
  className?: string;
  label: string;
  sublabel?: string;
  icon?: IconName;
  iconSize?: number;
  disabled?: boolean;
  onClick?: () => void;
};

export const TabletButton: React.FC<TabletButtonProps> = ({
  label,
  sublabel,
  icon,
  iconSize,
  size = 'lg',
  variant = 'secondary',
  disabled = false,
  onClick,
  className,
}) => {
  const resolvedIconSize = iconSize ?? (size === 'xl' ? 40 : size === 'lg' ? 32 : 24);

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={cn(tabletButtonVariants({ size, variant }), className)}
    >
      {icon && <PetraIcon name={icon} size={resolvedIconSize} />}
      <span>{label}</span>
      {sublabel && (
        <span className="text-[0.65em] font-sans font-semibold opacity-70 tracking-normal">
          {sublabel}
        </span>
      )}
    </button>
  );
};
