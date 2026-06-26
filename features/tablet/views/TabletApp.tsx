'use client';

// Referência: docs/parte_diaria_v46.html linhas 621–630 — renderTablet()
// Orquestrador de fases do tablet. Lê selectTabletPhase do store e renderiza a view correta.
// É o único ponto que precisa de 'use client' — todas as views filhas herdam o contexto.

import { cn } from '@/lib/utils';
import { useTabletStore, selectTabletPhase } from '@/lib/store/tabletStore';
import { LoginView }           from './LoginView';
import { EquipmentBindingView } from './EquipmentBindingView';
import { ChecklistView }       from './ChecklistView';
import { HorimeterView }       from './HorimeterView';
import { TruckOpsView }        from './TruckOpsView';

export type TabletAppProps = {
  className?: string;
};

export const TabletApp: React.FC<TabletAppProps> = ({ className }) => {
  const phase             = useTabletStore(selectTabletPhase);
  const completeChecklist = useTabletStore(s => s.completeChecklist);
  const completeHorimeter = useTabletStore(s => s.completeHorimeter);

  return (
    <div className={cn('h-screen bg-tablet-bg', className)}>
      {phase === 'login'       && <LoginView />}
      {phase === 'equipment'   && <EquipmentBindingView />}
      {phase === 'checklist'   && <ChecklistView  className="h-full" onConfirm={completeChecklist} />}
      {phase === 'horimeter'   && <HorimeterView  className="h-full" onConfirm={completeHorimeter} />}
      {phase === 'operational' && <TruckOpsView   className="h-full" />}
    </div>
  );
};
