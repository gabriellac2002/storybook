import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StatusDot, equipmentStatusColor } from '../../components/petra/StatusDot';

const meta = {
  title: 'Petra/StatusDot',
  component: StatusDot,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    color: 'green',
    size: 10,
    fast: false,
  },
} satisfies Meta<typeof StatusDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Operating: Story = {
  args: { color: 'green' },
};

export const Stopped: Story = {
  args: { color: 'orange' },
};

export const Maintenance: Story = {
  args: { color: 'red' },
};

export const Offline: Story = {
  args: { color: 'gray' },
};

export const FastPulse: Story = {
  args: { color: 'red', fast: true },
  name: 'Fast (alert)',
};

export const Large: Story = {
  args: { color: 'green', size: 16 },
};

export const AllColors: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-4">
      {(['green', 'orange', 'red', 'gray', 'purple'] as const).map((color) => (
        <div key={color} className="flex flex-col items-center gap-2">
          <StatusDot color={color} size={14} />
          <span className="font-mono text-xs text-gray-400">{color}</span>
        </div>
      ))}
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="flex flex-col gap-3 p-4">
      {[
        { status: 'operating',   label: 'UT-08 — Em operação' },
        { status: 'stopped',     label: 'UC-03 — Parado (manutenção)' },
        { status: 'maintenance', label: 'UP-02 — Manutenção crítica' },
        { status: 'off',         label: 'MN-01 — Desligado' },
      ].map(({ status, label }) => (
        <div key={status} className="flex items-center gap-3 text-white">
          <StatusDot color={equipmentStatusColor(status)} />
          <span className="text-sm">{label}</span>
        </div>
      ))}
    </div>
  ),
};
