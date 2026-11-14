import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RpeScale } from "../index";

const meta = {
  title: "Workout/RpeScale",
  component: RpeScale,
  args: { value: 5 },
  decorators: [
    (Story) => (
      <div className="w-[22rem]">
        <Story />
      </div>
    ),
  ],
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <RpeScale {...args} value={value} onChange={setValue} />;
  },
} satisfies Meta<typeof RpeScale>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Expanded: Story = { args: { value: 8, defaultExpanded: true } };
export const MaxEffort: Story = { args: { value: 10 } };
export const ReadOnly: Story = { args: { value: 7, readOnly: true } };
