import { Button } from ".";
import type { Meta, StoryObj } from "@storybook/nextjs";

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Texto do botão",
    variant: "default",
    size: "lg",
  },
};

export const Danger: Story = {
  args: {
    children: "Texto do botão",
    variant: "danger",
    size: "lg",
  },
};

export const Ghost: Story = {
  args: {
    children: "Texto do botão",
    variant: "ghost",
    size: "lg",
  },
};
