// Referência: docs/parte_diaria_v46.html linhas 1270–1298 — renderOpHeader()
// Barra de cabeçalho compartilhada por todas as telas operacionais do tablet.
// Exibe: ícone + código do equipamento, nome do operador, status e relógio ao vivo.

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PetraIcon, IconName } from '@/components/petra/PetraIcon';

export type OpHeaderProps = {
  className?: string;
  equipmentCode: string;
  equipmentIcon: IconName;
  operatorName: string;
  isOperating: boolean;
  onLogout: () => void;
};

export const OpHeader: React.FC<OpHeaderProps> = ({
  className,
  equipmentCode,
  equipmentIcon,
  operatorName,
  isOperating,
  onLogout,
}) => {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        'flex h-16 flex-shrink-0 items-center justify-between gap-2 border-b-2 border-tablet-border bg-tablet-surface px-3 py-2',
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-tablet-surface-2 text-petra-yellow">
          <PetraIcon name={equipmentIcon} size={26} />
        </div>
        <div className="min-w-0">
          <div className="truncate text-lg font-black leading-tight">
            <span className="text-petra-yellow">{equipmentCode}</span>
            {' '}
            <span className="text-sm font-normal text-white/40">·</span>
            {' '}
            <span className="text-white">{operatorName}</span>
          </div>
          <div
            className={cn(
              'mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-black',
              isOperating ? 'bg-op-green/20 text-op-green' : 'bg-op-orange/20 text-op-orange'
            )}
          >
            {isOperating ? '▶ EM OPERAÇÃO' : '⏸ PARADA'}
          </div>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        <div className="text-right">
          <div className="font-mono text-xl font-bold tabular-nums leading-tight text-tablet-text">
            {time}
          </div>
          <div className="mt-0.5 font-display text-[10px] leading-none text-tablet-text-muted">
            HORA LOCAL
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={onLogout}
          title="Trocar operador"
          aria-label="Trocar operador (logout)"
          className="rounded-xl border border-tablet-border bg-tablet-surface-2 hover:bg-tablet-surface-3 active:scale-95"
        >
          <PetraIcon name="user" size={22} />
        </Button>
      </div>
    </div>
  );
};
