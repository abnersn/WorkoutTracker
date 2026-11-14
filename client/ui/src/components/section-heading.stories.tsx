import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionHeading } from "../index";

const meta = {
  title: "Primitives/SectionHeading",
  component: SectionHeading,
  args: { children: "Workouts" },
} satisfies Meta<typeof SectionHeading>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const History: Story = {
  args: { tone: "primary", children: "History" },
};
