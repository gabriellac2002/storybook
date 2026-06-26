// Referência: docs/parte_diaria_v46.html linhas 944–1001 — renderTabletChecklist()
// [EXTRACTED: ChecklistItem]
// Card de item do checklist pré-operação com botões APTO/INAPTO e campo de descrição.

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type ChecklistStatus = 'apto' | 'inapto' | null;

export type ChecklistItemProps = {
  className?: string;
  label: string;
  icon?: React.ReactNode;
  critical?: boolean;
  status: ChecklistStatus;
  description: string;
  onApto: () => void;
  onInapto: () => void;
  onDescriptionChange: (desc: string) => void;
};

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  className,
  label,
  icon,
  critical = false,
  status,
  description,
  onApto,
  onInapto,
  onDescriptionChange,
}) => {
  const isApt   = status === 'apto';
  const isInapt = status === 'inapto';

  const borderColor = isApt
    ? 'border-op-green'
    : isInapt
      ? 'border-op-red'
      : critical
        ? 'border-op-red/50'
        : 'border-tablet-border';

  const cardBg = isApt ? 'bg-op-green/5' : isInapt ? 'bg-op-red/5' : 'bg-tablet-surface';

  const handleDesc = (e: React.ChangeEvent<HTMLInputElement>) => onDescriptionChange(e.target.value);

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border-2 transition-colors',
        borderColor,
        cardBg,
        className
      )}
    >
      {/* Linha principal */}
      <div className="flex min-h-0 flex-1">
        {/* Metade esquerda — ícone + rótulo */}
        <div className="flex items-center gap-2.5 px-3 py-2" style={{ width: '50%', flexShrink: 0 }}>
          {icon && (
            <div className="flex-shrink-0 leading-none text-petra-yellow" aria-hidden="true">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-base font-black leading-tight">{label}</div>
            {critical && (
              <div className="hairline mt-0.5 text-[10px] font-bold text-op-red">⚠ CRÍTICO</div>
            )}
          </div>
        </div>

        {/* Metade direita — APTO | INAPTO */}
        <div className="flex border-l-2 border-tablet-border" style={{ width: '50%', flexShrink: 0 }}>
          <Button
            variant="ghost"
            onClick={onApto}
            aria-pressed={isApt}
            aria-label={`Marcar ${label} como apto`}
            className={cn(
              'flex-1 h-full flex-col items-center justify-center gap-1 rounded-none font-black whitespace-normal',
              isApt
                ? 'bg-op-green text-white hover:bg-op-green'
                : 'bg-tablet-bg text-op-green hover:bg-op-green/20'
            )}
          >
            <span className="text-2xl leading-none">✔</span>
            <span className="hairline text-xs font-black">APTO</span>
          </Button>

          <div className="w-px flex-shrink-0 bg-tablet-border" aria-hidden="true" />

          <Button
            variant="ghost"
            onClick={onInapto}
            aria-pressed={isInapt}
            aria-label={`Marcar ${label} como inapto`}
            className={cn(
              'flex-1 h-full flex-col items-center justify-center gap-1 rounded-none font-black whitespace-normal',
              isInapt
                ? 'bg-op-red text-white hover:bg-op-red'
                : 'bg-tablet-bg text-op-red hover:bg-op-red/20'
            )}
          >
            <span className="text-2xl font-black leading-none">✕</span>
            <span className="hairline text-xs font-black">INAPTO</span>
          </Button>
        </div>
      </div>

      {/* Campo de descrição — apenas quando INAPTO */}
      {isInapt && (
        <div className="border-t border-op-red/20 px-3 pb-2 pt-1">
          <Input
            type="text"
            value={description}
            onChange={handleDesc}
            placeholder="Descreva o defeito observado..."
            className="border-2 border-op-red/40 bg-tablet-bg focus-visible:border-op-red focus-visible:ring-op-red/20"
          />
        </div>
      )}
    </div>
  );
};
