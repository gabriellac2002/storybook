import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { TabletButton } from '../../components/tablet/TabletButton';

const meta = {
  title: 'Tablet/TabletButton',
  component: TabletButton,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    label: 'VIAGEM PRODUTIVA',
    onClick: fn(),
  },
} satisfies Meta<typeof TabletButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
  args: { label: 'INICIAR TURNO', variant: 'primary', icon: 'flag', size: 'lg' },
};

export const Success: Story = {
  args: { label: 'VIAGEM PRODUTIVA', variant: 'success', icon: 'truck', size: 'lg' },
};

export const Danger: Story = {
  args: { label: 'PARADA', variant: 'danger', icon: 'pause', size: 'lg' },
};

export const Warning: Story = {
  args: { label: 'ALERTA', variant: 'warning', icon: 'warning', size: 'lg' },
};

export const WithSublabel: Story = {
  args: {
    label: 'VIAGEM PRODUTIVA',
    sublabel: '14 viagens hoje',
    variant: 'success',
    icon: 'truck',
    size: 'xl',
  },
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3 w-64 p-4">
      <TabletButton {...args} size="md" label="Tamanho MD (80px)" />
      <TabletButton {...args} size="lg" label="Tamanho LG (110px)" />
      <TabletButton {...args} size="xl" label="Tamanho XL (140px)" />
    </div>
  ),
  args: { variant: 'primary', icon: 'truck', onClick: fn() },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3 w-64 p-4">
      <TabletButton {...args} variant="primary"   label="Primary"   icon="flag"    />
      <TabletButton {...args} variant="success"   label="Success"   icon="truck"   />
      <TabletButton {...args} variant="danger"    label="Danger"    icon="pause"   />
      <TabletButton {...args} variant="warning"   label="Warning"   icon="warning" />
      <TabletButton {...args} variant="secondary" label="Secondary" icon="note"    />
    </div>
  ),
  args: { size: 'lg', onClick: fn() },
};

export const Disabled: Story = {
  args: {
    label: 'INDISPONÍVEL',
    variant: 'success',
    icon: 'truck',
    disabled: true,
    size: 'lg',
  },
};
