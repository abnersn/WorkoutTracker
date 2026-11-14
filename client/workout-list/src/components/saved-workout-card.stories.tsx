import type { Meta, StoryObj } from "@storybook/react-vite";
import { SavedWorkoutCard } from "./saved-workout-card";

const meta = {
  title: "List/SavedWorkoutCard",
  component: SavedWorkoutCard,
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
} satisfies Meta<typeof SavedWorkoutCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Saved: Story = {};
export const NeverRun: Story = { args: { meta: undefined } };
export const LongName: Story = {
  args: {
    name: "Upper body hypertrophy block, week 3, heavy singles then back-off volume",
  },
};
export const ReadOnly: Story = { args: { onRemove: undefined } };
