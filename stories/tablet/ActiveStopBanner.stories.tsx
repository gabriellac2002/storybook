import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { ActiveStopBanner } from '../../components/tablet/ActiveStopBanner';

const recentStop = new Date(Date.now() - 8 * 60 * 1000).toISOString(); // 8 min atrás
const longStop = new Date(Date.now() - 47 * 60 * 1000).toISOString();  // 47 min atrás

const meta = {
  title: 'Tablet/ActiveStopBanner',
  component: ActiveStopBanner,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    startTs: recentStop,
    onClick: fn(),
  },
} satisfies Meta<typeof ActiveStopBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ParadaLonga: Story = {
  args: { startTs: longStop },
};
