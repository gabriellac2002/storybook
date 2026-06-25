'use client';

// Demo: inicializa o store com dados de UT-01 e renderiza a TruckOpsView.
// Quando o estado vier de um backend, este seed é substituído por uma chamada de API.

import { useEffect } from 'react';
import { TruckOpsView } from '@/features/tablet/views/TruckOpsView';
import { useTabletStore } from '@/lib/store/tabletStore';

const SHIFT_START = new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString();

export default function TabletPage() {
  const seed = useTabletStore(s => s.seed);

  useEffect(() => {
    seed(
      { id: 'ut-01', code: 'UT-01', kind: 'truck', capacity: 29 },
      {
        boundEquipmentId: 'ut-01',
        operator: { id: 'op-01', name: 'João Silva', role: 'operator' },
        shiftStart: SHIFT_START,
        horimeterLabel: '4321.5h',
        truckMode: 'producao',
      },
      { slotLabel: '09:00', hourGoal: 6, dailyGoal: 60 }
    );
  }, [seed]);

  return (
    <div className="h-screen bg-tablet-bg">
      <TruckOpsView />
    </div>
  );
}
