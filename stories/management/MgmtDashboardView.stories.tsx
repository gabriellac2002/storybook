import type { Meta, StoryObj } from '@storybook/react';
import { MgmtDashboardView } from '@/features/management/views/MgmtDashboardView';

const meta: Meta<typeof MgmtDashboardView> = {
  title: 'Management/Views/MgmtDashboardView',
  component: MgmtDashboardView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
};

export default meta;
type Story = StoryObj<typeof MgmtDashboardView>;

export const Default: Story = {};
