import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SetField } from "./set-field";
import { Stepper } from "./stepper";

const meta = {
  title: "Workout/Stepper",
  component: Stepper,
  args: {
    label: "reps",
    step: 1,
    onDecrement: () => undefined,
    onIncrement: () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="w-28">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AtMinimum: Story = { args: { disableDecrement: true } };
export const WithField: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(8);
    return (
      <div className="flex flex-col gap-2">
        <SetField label="Reps" value={value} onChange={setValue} />
        <Stepper
          {...args}
          disableDecrement={value <= 0}
          onDecrement={() => setValue(value - 1)}
          onIncrement={() => setValue(value + 1)}
        />
      </div>
    );
  },
};
export const Weight: Story = { args: { label: "weight", step: 5 } };
export const Seconds: Story = { args: { label: "rest", step: 15, unit: "s" } };
