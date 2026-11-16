import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddItemForm } from "../index";

const meta = {
  title: "Primitives/AddItemForm",
  component: AddItemForm,
  args: {
    label: "Add workout",
    placeholder: "Workout name",
    onSubmit: () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AddItemForm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Workout: Story = {};
export const Exercise: Story = {
  args: { label: "Add exercise", placeholder: "Exercise name" },
};
