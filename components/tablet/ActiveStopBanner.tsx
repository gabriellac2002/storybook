// Referência: docs/parte_diaria_v46.html linhas 1312–1325 — renderActiveStopBanner()
// Banner laranja exibido enquanto há uma parada ativa. Toque abre o modal de parada.

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { PetraIcon } from '@/components/petra/PetraIcon';
import { fmtDuration, fmtTimeShort } from '@/lib/format';

export type ActiveStopBannerProps = {
  className?: string;
  startTs: string;
  onClick: () => void;
};

export const ActiveStopBanner: React.FC<ActiveStopBannerProps> = ({
  className,
  startTs,
  onClick,
}) => {
  const [elapsedMs, setElapsedMs] = useState(() => Date.now() - new Date(startTs).getTime());

  useEffect(() => {
    const update = () => setElapsedMs(Date.now() - new Date(startTs).getTime());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startTs]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'mb-4 flex w-full cursor-pointer items-center gap-4 rounded-xl border-2 border-op-orange bg-op-orange/15 p-4 text-left transition hover:bg-op-orange/25 active:scale-[0.99]',
        className
      )}
    >
      <PetraIcon name="pause" size={32} className="flex-shrink-0 text-op-orange" />
      <div className="flex-1 min-w-0">
        <div className="font-black text-op-orange">PARADA EM ANDAMENTO</div>
        <div className="text-sm text-tablet-text-dim">
          Iniciada em {fmtTimeShort(startTs)} · Toque para finalizar
        </div>
      </div>
      <div className="font-mono text-2xl font-bold tabular-nums text-op-orange flex-shrink-0">
        {fmtDuration(elapsedMs)}
      </div>
    </button>
  );
};
