import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyMessage } from "../index";

const meta = {
  title: "Primitives/EmptyMessage",
  component: EmptyMessage,
  args: { children: "No sets yet. Add one to start logging." },
} satisfies Meta<typeof EmptyMessage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
