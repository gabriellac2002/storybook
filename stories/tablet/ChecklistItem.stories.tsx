import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { ChecklistItem } from '@/components/tablet/ChecklistItem';

const meta: Meta<typeof ChecklistItem> = {
  title: 'Tablet/ChecklistItem',
  component: ChecklistItem,
  tags: ['autodocs'],
  parameters: { backgrounds: { default: 'dark' } },
  decorators: [
    (Story) => (
      <div className="w-full max-w-lg p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Pneus e Rodas',
    critical: false,
    status: null,
    description: '',
    onApto: () => {},
    onInapto: () => {},
    onDescriptionChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Pendente: Story = {};

export const PendenteCritico: Story = {
  args: { critical: true, label: 'Freios de Serviço' },
};

export const Apto: Story = {
  args: { status: 'apto' },
};

export const Inapto: Story = {
  args: {
    status: 'inapto',
    critical: true,
    label: 'Freios de Serviço',
    description: 'Freio traseiro esquerdo com folga excessiva',
  },
};

export const Interativo: Story = {
  render: (args) => {
    const [status, setStatus] = useState<'apto' | 'inapto' | null>(null);
    const [desc, setDesc] = useState('');
    return (
      <ChecklistItem
        {...args}
        status={status}
        description={desc}
        onApto={() => setStatus('apto')}
        onInapto={() => setStatus('inapto')}
        onDescriptionChange={setDesc}
      />
    );
  },
};
