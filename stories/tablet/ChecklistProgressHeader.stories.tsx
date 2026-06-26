import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChecklistProgressHeader } from '@/components/tablet/ChecklistProgressHeader';

const meta: Meta<typeof ChecklistProgressHeader> = {
  title: 'Tablet/ChecklistProgressHeader',
  component: ChecklistProgressHeader,
  tags: ['autodocs'],
  parameters: { backgrounds: { default: 'dark' } },
  args: {
    equipmentCode: 'UT-01',
    operatorName: 'João Silva',
    done: 5,
    total: 9,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const EmProgresso: Story = {};

export const Completo: Story = {
  args: { done: 9, total: 9 },
};

export const Inicio: Story = {
  args: { done: 0, total: 9 },
};
