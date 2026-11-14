import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkoutSummaryCard } from "../index";

const meta = {
  title: "Workout/WorkoutSummaryCard",
  component: WorkoutSummaryCard,
  args: {
    name: "Push day",
    href: "#",
    meta: "Last run: 3 days ago",
    onRemove: () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="w-[24rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WorkoutSummaryCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Saved: Story = {};
export const NeverRun: Story = { args: { meta: undefined } };
export const History: Story = {
  args: { tone: "primary", meta: "Nov 13, 2026, 6:42 PM" },
};
export const LongName: Story = {
  args: {
    name: "Upper body hypertrophy block, week 3, heavy singles then back-off volume",
  },
};
export const ReadOnly: Story = { args: { onRemove: undefined } };
