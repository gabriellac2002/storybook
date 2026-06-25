'use client';

// Demo: tela operacional do caminhão com dados estáticos.
// Página client porque passa handlers para a view — substituir por store quando implementado.

import { TruckOpsView } from '@/features/tablet/views/TruckOpsView';

const SHIFT_START = new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString();

export default function TabletPage() {
  return (
    <div className="h-screen bg-tablet-bg">
      <TruckOpsView
        equipmentCode="UT-01"
        equipmentIcon="truck"
        operatorName="João Silva"
        shiftStart={SHIFT_START}
        horimeterLabel="4321.5h"
        stopCount={2}
        stopDurationMs={18 * 60 * 1000}
        activeStop={null}
        productiveTrips={23}
        sterileTrips={2}
        totalTons={667}
        dailyGoal={60}
        slotLabel="09:00"
        hourTrips={4}
        hourGoal={6}
        lastTrip={{ subtype: 'productive', timeLabel: '09:42' }}
        isDemais={false}
        onRegisterProductive={() => {}}
        onRegisterSterile={() => {}}
        onCancelLastTrip={() => {}}
        onStopPress={() => {}}
        onStockIn={() => {}}
        onMaintenanceAlert={() => {}}
        onProductionAlert={() => {}}
        onObservation={() => {}}
        onEndShift={() => {}}
        onLogout={() => {}}
        onChangeTruckMode={() => {}}
      />
    </div>
  );
}
