import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkoutSummaryCard } from "./workout-summary-card";

const meta = {
  title: "History/WorkoutSummaryCard",
  component: WorkoutSummaryCard,
  args: {
    name: "Push day",
    href: "#",
    meta: "Nov 13, 2026, 6:42 PM",
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

export const Default: Story = {};
export const NoDate: Story = { args: { meta: undefined } };

export const LongName: Story = {
  args: {
    name: "Upper body hypertrophy block, week 3, heavy singles then back-off volume",
  },
};
export const ReadOnly: Story = { args: { onRemove: undefined } };
