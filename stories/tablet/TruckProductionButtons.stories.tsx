import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useTabletStore } from '@/lib/store/tabletStore';
import { TruckProductionButtons } from '@/components/tablet/TruckProductionButtons';

const EQ = { id: 'ut-09', code: 'UT-09', name: 'Mercedes-Benz Actros 4844', category: 'Caminhões de Produção', kind: 'truck', capacity: 33, lastHorimeter: 11247.5 };
const SESSION_BASE = { operator: { id: 'u2', name: 'Carlos Pereira', role: 'operator' as const }, truckMode: 'producao' as const, checklistDone: true, initialHorimeter: 11247.5, boundEquipmentId: 'ut-09', shiftStart: new Date().toISOString() };
const GOALS = { slotLabel: '08:00', hourGoal: 6, dailyGoal: 60 };

const meta: Meta<typeof TruckProductionButtons> = {
  title: 'Tablet/TruckProductionButtons',
  component: TruckProductionButtons,
  tags: ['autodocs'],
  parameters: { backgrounds: { default: 'dark' } },
  decorators: [
    (Story) => {
      useTabletStore.getState().seed(EQ, SESSION_BASE, GOALS);
      return (
        <div style={{ height: 420, width: 340 }} className="flex">
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ComViagens: Story = {
  decorators: [
    (Story) => {
      const store = useTabletStore.getState();
      store.seed(EQ, SESSION_BASE, GOALS);
      store.registerTrip('productive');
      store.registerTrip('productive');
      store.registerTrip('productive');
      return <Story />;
    },
  ],
};

export const ParadaAtiva: Story = {
  decorators: [
    (Story) => {
      const store = useTabletStore.getState();
      store.seed(EQ, SESSION_BASE, GOALS);
      store.startStop();
      return <Story />;
    },
  ],
};
