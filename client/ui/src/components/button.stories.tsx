import type { Meta, StoryObj } from "@storybook/react-vite";
import { Play, Trophy } from "lucide-react";
import { Button } from "../index";

const meta = {
  title: "Primitives/Button",
  component: Button,
  args: { children: "Start workout", tone: "primary", variant: "solid" },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["neutral", "primary", "success", "danger"],
    },
    variant: { control: "inline-radio", options: ["solid", "ghost"] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { icon: <Play size={20} /> } };
export const Neutral: Story = { args: { tone: "neutral", children: "Start rest" } };
export const Success: Story = {
  args: { tone: "success", children: "Finish workout", icon: <Trophy size={20} /> },
};
export const Danger: Story = { args: { tone: "danger", children: "Delete workout" } };
export const Ghost: Story = {
  args: { variant: "ghost", tone: "neutral", children: "Add set" },
};
export const Disabled: Story = { args: { disabled: true } };
