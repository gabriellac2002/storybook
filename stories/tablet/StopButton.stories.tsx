import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { StopButton } from '../../components/tablet/StopButton';

const activeStartTs = new Date(Date.now() - 12 * 60 * 1000).toISOString(); // 12 min atrás

const meta = {
  title: 'Tablet/StopButton',
  component: StopButton,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
    layout: 'centered',
  },
  args: {
    isActive: false,
    startTs: null,
    onClick: fn(),
  },
} satisfies Meta<typeof StopButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inativo: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 180, height: 140 }} className="flex">
        <Story />
      </div>
    ),
  ],
};

export const Ativo: Story = {
  args: {
    isActive: true,
    startTs: activeStartTs,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 180, height: 140 }} className="flex">
        <Story />
      </div>
    ),
  ],
};
