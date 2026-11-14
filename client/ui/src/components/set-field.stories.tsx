import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SetField } from "./set-field";
import { timeFormat } from "@workout-tracker/utils";

const meta = {
  title: "Workout/SetField",
  component: SetField,
  args: { label: "Reps", value: 8 },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["neutral", "primary", "success", "danger", "highlight"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-24">
        <Story />
      </div>
    ),
  ],
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <SetField {...args} value={value} onChange={setValue} />;
  },
} satisfies Meta<typeof SetField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Time: Story = {
  args: { label: "Rest", value: 90, format: timeFormat },
};
export const Running: Story = {
  args: { label: "Rest", value: 45, format: timeFormat, tone: "highlight" },
};
export const Overrun: Story = {
  args: { label: "Rest", value: 12, format: timeFormat, tone: "danger" },
};
export const Complete: Story = { args: { tone: "success" } };
export const ReadOnly: Story = { args: { readOnly: true } };
