import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container, SectionHeading } from "../index";

const meta = {
  title: "Layout/Container",
  component: Container,
  parameters: { layout: "fullscreen" },
  args: { children: <SectionHeading>Workouts</SectionHeading> },
} satisfies Meta<typeof Container>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
