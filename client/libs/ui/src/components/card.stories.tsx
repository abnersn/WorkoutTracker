import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../index";

const meta = {
  title: "Primitives/Card",
  component: Card,
  args: { children: "Back squat" },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["neutral", "primary", "success", "danger", "highlight"],
    },
    variant: { control: "inline-radio", options: ["panel", "item"] },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Panel: Story = {};
export const Item: Story = { args: { variant: "item" } };
export const Active: Story = { args: { variant: "item", isActive: true } };
export const Primary: Story = { args: { tone: "primary" } };
export const Success: Story = { args: { tone: "success" } };
