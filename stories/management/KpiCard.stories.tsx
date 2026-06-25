import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { KpiCard } from '../../components/management/KpiCard';

const meta = {
  title: 'Management/KpiCard',
  component: KpiCard,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'light' },
    layout: 'centered',
  },
  args: {
    label: 'Toneladas Hoje',
    value: '1.248',
    unit: 't',
  },
} satisfies Meta<typeof KpiCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    label: 'Viagens',
    value: 42,
    icon: 'truck',
    color: 'blue',
  },
};

export const WithTrend: Story = {
  args: {
    label: 'Produção',
    value: '1.248',
    unit: 't',
    icon: 'rock',
    trend: 'up',
    trendValue: '+12% vs ontem',
    color: 'green',
  },
};

export const Alert: Story = {
  args: {
    label: 'Alertas Abertos',
    value: 3,
    icon: 'warning',
    color: 'red',
    trend: 'up',
    trendValue: '+2 nas últimas 2h',
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4 p-4 w-[900px]">
      <KpiCard label="Produção"      value="1.248" unit="t"   icon="rock"    color="blue"   trend="up"      trendValue="+12% vs meta" />
      <KpiCard label="Viagens"       value={42}              icon="truck"   color="green"  trend="neutral" trendValue="meta: 45" />
      <KpiCard label="Equipamentos"  value="11/14"           icon="gauge"   color="orange" />
      <KpiCard label="Alertas"       value={3}               icon="warning" color="red"    trend="down"    trendValue="-1 vs ontem" />
    </div>
  ),
};
