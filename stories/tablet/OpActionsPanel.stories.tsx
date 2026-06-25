import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { OpActionsPanel } from '../../components/tablet/OpActionsPanel';

const meta = {
  title: 'Tablet/OpActionsPanel',
  component: OpActionsPanel,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    onMaintenanceAlert: fn(),
    onProductionAlert: fn(),
    onObservation: fn(),
    onEndShift: fn(),
  },
} satisfies Meta<typeof OpActionsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ComAltura: Story = {
  decorators: [
    (Story) => (
      <div style={{ height: 280 }} className="flex">
        <Story />
      </div>
    ),
  ],
};
