'use client';

// Referência: docs/parte_diaria_v46.html linhas 1499–1657 — renderTruckOps()

import { cn } from '@/lib/utils';
import { IconName } from '@/components/petra/PetraIcon';
import { OpHeader } from '@/components/tablet/OpHeader';
import { TurnoInfoBar } from '@/components/tablet/TurnoInfoBar';
import { OpActionsPanel } from '@/components/tablet/OpActionsPanel';
import { TruckCountersPanel } from '@/components/tablet/TruckCountersPanel';
import { TruckProductionButtons } from '@/components/tablet/TruckProductionButtons';
import { OpControlsColumn } from '@/components/tablet/OpControlsColumn';
import {
  useTabletStore,
  selectProductiveTrips,
  selectSterileTrips,
  selectTotalTons,
  selectStopEvents,
  selectStopDurationMs,
  selectLastTrip,
  selectHourTrips,
} from '@/lib/store/tabletStore';

export type TruckOpsViewProps = {
  className?: string;
};

export const TruckOpsView: React.FC<TruckOpsViewProps> = ({ className }) => {
  const session   = useTabletStore(s => s.session);
  const equipment = useTabletStore(s => s.equipment);
  const slotLabel = useTabletStore(s => s.slotLabel);
  const hourGoal  = useTabletStore(s => s.hourGoal);
  const dailyGoal = useTabletStore(s => s.dailyGoal);

  const productive    = useTabletStore(selectProductiveTrips);
  const sterile       = useTabletStore(selectSterileTrips);
  const totalTons     = useTabletStore(selectTotalTons);
  const stopCount     = useTabletStore(s => selectStopEvents(s).length);
  const stopDurationMs = useTabletStore(selectStopDurationMs);
  const lastTrip      = useTabletStore(selectLastTrip);
  const hourTrips     = useTabletStore(selectHourTrips);

  const cancelLastTrip = useTabletStore(s => s.cancelLastTrip);
  const endShift       = useTabletStore(s => s.endShift);
  const logout         = useTabletStore(s => s.logout);
  const setTruckMode   = useTabletStore(s => s.setTruckMode);

  if (!equipment || !session.operator) return null;

  const stopActive = !!session.activeStop;
  const isDemais   = session.truckMode === 'demais';

  return (
    <div className={cn('flex h-full flex-col gap-2 bg-tablet-bg p-2', className)}>
      <OpHeader
        equipmentCode={equipment.code}
        equipmentIcon={equipment.kind as IconName}
        operatorName={session.operator.name}
        isOperating={!stopActive}
        onLogout={logout}
      />

      {/* PARTE DE CIMA — produção */}
      <div className="flex min-h-0 gap-2" style={{ flex: 3 }}>
        <TruckProductionButtons style={{ flex: 3 }} />

        {/* Contadores + cancelar */}
        <div className="flex min-h-0 flex-col gap-2" style={{ flex: 1 }}>
          <TruckCountersPanel
            slotLabel={slotLabel}
            hourTrips={hourTrips}
            hourGoal={hourGoal}
            productiveTrips={productive.length}
            dailyGoal={dailyGoal}
            totalTons={totalTons}
            sterileTrips={sterile.length}
          />

          <button
            type="button"
            onClick={cancelLastTrip}
            disabled={!lastTrip}
            aria-label="Cancelar última viagem registrada"
            className={cn(
              'flex flex-shrink-0 flex-col items-center justify-center gap-1 rounded-xl transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30',
              lastTrip
                ? 'border-2 border-dashed border-tablet-border-light bg-tablet-surface-2 text-tablet-text-dim hover:bg-tablet-surface-3 hover:text-white'
                : 'border border-tablet-border bg-tablet-surface text-tablet-text-muted'
            )}
            style={{ height: 88 }}
          >
            <span className="text-2xl leading-none">↩</span>
            <span className="text-sm font-black tracking-wide">CANCELAR BASCUL.</span>
            {lastTrip ? (
              <span className={cn(
                'font-display text-xs',
                lastTrip.subtype === 'productive' ? 'text-op-green' : 'text-op-red'
              )}>
                {lastTrip.subtype === 'productive' ? 'ÚLTIMO: PRIMÁRIO' : 'ÚLTIMO: DECAPE'}
              </span>
            ) : (
              <span className="font-display text-xs text-tablet-text-muted">Nenhum registro</span>
            )}
          </button>
        </div>
      </div>

      {/* Faixa de modo Demais Serviços */}
      {isDemais && (
        <div
          className="flex flex-shrink-0 items-center justify-between rounded-xl border border-petra-blue/40 bg-petra-blue/15 px-3 py-1.5"
          style={{ height: 40 }}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-lg" aria-hidden="true">🔧</span>
            <span className="truncate text-sm font-black">DEMAIS SERVIÇOS</span>
            <span className="hidden text-xs text-tablet-text-dim sm:inline">
              · justificativa de viagem não obrigatória
            </span>
          </div>
          <button
            type="button"
            onClick={() => setTruckMode('producao')}
            className="flex-shrink-0 rounded-lg border border-tablet-border px-2.5 py-1 text-xs font-bold text-tablet-text-dim transition hover:text-petra-yellow active:scale-95"
          >
            Trocar modo →
          </button>
        </div>
      )}

      <TurnoInfoBar
        shiftStart={session.shiftStart}
        horimeterLabel={session.horimeterLabel}
        stopCount={stopCount}
        stopDurationMs={stopDurationMs}
      />

      {/* PARTE DE BAIXO — controles operacionais */}
      <div className="flex min-h-0 gap-2" style={{ flex: 2 }}>
        <OpControlsColumn className="flex-1" />
        <OpActionsPanel
          className="flex-1"
          onMaintenanceAlert={() => {}}
          onProductionAlert={() => {}}
          onObservation={() => {}}
          onEndShift={endShift}
        />
      </div>
    </div>
  );
};
