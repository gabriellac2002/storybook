import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useTabletStore } from '@/lib/store/tabletStore';
import { EquipmentBindingView } from '@/features/tablet/views/EquipmentBindingView';

const meta: Meta<typeof EquipmentBindingView> = {
  title: 'Tablet/Views/EquipmentBindingView',
  component: EquipmentBindingView,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', backgrounds: { default: 'dark' } },
  decorators: [
    (Story) => {
      // Admin logado sem equipamento vinculado
      useTabletStore.setState(s => ({
        equipment: null,
        session: {
          ...s.session,
          operator: { id: 'u1', name: 'João Silva', role: 'admin' },
          boundEquipmentId: null,
          adminNeedsBinding: true,
        },
      }));
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
