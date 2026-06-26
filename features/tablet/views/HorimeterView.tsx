'use client';

// Referência: docs/parte_diaria_v46.html linhas 1097–1151 — renderTabletHorimeter()

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { HorimeterInput } from '@/components/tablet/HorimeterInput';
import { useTabletStore } from '@/lib/store/tabletStore';

export type HorimeterViewProps = {
  className?: string;
  onConfirm?: (values: Record<string, number>) => void;
};

type FieldDef = { key: string; label: string; lastValue: number };

function getFields(kind: string, lastHorimeter?: number, lastHorimeters?: Record<string, number>): FieldDef[] {
  if (kind === 'britagem-primaria') {
    return [
      { key: 'alimentador', label: 'Horímetro Alimentador Primário', lastValue: lastHorimeters?.alimentador ?? 0 },
      { key: 'britador',    label: 'Horímetro Britador Primário',    lastValue: lastHorimeters?.britador    ?? 0 },
    ];
  }
  if (kind === 'rebritagem') {
    return [
      { key: 'alimSec',  label: 'Alim. Secundário',    lastValue: lastHorimeters?.alimSec  ?? 0 },
      { key: 'britSec',  label: 'Britador Secundário',  lastValue: lastHorimeters?.britSec  ?? 0 },
      { key: 'alimTer',  label: 'Alim. Terciário',      lastValue: lastHorimeters?.alimTer  ?? 0 },
      { key: 'britTer',  label: 'Britador Terciário',   lastValue: lastHorimeters?.britTer  ?? 0 },
      { key: 'alimQua',  label: 'Alim. Quaternário',    lastValue: lastHorimeters?.alimQua  ?? 0 },
      { key: 'britQua',  label: 'Britador Quaternário', lastValue: lastHorimeters?.britQua  ?? 0 },
      { key: 'peneira1', label: 'Peneira 1',            lastValue: lastHorimeters?.peneira1 ?? 0 },
      { key: 'peneira2', label: 'Peneira 2',            lastValue: lastHorimeters?.peneira2 ?? 0 },
      { key: 'peneira3', label: 'Peneira 3',            lastValue: lastHorimeters?.peneira3 ?? 0 },
    ];
  }
  return [{ key: 'horimeter', label: 'Horímetro do Equipamento', lastValue: lastHorimeter ?? 0 }];
}

export const HorimeterView: React.FC<HorimeterViewProps> = ({ className, onConfirm }) => {
  const equipment = useTabletStore(s => s.equipment);
  const operator  = useTabletStore(s => s.session.operator);

  const fields = getFields(equipment?.kind ?? '', equipment?.lastHorimeter, equipment?.lastHorimeters);

  const [values, setValues] = useState<Record<string, number>>(
    () => Object.fromEntries(fields.map(f => [f.key, f.lastValue]))
  );

  const setField = (key: string, val: number) =>
    setValues(v => ({ ...v, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm?.(values);
  };

  if (!equipment || !operator) return null;

  const isMulti = fields.length > 2;

  return (
    <div className={cn('flex h-full flex-col overflow-y-auto', className)}>
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-3xl space-y-4 p-6"
      >
        <div className="mb-6">
          <div className="hairline text-petra-yellow text-xs">Etapa 2 de 2 — Pré-Operação</div>
          <h1 className="font-display text-3xl font-black text-white">Horímetro Inicial</h1>
          <div className="mt-1 text-sm text-tablet-text-dim">
            {equipment.code} · Confirme ou ajuste o valor lido
          </div>
        </div>

        <div className={cn(
          'grid gap-4',
          isMulti ? 'grid-cols-1 md:grid-cols-3' : fields.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
        )}>
          {fields.map(f => (
            <HorimeterInput
              key={f.key}
              id={`horim-${f.key}`}
              label={f.label}
              lastValue={f.lastValue}
              value={values[f.key] ?? f.lastValue}
              onChange={val => setField(f.key, val)}
            />
          ))}
        </div>

        <Button
          type="submit"
          className="mt-6 w-full rounded-xl py-4 text-xl font-black uppercase tracking-wider bg-petra-blue text-white hover:bg-petra-blue-light"
        >
          Iniciar Turno →
        </Button>
      </form>
    </div>
  );
};
