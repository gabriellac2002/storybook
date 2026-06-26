import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TruckCountersPanel } from '@/components/tablet/TruckCountersPanel';

const meta: Meta<typeof TruckCountersPanel> = {
  title: 'Tablet/TruckCountersPanel',
  component: TruckCountersPanel,
  tags: ['autodocs'],
  parameters: { backgrounds: { default: 'dark' } },
  decorators: [
    (Story) => (
      <div style={{ height: 320, width: 200 }} className="flex">
        <Story />
      </div>
    ),
  ],
  args: {
    slotLabel: '08:00',
    hourTrips: 4,
    hourGoal: 6,
    productiveTrips: 28,
    dailyGoal: 60,
    totalTons: 812,
    sterileTrips: 3,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MetaBatida: Story = {
  args: { hourTrips: 7, hourGoal: 6, productiveTrips: 62, dailyGoal: 60 },
};

export const AbaixoDaMeta: Story = {
  args: { hourTrips: 1, hourGoal: 6, productiveTrips: 10, dailyGoal: 60 },
};

export const Zerado: Story = {
  args: { hourTrips: 0, hourGoal: 6, productiveTrips: 0, dailyGoal: 60, totalTons: 0, sterileTrips: 0 },
};
