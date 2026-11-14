import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInput } from "../index";

const meta = {
  title: "Primitives/TextInput",
  component: TextInput,
  args: { label: "Workout name", placeholder: "Push day" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithError: Story = {
  args: { defaultValue: "", error: "Give the workout a name to save it." },
};
export const Disabled: Story = { args: { disabled: true } };
