// Referência: docs/parte_diaria_v46.html linhas 1557–1598 — renderTruckOps()
// Painel de contadores de viagens do caminhão: progresso da hora atual e do dia.

import { cn } from '@/lib/utils';

const pctColor = (pct: number) =>
  pct >= 100 ? 'text-op-green' : pct >= 60 ? 'text-petra-yellow' : 'text-op-red';

const pctBarBg = (pct: number) =>
  pct >= 100 ? 'bg-op-green' : pct >= 60 ? 'bg-petra-yellow' : 'bg-op-red';

export type TruckCountersPanelProps = {
  className?: string;
  slotLabel: string;
  hourTrips: number;
  hourGoal: number;
  productiveTrips: number;
  dailyGoal: number;
  totalTons: number;
  sterileTrips: number;
};

export const TruckCountersPanel: React.FC<TruckCountersPanelProps> = ({
  className,
  slotLabel,
  hourTrips,
  hourGoal,
  productiveTrips,
  dailyGoal,
  totalTons,
  sterileTrips,
}) => {
  const hourPct = hourGoal > 0 ? Math.min(100, Math.round((hourTrips / hourGoal) * 100)) : 0;
  const dayPct = dailyGoal > 0 ? Math.min(100, Math.round((productiveTrips / dailyGoal) * 100)) : 0;

  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-tablet-border bg-tablet-surface p-3',
        className
      )}
    >
      {/* hora atual */}
      <div className="mb-2 border-b border-tablet-border pb-2">
        <div className="mb-1 text-center font-display text-xs text-tablet-text-dim">
          Hora {slotLabel}
        </div>
        <div className="flex items-end justify-center gap-1">
          <span
            className={cn('font-display leading-none tabular-nums', pctColor(hourPct))}
            style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}
          >
            {hourTrips}
          </span>
          <span className="mb-0.5 text-sm font-bold text-tablet-text-dim">/{hourGoal}</span>
        </div>
        <div className={cn('mt-0.5 text-center text-xs', pctColor(hourPct))}>
          viagens nesta hora
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-tablet-surface-2">
          <div
            className={cn('h-full transition-[width] duration-300', pctBarBg(hourPct))}
            style={{ width: `${hourPct}%` }}
          />
        </div>
        <div className={cn('mt-0.5 text-center text-xs font-bold', pctColor(hourPct))}>
          {hourPct}% meta hora
        </div>
      </div>

      {/* dia */}
      <div>
        <div className="mb-1 text-center font-display text-xs text-tablet-text-dim">Dia</div>
        <div className="flex items-end justify-center gap-1">
          <span
            className="font-display leading-none tabular-nums text-white"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}
          >
            {productiveTrips}
          </span>
          <span className="mb-0.5 text-sm font-bold text-tablet-text-dim">/{dailyGoal}</span>
        </div>
        <div className="mt-0.5 text-center text-xs text-tablet-text-dim">produtivas hoje</div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-tablet-surface-2">
          <div
            className="h-full bg-gradient-to-r from-op-green to-petra-yellow transition-[width] duration-300"
            style={{ width: `${dayPct}%` }}
          />
        </div>
        <div className={cn('mt-0.5 text-center text-xs font-bold', pctColor(dayPct))}>
          {dayPct}% meta dia
        </div>
      </div>

      {/* totais */}
      <div className="mt-1 flex justify-around border-t border-tablet-border pt-2">
        <div className="text-center">
          <div
            className="font-mono font-bold text-petra-yellow"
            style={{ fontSize: 'clamp(0.85rem, 2vw, 1.1rem)' }}
          >
            {totalTons.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}t
          </div>
          <div className="font-display text-xs text-tablet-text-dim">Ton.</div>
        </div>
        <div className="w-px bg-tablet-border" />
        <div className="text-center">
          <div
            className="font-display text-op-red"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.6rem)' }}
          >
            {sterileTrips}
          </div>
          <div className="font-display text-xs text-tablet-text-dim">Decape</div>
        </div>
      </div>
    </div>
  );
};
