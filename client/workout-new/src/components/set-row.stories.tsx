import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SetRow } from "./set-row";
import { Button } from "@workout-tracker/ui";
import { SetStage } from "@workout-tracker/types";
import { timeFormat } from "@workout-tracker/utils";

const meta = {
  title: "Workout/SetRow",
  component: SetRow,
  args: {
    stage: SetStage.Idle,
    reps: 8,
    weight: 60,
    rest: 90,
    formatTime: timeFormat,
  },
  argTypes: {
    stage: { control: "inline-radio", options: Object.values(SetStage) },
  },
  decorators: [
    (Story) => (
      <div className="w-[22rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SetRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {};
export const Active: Story = {
  args: { stage: SetStage.Active, isActive: true },
};
export const Resting: Story = {
  args: { stage: SetStage.Resting, isActive: true, rest: 42 },
};
export const RestOverrun: Story = {
  args: { stage: SetStage.Resting, isActive: true, rest: -15 },
};
export const Complete: Story = { args: { stage: SetStage.Complete } };
export const Cardio: Story = {
  args: {
    exerciseType: "cardio",
    stage: SetStage.Active,
    isActive: true,
    duration: 600,
    reps: 1,
  },
};
export const ReadOnly: Story = {
  args: { stage: SetStage.Complete, readOnly: true },
};

// What happens next in a set's life, named for the lifter.
const nextStep: Record<SetStage, { label: string; stage: SetStage }> = {
  [SetStage.Idle]: { label: "Start set", stage: SetStage.Active },
  [SetStage.Active]: { label: "Start rest", stage: SetStage.Resting },
  [SetStage.Resting]: { label: "End rest", stage: SetStage.Complete },
  [SetStage.Complete]: { label: "Start over", stage: SetStage.Idle },
};

/** Step a value to see it tick; end the rest to see "Done" land. */
export const Interactive: Story = {
  render: function Render(args) {
    const [stage, setStage] = useState(SetStage.Active);
    const [values, setValues] = useState({ reps: 8, weight: 60, rest: 90 });
    const next = nextStep[stage];
    return (
      <div className="flex flex-col gap-inset">
        <SetRow
          {...args}
          {...values}
          stage={stage}
          isActive={stage !== SetStage.Complete}
          isOnly
          onChange={(field, value) =>
            setValues((v) => ({ ...v, [field]: value }))
          }
        />
        <Button
          tone={stage === SetStage.Resting ? "success" : "primary"}
          onClick={() => setStage(next.stage)}
        >
          {next.label}
        </Button>
      </div>
    );
  },
};
