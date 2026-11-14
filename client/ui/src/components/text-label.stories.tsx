import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextLabel } from "../index";

const meta = {
  title: "Primitives/TextLabel",
  component: TextLabel,
  args: { children: "Reps", className: "text-indigo-800" },
} satisfies Meta<typeof TextLabel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { small: true } };
