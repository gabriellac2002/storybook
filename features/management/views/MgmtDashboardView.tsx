'use client';

// Referência: docs/parte_diaria_v46.html linhas 3985–4090 — renderMgmtDashboard()

import { cn } from '@/lib/utils';
import { KpiCard } from '@/components/management/KpiCard';
import { FleetCard, FleetCardProps } from '@/components/management/FleetCard';
import { IconName } from '@/components/petra/PetraIcon';
import { StatusDot } from '@/components/petra/StatusDot';

export type MgmtDashboardViewProps = {
  className?: string;
};

// ── Mock data (substituir por store/API) ─────────────────────────────────────

type MockEquipment = Omit<FleetCardProps, 'onClick'> & { id: string };

const MOCK_KPI = {
  totalTons:       1248,
  totalTrips:      43,
  oee:             72,
  operatingCount:  6,
  totalEq:         9,
};

const MOCK_FLEET: MockEquipment[] = [
  { id: 'ut01', code: 'UT-01', category: 'Caminhão Basculante', kind: 'truck' as IconName,   status: 'operating',   since: new Date(Date.now() - 2.5 * 3600_000).toISOString(), operator: 'João Silva',    tripsToday: 12, tonsToday: 348 },
  { id: 'ut02', code: 'UT-02', category: 'Caminhão Basculante', kind: 'truck' as IconName,   status: 'operating',   since: new Date(Date.now() - 1.8 * 3600_000).toISOString(), operator: 'Maria Lima',    tripsToday: 9,  tonsToday: 261 },
  { id: 'ut03', code: 'UT-03', category: 'Caminhão Basculante', kind: 'truck' as IconName,   status: 'stopped',     since: new Date(Date.now() - 18 * 60_000).toISOString(),    operator: 'Carlos Souza',  tripsToday: 5,  tonsToday: 145 },
  { id: 'pa01', code: 'PA-01', category: 'Pá Carregadeira',     kind: 'loader' as IconName,  status: 'operating',   since: new Date(Date.now() - 3.2 * 3600_000).toISOString(), operator: 'Ana Costa',     tripsToday: 0,  tonsToday: 0   },
  { id: 'ex01', code: 'EX-01', category: 'Escavadeira',          kind: 'excavator' as IconName,status:'operating',  since: new Date(Date.now() - 4 * 3600_000).toISOString(),   operator: 'Pedro Alves',   tripsToday: 0,  tonsToday: 0   },
  { id: 'mf01', code: 'MF-01', category: 'Motoniveladora',       kind: 'grader' as IconName,  status: 'maintenance', since: new Date(Date.now() - 45 * 60_000).toISOString(),    operator: null,            tripsToday: 0,  tonsToday: 0   },
  { id: 'pp01', code: 'PP-01', category: 'Caminhão Pipa',        kind: 'water' as IconName,   status: 'operating',   since: new Date(Date.now() - 1.1 * 3600_000).toISOString(), operator: 'Lucas Dias',    tripsToday: 5, litersToday: 50000, isPipa: true },
  { id: 'pe01', code: 'PE-01', category: 'Perfuratriz',          kind: 'drill' as IconName,   status: 'oficina',     since: new Date(Date.now() - 3 * 3600_000).toISOString(),    operator: null,            tripsToday: 0,  tonsToday: 0   },
  { id: 'ut04', code: 'UT-04', category: 'Caminhão Basculante', kind: 'truck' as IconName,   status: 'off',         since: null,                                                   operator: null,            tripsToday: 0,  tonsToday: 0   },
];

const STATUS_LEGEND: { color: 'green' | 'orange' | 'red' | 'purple' | 'gray'; label: string }[] = [
  { color: 'green',  label: 'Operando'    },
  { color: 'orange', label: 'Parado'      },
  { color: 'red',    label: 'Manutenção'  },
  { color: 'purple', label: 'Oficina'     },
  { color: 'gray',   label: 'Desligado'   },
];

// ── View ─────────────────────────────────────────────────────────────────────

export const MgmtDashboardView: React.FC<MgmtDashboardViewProps> = ({ className }) => {
  const { totalTons, totalTrips, oee, operatingCount, totalEq } = MOCK_KPI;

  return (
    <div className={cn('overflow-y-auto px-6 py-5', className)}>
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="hairline text-xs text-petra-blue">Dashboard Operacional</div>
          <h1 className="font-display text-2xl font-black text-foreground">Visão Geral</h1>
        </div>
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Toneladas Produzidas"
          value={totalTons.toLocaleString('pt-BR')}
          unit="t hoje"
          icon="pile"
          color="orange"
          trend="up"
          trendValue="+8% vs ontem"
        />
        <KpiCard
          label="Viagens Totais"
          value={totalTrips}
          unit="movimentações"
          icon="truck"
          color="blue"
          trend="up"
          trendValue="+3 vs ontem"
        />
        <KpiCard
          label="% Em Operação"
          value={`${oee}%`}
          unit="frota ativa"
          icon="gauge"
          color="green"
        />
        <KpiCard
          label="Equipamentos"
          value={`${operatingCount}/${totalEq}`}
          unit="em operação"
          icon="check"
          color="blue"
        />
      </div>

      {/* Fleet grid */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-black text-foreground">Status da Frota</h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {STATUS_LEGEND.map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1">
                <StatusDot color={color} size={8} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_FLEET.map(({ id, ...props }) => (
            <FleetCard
              key={id}
              {...props}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
