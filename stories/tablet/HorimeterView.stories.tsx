import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useTabletStore } from '@/lib/store/tabletStore';
import { HorimeterView } from '@/features/tablet/views/HorimeterView';

const SESSION_BASE = { operator: { id: 'u2', name: 'Carlos Pereira', role: 'operator' as const }, shiftStart: new Date().toISOString(), checklistDone: true };
const GOALS = { slotLabel: '08:00', hourGoal: 6, dailyGoal: 60 };

const EQ_TRUCK      = { id: 'UT-09',   code: 'UT-09',   name: 'Mercedes-Benz Actros 4844', category: 'Caminhões de Produção', kind: 'truck',            capacity: 33,   lastHorimeter: 11247.5 };
const EQ_BRITAGEM   = { id: 'UB-02',   code: 'UB-02',   name: 'Britador Primário',         category: 'Britagem',              kind: 'britagem-primaria',                lastHorimeters: { alimentador: 18200.0, britador: 18190.5 } };
const EQ_REBRITAGEM = { id: 'URB-01',  code: 'URB-01',  name: 'Linha de Rebritagem',        category: 'Britagem',              kind: 'rebritagem',                       lastHorimeters: { alimSec: 8200, britSec: 8195, alimTer: 7800, britTer: 7790, alimQua: 6500, britQua: 6490, peneira1: 8100, peneira2: 8050, peneira3: 7900 } };

const meta: Meta<typeof HorimeterView> = {
  title: 'Tablet/Views/HorimeterView',
  component: HorimeterView,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', backgrounds: { default: 'dark' } },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Caminhao: Story = {
  decorators: [
    (Story) => {
      useTabletStore.getState().seed(EQ_TRUCK, { ...SESSION_BASE, boundEquipmentId: 'UT-09' }, GOALS);
      return <div style={{ height: '100vh' }}><Story /></div>;
    },
  ],
};

export const BritagemPrimaria: Story = {
  decorators: [
    (Story) => {
      useTabletStore.getState().seed(EQ_BRITAGEM, { ...SESSION_BASE, boundEquipmentId: 'UB-02' }, GOALS);
      return <div style={{ height: '100vh' }}><Story /></div>;
    },
  ],
};

export const Rebritagem: Story = {
  decorators: [
    (Story) => {
      useTabletStore.getState().seed(EQ_REBRITAGEM, { ...SESSION_BASE, boundEquipmentId: 'URB-01' }, GOALS);
      return <div style={{ height: '100vh' }}><Story /></div>;
    },
  ],
};
