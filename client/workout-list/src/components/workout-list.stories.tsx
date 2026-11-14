import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkoutList } from "./workout-list";

const day = 24 * 3600 * 1000;

const meta = {
  title: "List/WorkoutList",
  component: WorkoutList,
  parameters: { layout: "padded" },
  args: {
    workouts: [
      { id: "1", name: "Push day", lastRun: new Date(Date.now() - 3 * day) },
      { id: "2", name: "Pull day" },
    ],
    onAdd: () => undefined,
    onRemove: () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[28rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WorkoutList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { workouts: [] } };
