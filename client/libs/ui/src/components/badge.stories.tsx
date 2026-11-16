import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timer } from "lucide-react";
import { Badge } from "../index";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  args: {
    children: "42:10",
    icon: <Timer size={20} />,
    caption: "Nov 13, 2026",
  },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["neutral", "primary", "success"],
    },
  },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {};
export const Finished: Story = { args: { tone: "success" } };
export const NoCaption: Story = { args: { caption: undefined } };
