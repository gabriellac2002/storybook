// Referência: docs/parte_diaria_v46.html linhas 1453–1482 — renderOpBottomRight()
// Painel de ações compartilhado por Truck, Loader e Excavator.
// Esquerda: 3 botões de observação. Direita: botão "Encerrar Turno" (azul Petra).

import { cn } from '@/lib/utils';
import { PetraIcon } from '@/components/petra/PetraIcon';

export type OpActionsPanelProps = {
  className?: string;
  onMaintenanceAlert: () => void;
  onProductionAlert: () => void;
  onObservation: () => void;
  onEndShift: () => void;
};

export const OpActionsPanel: React.FC<OpActionsPanelProps> = ({
  className,
  onMaintenanceAlert,
  onProductionAlert,
  onObservation,
  onEndShift,
}) => {
  return (
    <div className={cn('flex gap-2', className)}>
      <div className="flex flex-1 flex-col gap-2">
        <ObsButton
          label="OBS. MANUT."
          icon={<PetraIcon name="wrench" size={28} className="text-op-red" />}
          onClick={onMaintenanceAlert}
          aria-label="Registrar observação de manutenção"
        />
        <ObsButton
          label="OBS. PROD."
          icon={<PetraIcon name="rock" size={28} className="text-op-amber" />}
          onClick={onProductionAlert}
          aria-label="Registrar observação de produção"
        />
        <ObsButton
          label="OBS."
          icon={<PetraIcon name="note" size={28} className="text-tablet-text-dim" />}
          onClick={onObservation}
          aria-label="Registrar observação geral"
        />
      </div>

      <button
        type="button"
        onClick={onEndShift}
        aria-label="Encerrar turno de operação"
        className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl bg-petra-blue font-black shadow-lg shadow-petra-blue/30 transition hover:bg-petra-blue-light active:scale-[0.98]"
      >
        <PetraIcon name="flag" size={44} />
        <div className="font-display text-xl leading-tight text-center px-1">
          ENCERRAR
          <br />
          TURNO
        </div>
      </button>
    </div>
  );
};

type ObsButtonProps = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  'aria-label': string;
};

const ObsButton: React.FC<ObsButtonProps> = ({ label, icon, onClick, 'aria-label': ariaLabel }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    className="flex min-h-[64px] flex-1 flex-col items-center justify-center gap-1.5 rounded-xl border border-tablet-border bg-tablet-surface-2 transition hover:bg-tablet-surface-3 active:scale-[0.98]"
  >
    {icon}
    <span className="font-display text-sm font-black tracking-wider text-tablet-text-dim">
      {label}
    </span>
  </button>
);
