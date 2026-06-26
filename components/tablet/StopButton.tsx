// Referência: docs/parte_diaria_v46.html linhas 1641–1647, 1786–1792 — renderTruckOps / renderLoaderOps
// Botão de Parada, idêntico em Truck, Loader e Excavator.
// Quando ativo: pulsa, mostra timer ao vivo e texto "PARADA ATIVA".

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PetraIcon } from '@/components/petra/PetraIcon';
import { fmtDuration } from '@/lib/format';

export type StopButtonProps = {
  className?: string;
  isActive: boolean;
  startTs?: string | null;
  onClick: () => void;
};

export const StopButton: React.FC<StopButtonProps> = ({
  className,
  isActive,
  startTs,
  onClick,
}) => {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (!isActive || !startTs) { setElapsedMs(0); return; }
    const update = () => setElapsedMs(Date.now() - new Date(startTs).getTime());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [isActive, startTs]);

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        'flex-1 h-full w-full flex-col items-center justify-center gap-1 rounded-xl font-black whitespace-normal transition active:scale-[0.98]',
        isActive
          ? 'animate-pulse bg-op-orange text-white hover:bg-op-orange ring-2 ring-op-orange/40'
          : 'bg-op-orange text-white hover:bg-op-orange-dark',
        className
      )}
    >
      <PetraIcon name={isActive ? 'warning' : 'pause'} size={26} />
      <span className="text-base font-black tracking-wide">
        {isActive ? 'PARADA ATIVA' : 'PARADA'}
      </span>
      {isActive && startTs && (
        <span className="font-mono text-sm font-bold tabular-nums">
          {fmtDuration(elapsedMs)}
        </span>
      )}
    </Button>
  );
};
