import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { useTabletStore } from '@/lib/store/tabletStore';
import { OpControlsColumn } from '@/components/tablet/OpControlsColumn';

const EQ = { id: 'ut-09', code: 'UT-09', name: 'Mercedes-Benz Actros 4844', category: 'Caminhões de Produção', kind: 'truck', capacity: 33, lastHorimeter: 11247.5 };
const SESSION_BASE = { operator: { id: 'u2', name: 'Carlos Pereira', role: 'operator' as const }, checklistDone: true, initialHorimeter: 11247.5, boundEquipmentId: 'ut-09', shiftStart: new Date().toISOString() };
const GOALS = { slotLabel: '08:00', hourGoal: 6, dailyGoal: 60 };

const meta: Meta<typeof OpControlsColumn> = {
  title: 'Tablet/OpControlsColumn',
  component: OpControlsColumn,
  tags: ['autodocs'],
  parameters: { backgrounds: { default: 'dark' } },
  args: { onStockIn: fn() },
  decorators: [
    (Story) => {
      useTabletStore.getState().seed(EQ, SESSION_BASE, GOALS);
      return (
        <div style={{ height: 320, width: 200 }} className="flex">
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SemParada: Story = {};

export const ComParada: Story = {
  decorators: [
    (Story) => {
      useTabletStore.getState().seed(EQ, SESSION_BASE, GOALS);
      useTabletStore.getState().startStop();
      return <Story />;
    },
  ],
};
