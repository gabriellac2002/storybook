// Referência: docs/parte_diaria_v46.html linhas 1406–1448 — renderTurnoInfoBar()
// Barra de métricas do turno. Reutilizada por Truck, Loader e Excavator.
// Exibe: Início · Hor. Inicial · Operando (ao vivo) · Paradas · T. Parado.

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { fmtDuration, fmtTimeShort } from '@/lib/format';

export type TurnoInfoBarProps = {
  className?: string;
  shiftStart: string | null;
  horimeterLabel: string;
  stopCount: number;
  stopDurationMs: number;
};

export const TurnoInfoBar: React.FC<TurnoInfoBarProps> = ({
  className,
  shiftStart,
  horimeterLabel,
  stopCount,
  stopDurationMs,
}) => {
  const [operatingMs, setOperatingMs] = useState(() => {
    if (!shiftStart) return 0;
    return Math.max(0, Date.now() - new Date(shiftStart).getTime() - stopDurationMs);
  });

  useEffect(() => {
    if (!shiftStart) { setOperatingMs(0); return; }
    const update = () =>
      setOperatingMs(Math.max(0, Date.now() - new Date(shiftStart).getTime() - stopDurationMs));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [shiftStart, stopDurationMs]);

  return (
    <div
      className={cn(
        'flex h-11 flex-shrink-0 items-center overflow-hidden rounded-xl border border-tablet-border bg-tablet-surface-2 px-3 py-1.5',
        className
      )}
    >
      <Cell label="INÍCIO" value={shiftStart ? fmtTimeShort(shiftStart) : '—'} valueClass="text-white" />
      <Divider />
      <Cell label="HOR. INICIAL" value={horimeterLabel} valueClass="text-petra-yellow" />
      <Divider />
      <Cell label="OPERANDO" value={fmtDuration(operatingMs)} valueClass="text-op-green" />
      <Divider />
      <Cell label="PARADAS" value={String(stopCount)} valueClass="text-op-orange" mono={false} />
      <Divider />
      <Cell label="T. PARADO" value={fmtDuration(stopDurationMs)} valueClass="text-op-red" />
    </div>
  );
};

type CellProps = { label: string; value: string; valueClass: string; mono?: boolean };

const Cell: React.FC<CellProps> = ({ label, value, valueClass, mono = true }) => (
  <div className="min-w-0 flex-1 px-1 text-center">
    <div className="font-display text-[9px] leading-none tracking-wider text-tablet-text-muted mb-0.5">
      {label}
    </div>
    <div
      className={cn(
        'text-sm font-bold leading-none tabular-nums',
        mono ? 'font-mono' : 'font-display',
        valueClass
      )}
    >
      {value}
    </div>
  </div>
);

const Divider: React.FC = () => (
  <div className="mx-1 w-px self-stretch bg-tablet-border" />
);
