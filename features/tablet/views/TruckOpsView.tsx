'use client';

// Referência: docs/parte_diaria_v46.html linhas 1499–1657 — renderTruckOps()
// Tela operacional do caminhão. Client boundary.
// Props representam o contrato que o state store precisará alimentar.

import { cn } from '@/lib/utils';
import { PetraIcon, IconName } from '@/components/petra/PetraIcon';
import { OpHeader } from '@/components/tablet/OpHeader';
import { TurnoInfoBar } from '@/components/tablet/TurnoInfoBar';
import { ActiveStopBanner } from '@/components/tablet/ActiveStopBanner';
import { OpActionsPanel } from '@/components/tablet/OpActionsPanel';
import { StopButton } from '@/components/tablet/StopButton';
import { TruckCountersPanel } from '@/components/tablet/TruckCountersPanel';

export type TruckOpsViewProps = {
  className?: string;
  // Equipamento + operador
  equipmentCode: string;
  equipmentIcon: IconName;
  operatorName: string;
  // Turno
  shiftStart: string | null;
  horimeterLabel: string;
  stopCount: number;
  stopDurationMs: number;
  activeStop: { startTs: string } | null;
  // Viagens
  productiveTrips: number;
  sterileTrips: number;
  totalTons: number;
  dailyGoal: number;
  slotLabel: string;
  hourTrips: number;
  hourGoal: number;
  lastTrip: { subtype: 'productive' | 'sterile'; timeLabel: string } | null;
  // Modo
  isDemais: boolean;
  // Ações
  onRegisterProductive: () => void;
  onRegisterSterile: () => void;
  onCancelLastTrip: () => void;
  onStopPress: () => void;
  onStockIn: () => void;
  onMaintenanceAlert: () => void;
  onProductionAlert: () => void;
  onObservation: () => void;
  onEndShift: () => void;
  onLogout: () => void;
  onChangeTruckMode: () => void;
};

export const TruckOpsView: React.FC<TruckOpsViewProps> = ({
  className,
  equipmentCode,
  equipmentIcon,
  operatorName,
  shiftStart,
  horimeterLabel,
  stopCount,
  stopDurationMs,
  activeStop,
  productiveTrips,
  sterileTrips,
  totalTons,
  dailyGoal,
  slotLabel,
  hourTrips,
  hourGoal,
  lastTrip,
  isDemais,
  onRegisterProductive,
  onRegisterSterile,
  onCancelLastTrip,
  onStopPress,
  onStockIn,
  onMaintenanceAlert,
  onProductionAlert,
  onObservation,
  onEndShift,
  onLogout,
  onChangeTruckMode,
}) => {
  const stopActive = !!activeStop;

  return (
    <div className={cn('flex h-full flex-col gap-2 bg-tablet-bg p-2', className)}>
      <OpHeader
        equipmentCode={equipmentCode}
        equipmentIcon={equipmentIcon}
        operatorName={operatorName}
        isOperating={!stopActive}
        onLogout={onLogout}
      />

      {/* PARTE DE CIMA — Controle de Produção */}
      <div className="flex min-h-0 gap-2" style={{ flex: 3 }}>

        {/* Esquerdo: basculamento + decape */}
        <div className="flex min-h-0 flex-col gap-2" style={{ flex: 3 }}>
          {activeStop && (
            <ActiveStopBanner startTs={activeStop.startTs} onClick={onStopPress} />
          )}

          <button
            type="button"
            onClick={onRegisterProductive}
            disabled={stopActive}
            aria-label="Registrar basculamento produtivo no britador primário"
            className={cn(
              'flex min-h-0 flex-col items-center justify-center gap-2 rounded-2xl font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40',
              stopActive
                ? 'bg-op-green/50'
                : 'bg-op-green shadow-xl shadow-op-green/30 hover:bg-op-green-dark'
            )}
            style={{ flex: 3 }}
          >
            <PetraIcon name="dump" size={56} />
            <span className="font-display text-3xl leading-tight">BASCULAMENTO</span>
            <span className="text-base font-semibold opacity-90">no Primário</span>
          </button>

          <button
            type="button"
            onClick={onRegisterSterile}
            disabled={stopActive}
            aria-label="Registrar viagem de decape"
            className={cn(
              'flex min-h-0 flex-row items-center justify-center gap-3 rounded-2xl font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40',
              stopActive
                ? 'bg-op-red/50'
                : 'bg-op-red shadow-xl shadow-op-red/30 hover:bg-op-red-dark'
            )}
            style={{ flex: 1 }}
          >
            <PetraIcon name="decape" size={34} />
            <div>
              <div className="font-display text-2xl leading-tight">DECAPE</div>
              <div className="text-sm font-semibold opacity-90">Material de decape</div>
            </div>
          </button>
        </div>

        {/* Direito: contadores + cancelar */}
        <div className="flex min-h-0 flex-col gap-2" style={{ flex: 1 }}>
          <TruckCountersPanel
            slotLabel={slotLabel}
            hourTrips={hourTrips}
            hourGoal={hourGoal}
            productiveTrips={productiveTrips}
            dailyGoal={dailyGoal}
            totalTons={totalTons}
            sterileTrips={sterileTrips}
          />

          <button
            type="button"
            onClick={onCancelLastTrip}
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
              <span
                className={cn(
                  'font-display text-xs',
                  lastTrip.subtype === 'productive' ? 'text-op-green' : 'text-op-red'
                )}
              >
                {lastTrip.subtype === 'productive' ? 'ÚLTIMO: PRIMÁRIO' : 'ÚLTIMO: DECAPE'}
              </span>
            ) : (
              <span className="font-display text-xs text-tablet-text-muted">Nenhum registro</span>
            )}
          </button>
        </div>
      </div>

      {/* Banner de modo Demais Serviços */}
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
            onClick={onChangeTruckMode}
            className="flex-shrink-0 rounded-lg border border-tablet-border px-2.5 py-1 text-xs font-bold text-tablet-text-dim transition hover:text-petra-yellow active:scale-95"
          >
            Trocar modo →
          </button>
        </div>
      )}

      <TurnoInfoBar
        shiftStart={shiftStart}
        horimeterLabel={horimeterLabel}
        stopCount={stopCount}
        stopDurationMs={stopDurationMs}
      />

      {/* PARTE DE BAIXO — Controles Operacionais */}
      <div className="flex min-h-0 gap-2" style={{ flex: 2 }}>
        {/* Esquerdo: entrada estoque + parada */}
        <div className="flex min-h-0 flex-col gap-2" style={{ flex: 1 }}>
          <button
            type="button"
            onClick={onStockIn}
            className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-tablet-border bg-tablet-surface-2 font-bold transition hover:bg-tablet-surface-3 active:scale-[0.98]"
          >
            <PetraIcon name="inbound" size={30} className="text-tablet-text-dim" />
            <span className="text-sm font-black tracking-wide text-tablet-text">ENTRADA ESTOQUE</span>
          </button>

          <StopButton
            className="flex-1"
            isActive={stopActive}
            startTs={activeStop?.startTs}
            onClick={onStopPress}
          />
        </div>

        {/* Direito: obs + encerrar turno */}
        <OpActionsPanel
          className="flex-1"
          onMaintenanceAlert={onMaintenanceAlert}
          onProductionAlert={onProductionAlert}
          onObservation={onObservation}
          onEndShift={onEndShift}
        />
      </div>
    </div>
  );
};
