// Referência: docs/parte_diaria_v46.html linhas 1150–1168 — horimeterInput()
// [EXTRACTED: HorimeterInput]
// Spinner de ±0,1 h com chips de ajuste rápido para leitura de horímetro.

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type HorimeterInputProps = {
  className?: string;
  id: string;
  label: string;
  lastValue: number;
  value: number;
  onChange: (val: number) => void;
};

const QUICK_ADJUSTS: [number, string][] = [
  [-0.1, '−0,1h'],
  [+0.1, '+0,1h'],
  [+0.5, '+0,5h'],
  [+1,   '+1h'],
];

export const HorimeterInput: React.FC<HorimeterInputProps> = ({
  className,
  id,
  label,
  lastValue,
  value,
  onChange,
}) => {
  const adjust = (delta: number) =>
    onChange(Math.max(0, parseFloat((value + delta).toFixed(1))));

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(',', '.');
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) onChange(Math.max(0, parseFloat(parsed.toFixed(1))));
  };

  return (
    <div className={cn('rounded-xl border border-tablet-border bg-tablet-surface p-4', className)}>
      <Label htmlFor={id} className="hairline mb-1 block text-sm text-tablet-text-dim">
        {label}
      </Label>
      <div className="mb-3 text-xs text-tablet-text-dim">
        Último registro:{' '}
        <span className="font-display font-bold text-petra-yellow">
          {lastValue.toFixed(1)} h
        </span>{' '}
        · ajuste se necessário
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => adjust(-0.1)}
          aria-label="Diminuir 0,1h"
          className="size-16 flex-shrink-0 rounded-2xl border-2 border-tablet-border bg-tablet-surface-2 text-3xl font-black hover:bg-tablet-surface-3"
        >
          −
        </Button>

        <div className="relative flex-1">
          <Input
            id={id}
            type="number"
            step="0.1"
            min="0"
            inputMode="decimal"
            value={value}
            onChange={handleInput}
            className="h-auto border-2 border-tablet-border bg-tablet-bg px-3 py-4 text-center font-display text-3xl font-bold text-petra-yellow focus-visible:border-petra-blue focus-visible:ring-petra-blue/20"
          />
          <div className="hairline mt-1 text-center text-xs text-tablet-text-dim">horas</div>
        </div>

        <Button
          variant="outline"
          onClick={() => adjust(+0.1)}
          aria-label="Aumentar 0,1h"
          className="size-16 flex-shrink-0 rounded-2xl border-2 border-tablet-border bg-tablet-surface-2 text-3xl font-black hover:bg-tablet-surface-3"
        >
          +
        </Button>
      </div>

      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {QUICK_ADJUSTS.map(([delta, lbl]) => (
          <Button
            key={lbl}
            variant="ghost"
            onClick={() => adjust(delta)}
            className="rounded-lg bg-tablet-surface-3 py-2 text-xs font-bold text-tablet-text-dim hover:bg-tablet-surface-2"
          >
            {lbl}
          </Button>
        ))}
      </div>
    </div>
  );
};
