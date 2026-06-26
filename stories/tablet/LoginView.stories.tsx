import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useTabletStore } from '@/lib/store/tabletStore';
import { LoginView } from '@/features/tablet/views/LoginView';

const meta: Meta<typeof LoginView> = {
  title: 'Tablet/Views/LoginView',
  component: LoginView,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', backgrounds: { default: 'dark' } },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Tablet sem equipamento vinculado — estado inicial padrão
export const SemEquipamento: Story = {
  decorators: [
    (Story) => {
      useTabletStore.setState({ equipment: null, session: useTabletStore.getState().seed as any });
      useTabletStore.getState().logout();
      return <Story />;
    },
  ],
};

// Tablet com UT-09 vinculado
export const ComEquipamento: Story = {
  decorators: [
    (Story) => {
      useTabletStore.getState().bindEquipment('UT-09');
      useTabletStore.getState().logout();
      return <Story />;
    },
  ],
};
