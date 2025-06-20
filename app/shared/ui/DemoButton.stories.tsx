import type { Meta, StoryObj } from '@storybook/react';
import { DemoButton } from './DemoButton';

const meta: Meta<typeof DemoButton> = {
  title: 'Shared/DemoButton',
  component: DemoButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A functional component following FSD architecture.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the component',
    },
    children: {
      control: 'text',
      description: 'Content to render inside the component',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is the DemoButton component content.',
  },
};

export const WithCustomContent: Story = {
  args: {
    children: (
      <div>
        <h3>Custom Content</h3>
        <p>This shows how the component looks with custom children.</p>
      </div>
    ),
  },
};

export const WithCustomClassName: Story = {
  args: {
    children: 'Component with custom styling',
    className: 'border',
  },
};
