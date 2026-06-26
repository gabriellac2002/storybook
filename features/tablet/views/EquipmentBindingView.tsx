'use client';

// Referência: docs/parte_diaria_v46.html linhas 750–794 — renderTabletEquipmentBinding()
// Visível apenas para admin. Admin seleciona qual equipamento ficará vinculado a este tablet.

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PetraIcon } from '@/components/petra/PetraIcon';
import { IconName } from '@/components/petra/PetraIcon';
import { useTabletStore } from '@/lib/store/tabletStore';
import { groupedEquipments } from '@/lib/data/equipments';

export type EquipmentBindingViewProps = {
  className?: string;
};

const GROUPED = groupedEquipments();

export const EquipmentBindingView: React.FC<EquipmentBindingViewProps> = ({ className }) => {
  const operator     = useTabletStore(s => s.session.operator);
  const bindEquipment = useTabletStore(s => s.bindEquipment);
  const logout       = useTabletStore(s => s.logout);

  if (!operator || operator.role !== 'admin') return null;

  return (
    <div className={cn('min-h-screen overflow-y-auto bg-tablet-bg px-6 py-8', className)}>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <p className="hairline mb-1 text-petra-yellow">Admin · {operator.name}</p>
          <h1 className="font-display text-3xl font-black text-white">Vincular Tablet a um Equipamento</h1>
          <p className="mt-1 text-sm text-tablet-text-dim">
            Esta tela só aparece para administradores. Selecione qual equipamento ficará vinculado a este tablet.
          </p>
        </div>

        {/* Grid por categoria */}
        {Object.entries(GROUPED).map(([category, equipments]) => (
          <div key={category} className="mb-8">
            <p className="hairline mb-3 text-tablet-text-dim">{category}</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {equipments.map(eq => (
                <Button
                  key={eq.id}
                  variant="ghost"
                  onClick={() => bindEquipment(eq.id)}
                  className="h-auto w-full items-center justify-start gap-4 rounded-xl border border-tablet-border bg-tablet-surface p-4 text-left hover:border-petra-blue-light hover:bg-tablet-surface-2"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-tablet-surface-2">
                    <PetraIcon
                      name={eq.kind as IconName}
                      size={26}
                      className="text-petra-yellow"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-base font-bold text-white">{eq.code}</div>
                    <div className="truncate text-xs text-tablet-text-dim">{eq.name}</div>
                    {eq.lastHorimeter != null && (
                      <div className="mt-0.5 font-mono text-xs text-tablet-text-muted">
                        {eq.lastHorimeter.toFixed(1)}h
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ))}

        {/* Voltar */}
        <div className="mt-6 flex justify-end">
          <Button
            variant="ghost"
            onClick={logout}
            className="text-sm text-tablet-text-dim hover:text-white"
          >
            ← Voltar ao Login
          </Button>
        </div>
      </div>
    </div>
  );
};
