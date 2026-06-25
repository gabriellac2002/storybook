import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PetraIcon, ICON_PATHS, IconName } from '../../components/petra/PetraIcon';

const meta = {
  title: 'Petra/PetraIcon',
  component: PetraIcon,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    name: 'truck',
    size: 24,
  },
} satisfies Meta<typeof PetraIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: { name: 'rock', size: 48 },
};

export const Colored: Story = {
  args: { name: 'warning', size: 32, className: 'text-petra-yellow' },
};

export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-8 gap-4 p-4">
      {(Object.keys(ICON_PATHS) as IconName[]).map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-1 text-white"
        >
          <PetraIcon name={name} size={28} />
          <span className="text-center font-mono text-[9px] text-gray-400 leading-tight">
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const EquipmentIcons: Story = {
  render: () => (
    <div className="flex gap-6 p-4">
      {(['truck', 'loader', 'excavator', 'drill', 'crusher', 'rebritagem', 'grader', 'water', 'wrench'] as IconName[]).map((name) => (
        <div key={name} className="flex flex-col items-center gap-2 text-white">
          <PetraIcon name={name} size={36} className="text-petra-yellow" />
          <span className="font-mono text-xs text-gray-400">{name}</span>
        </div>
      ))}
    </div>
  ),
};
