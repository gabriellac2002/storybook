import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FleetCard } from '@/components/management/FleetCard';

const meta: Meta<typeof FleetCard> = {
  title: 'Management/FleetCard',
  component: FleetCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-48 p-2">
        <Story />
      </div>
    ),
  ],
  args: {
    code: 'UT-01',
    category: 'Caminhão Basculante',
    kind: 'truck',
    status: 'operating',
    since: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
    operator: 'João Silva',
    tripsToday: 12,
    tonsToday: 348,
    onClick: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Operando: Story = {};

export const Parado: Story = {
  args: {
    status: 'stopped',
    since: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
  },
};

export const Manutencao: Story = {
  args: {
    status: 'maintenance',
    since: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    tripsToday: 0,
    tonsToday: 0,
  },
};

export const Oficina: Story = {
  args: {
    status: 'oficina',
    since: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    operator: null,
    tripsToday: 0,
    tonsToday: 0,
  },
};

export const Desligado: Story = {
  args: { status: 'off', operator: null, tripsToday: 0, tonsToday: 0 },
};

export const Pipa: Story = {
  args: {
    code: 'PA-01',
    category: 'Caminhão Pipa',
    kind: 'water',
    isPipa: true,
    status: 'operating',
    tripsToday: 5,
    litersToday: 50000,
    tonsToday: 0,
  },
};

export const SemOperador: Story = {
  args: { operator: null },
};
