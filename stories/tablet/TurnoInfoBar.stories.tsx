import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TurnoInfoBar } from '../../components/tablet/TurnoInfoBar';

const now = new Date();
const shiftStart = new Date(now.getTime() - 2 * 60 * 60 * 1000 - 25 * 60 * 1000).toISOString(); // 2h25 atrás

const meta = {
  title: 'Tablet/TurnoInfoBar',
  component: TurnoInfoBar,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    shiftStart,
    horimeterLabel: '4321.5h',
    stopCount: 2,
    stopDurationMs: 18 * 60 * 1000, // 18 min parado
  },
} satisfies Meta<typeof TurnoInfoBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SemParadas: Story = {
  args: {
    stopCount: 0,
    stopDurationMs: 0,
  },
};

export const MuitasParadas: Story = {
  args: {
    stopCount: 7,
    stopDurationMs: 95 * 60 * 1000, // 1h35 parado
  },
};

export const InicioTurno: Story = {
  args: {
    shiftStart: new Date().toISOString(),
    stopCount: 0,
    stopDurationMs: 0,
  },
};

export const SemTurno: Story = {
  args: {
    shiftStart: null,
    horimeterLabel: '—',
    stopCount: 0,
    stopDurationMs: 0,
  },
};
