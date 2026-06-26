import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { HorimeterInput } from '@/components/tablet/HorimeterInput';

const meta: Meta<typeof HorimeterInput> = {
  title: 'Tablet/HorimeterInput',
  component: HorimeterInput,
  tags: ['autodocs'],
  parameters: { backgrounds: { default: 'dark' } },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    id: 'horim-principal',
    label: 'HORÍMETRO PRINCIPAL',
    lastValue: 4321.5,
    value: 4321.5,
    onChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interativo: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.lastValue);
    return (
      <HorimeterInput {...args} value={value} onChange={setValue} />
    );
  },
};
