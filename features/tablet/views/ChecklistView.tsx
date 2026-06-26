'use client';

// Referência: docs/parte_diaria_v46.html linhas 889–1018 — renderTabletChecklist()

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChecklistProgressHeader } from '@/components/tablet/ChecklistProgressHeader';
import { ChecklistItem, ChecklistStatus } from '@/components/tablet/ChecklistItem';
import { getChecklistItems } from '@/lib/checklist';
import { useTabletStore } from '@/lib/store/tabletStore';

export type ChecklistViewProps = {
  className?: string;
  onConfirm?: () => void;
};

type Draft = Record<string, { status: ChecklistStatus; desc: string }>;

export const ChecklistView: React.FC<ChecklistViewProps> = ({ className, onConfirm }) => {
  const equipment = useTabletStore(s => s.equipment);
  const operator  = useTabletStore(s => s.session.operator);

  const items = useMemo(
    () => getChecklistItems(equipment?.kind ?? ''),
    [equipment?.kind]
  );

  const [draft, setDraft] = useState<Draft>(() =>
    Object.fromEntries(items.map(i => [i.id, { status: null, desc: '' }]))
  );

  const done    = items.filter(i => draft[i.id]?.status !== null).length;
  const allDone = done === items.length;
  const hasInapt = items.some(i => draft[i.id]?.status === 'inapto');
  const missingDescCount = items.filter(
    i => draft[i.id]?.status === 'inapto' && !draft[i.id]?.desc?.trim()
  ).length;
  const canConfirm = allDone && missingDescCount === 0;

  const setStatus = (id: string, status: ChecklistStatus) =>
    setDraft(d => ({ ...d, [id]: { ...d[id], status } }));

  const setDesc = (id: string, desc: string) =>
    setDraft(d => ({ ...d, [id]: { ...d[id], desc } }));

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm?.();
  };

  if (!equipment || !operator) return null;

  return (
    <div className={cn('flex h-full flex-col overflow-hidden', className)}>
      <ChecklistProgressHeader
        equipmentCode={equipment.code}
        operatorName={operator.name}
        done={done}
        total={items.length}
      />

      {hasInapt ? (
        <ScrollArea className="flex-1 px-1.5 pt-1 pb-0.5">
          <div className="flex flex-col gap-1.5">
            {items.map(item => (
              <ChecklistItem
                key={item.id}
                label={item.label}
                icon={<span className="text-xl leading-none">{item.icon}</span>}
                critical={item.critical}
                status={draft[item.id]?.status ?? null}
                description={draft[item.id]?.desc ?? ''}
                onApto={() => setStatus(item.id, 'apto')}
                onInapto={() => setStatus(item.id, 'inapto')}
                onDescriptionChange={desc => setDesc(item.id, desc)}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div
          className="flex-1 grid gap-1.5 min-h-0 overflow-hidden px-1.5 pt-1 pb-0.5"
          style={{ gridTemplateRows: `repeat(${items.length}, 1fr)` }}
        >
          {items.map(item => (
            <ChecklistItem
              key={item.id}
              label={item.label}
              icon={<span className="text-xl leading-none">{item.icon}</span>}
              critical={item.critical}
              status={draft[item.id]?.status ?? null}
              description={draft[item.id]?.desc ?? ''}
              onApto={() => setStatus(item.id, 'apto')}
              onInapto={() => setStatus(item.id, 'inapto')}
              onDescriptionChange={desc => setDesc(item.id, desc)}
            />
          ))}
        </div>
      )}

      <div className="flex-shrink-0 border-t border-tablet-border bg-tablet-bg px-2 py-1.5">
        <Button
          onClick={handleConfirm}
          disabled={!allDone}
          className={cn(
            'w-full rounded-xl py-3 text-lg font-black uppercase tracking-wider whitespace-normal',
            allDone
              ? 'bg-petra-blue text-white shadow-2xl shadow-petra-blue/30 hover:bg-petra-blue-light'
              : 'bg-tablet-surface-3 text-tablet-text-muted cursor-not-allowed'
          )}
        >
          {allDone
            ? '✓ Confirmar Checklist e Avançar →'
            : `Avalie todos os itens · ${done} de ${items.length} concluídos`}
        </Button>
      </div>
    </div>
  );
};
