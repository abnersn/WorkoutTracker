import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pause, Timer, Trophy } from "lucide-react";
import { ActionBar } from "./action-bar";
import { Badge } from "./badge";
import { Button } from "./button";
import { Container } from "./container";

const meta = {
  title: "Workout/ActionBar",
  component: ActionBar,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    ),
  ],
} satisfies Meta<typeof ActionBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {
  render: () => (
    <ActionBar>
      <Badge
        icon={<Timer size={20} />}
        caption="Nov 13, 2026"
        className="mr-auto"
      >
        12:48
      </Badge>
      <Button icon={<Pause size={20} />}>Start rest</Button>
      <Button tone="success" icon={<Trophy size={20} />}>
        Complete
      </Button>
    </ActionBar>
  ),
};
