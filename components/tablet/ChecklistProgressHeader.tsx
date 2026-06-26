// Referência: docs/parte_diaria_v46.html linhas 906–920 — renderTabletChecklist()
// [EXTRACTED: ChecklistProgressHeader]

import { cn } from '@/lib/utils';

export type ChecklistProgressHeaderProps = {
  className?: string;
  equipmentCode: string;
  operatorName: string;
  done: number;
  total: number;
};

export const ChecklistProgressHeader: React.FC<ChecklistProgressHeaderProps> = ({
  className,
  equipmentCode,
  operatorName,
  done,
  total,
}) => {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className={cn('flex-shrink-0 bg-petra-blue px-4 pb-2 pt-2', className)}>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="hairline mb-0.5 text-xs text-petra-yellow">CHECKLIST PRÉ-OPERAÇÃO</div>
          <div className="text-base font-bold leading-tight text-white">
            {equipmentCode} · {operatorName}
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl font-bold leading-none text-petra-yellow">
            {done}/{total}
          </div>
          <div className="mt-0.5 text-xs text-white/60">{pct}% concluído</div>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-petra-yellow transition-all"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
