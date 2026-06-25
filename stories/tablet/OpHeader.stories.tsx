import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { OpHeader } from '../../components/tablet/OpHeader';

const meta = {
  title: 'Tablet/OpHeader',
  component: OpHeader,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    equipmentCode: 'UT-01',
    equipmentIcon: 'truck',
    operatorName: 'João Silva',
    isOperating: true,
    onLogout: fn(),
  },
} satisfies Meta<typeof OpHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OperandoTruck: Story = {};

export const ParadaTruck: Story = {
  args: { isOperating: false },
};

export const Loader: Story = {
  args: {
    equipmentCode: 'UC-02',
    equipmentIcon: 'loader',
    operatorName: 'Maria Souza',
    isOperating: true,
  },
};

export const Excavator: Story = {
  args: {
    equipmentCode: 'ES-01',
    equipmentIcon: 'excavator',
    operatorName: 'Carlos Oliveira',
    isOperating: true,
  },
};

export const NomeLongo: Story = {
  args: {
    equipmentCode: 'UT-99',
    operatorName: 'Francisco das Neves Nascimento',
    isOperating: false,
  },
};
