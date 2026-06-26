// Referência: docs/parte_diaria_v46.html linhas 4186–4213 — fleetCard()
// [EXTRACTED: FleetCard]
// Card de equipamento para o painel de gestão. Mostra status, operador e viagens do dia.

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PetraIcon, IconName } from '@/components/petra/PetraIcon';
import { StatusDot, equipmentStatusColor } from '@/components/petra/StatusDot';
import { fmtDurationShort } from '@/lib/format';

export type EquipmentStatus = 'operating' | 'stopped' | 'maintenance' | 'oficina' | 'off';

export type FleetCardProps = {
  className?: string;
  code: string;
  category: string;
  /** Ícone do equipamento (IconName). Caminhão-pipa usa 'water'. */
  kind: IconName;
  /** Quando true, exibe "carregamentos" e litros em vez de viagens/toneladas. */
  isPipa?: boolean;
  status: EquipmentStatus;
  since?: string | null;
  operator?: string | null;
  tripsToday?: number;
  tonsToday?: number;
  litersToday?: number;
  onClick?: () => void;
};

const STATUS_LABEL: Record<EquipmentStatus, (sinceLabel: string) => string> = {
  operating:   (s) => `Operando há ${s}`,
  stopped:     (s) => `Parado há ${s}`,
  maintenance: (s) => `Manutenção há ${s}`,
  oficina:     (s) => `Na oficina há ${s}`,
  off:         ()  => 'Desligado',
};

const statusColor = (status: EquipmentStatus) => {
  if (status === 'oficina') return 'purple' as const;
  return equipmentStatusColor(status);
};

const statusPulses = (status: EquipmentStatus) =>
  status === 'operating' || status === 'stopped' || status === 'maintenance';

export const FleetCard: React.FC<FleetCardProps> = ({
  className,
  code,
  category,
  kind,
  isPipa = false,
  status,
  since,
  operator,
  tripsToday = 0,
  tonsToday = 0,
  litersToday = 0,
  onClick,
}) => {
  const sinceMs    = since ? Date.now() - new Date(since).getTime() : 0;
  const sinceLabel = fmtDurationShort(sinceMs);
  const statusText = STATUS_LABEL[status](sinceLabel);

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        'h-auto w-full flex-col items-start rounded-xl border border-border bg-card p-3 text-left whitespace-normal shadow-sm hover:shadow-md active:scale-[0.98]',
        className
      )}
    >
      {/* Cabeçalho: ícone + nome + dot */}
      <div className="mb-2 flex w-full items-start gap-2">
        <div className="text-petra-yellow" aria-hidden="true">
          <PetraIcon name={kind} size={26} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold text-foreground">{code}</div>
          <div className="truncate text-xs text-muted-foreground">{category}</div>
        </div>
        <StatusDot
          color={statusColor(status)}
          fast={statusPulses(status)}
          size={10}
          className="mt-0.5"
        />
      </div>

      {/* Operador */}
      <div className="flex w-full items-center gap-1 truncate text-xs text-muted-foreground">
        {operator ? (
          <>
            <PetraIcon name="user" size={12} className="flex-shrink-0 text-muted-foreground" />
            <span className="truncate text-foreground/80">{operator}</span>
          </>
        ) : (
          <span className="text-muted-foreground/60">— sem operador</span>
        )}
      </div>

      {/* Status e tempo */}
      <div className="mt-0.5 w-full text-[11px] text-muted-foreground">{statusText}</div>

      {/* Viagens do dia */}
      {tripsToday > 0 && (
        <div className="font-display mt-2 flex w-full justify-between text-[11px]">
          <span>{tripsToday} {isPipa ? 'carregamentos' : 'viagens'}</span>
          <span className="font-bold text-petra-blue">
            {isPipa
              ? `${litersToday.toLocaleString('pt-BR')} L`
              : `${tonsToday.toLocaleString('pt-BR')}t`}
          </span>
        </div>
      )}
    </Button>
  );
};
