import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { ExerciseCard } from "./exercise-card";
import { RpeScale } from "./rpe-scale";
import { SetRow } from "./set-row";
import { SetStage } from "@workout-tracker/types";
import { timeFormat } from "@workout-tracker/utils";

const row = (
  stage: SetStage,
  {
    key,
    ...extra
  }: { key?: string } & Partial<ComponentProps<typeof SetRow>> = {},
): React.JSX.Element => (
  <SetRow
    key={key}
    stage={stage}
    reps={8}
    weight={60}
    rest={90}
    formatTime={timeFormat}
    {...extra}
  />
);

const meta = {
  title: "Workout/ExerciseCard",
  component: ExerciseCard,
  args: {
    name: "Back squat",
    onMoveUp: () => undefined,
    onMoveDown: () => undefined,
    onAddSet: () => undefined,
    onRemoveSet: () => undefined,
    onRemoveExercise: () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="w-[24rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExerciseCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Active: Story = {
  args: {
    isActive: true,
    isFirst: true,
    canRemoveSet: true,
    children: [
      row(SetStage.Complete, { key: "1" }),
      row(SetStage.Active, { key: "2", isActive: true }),
      row(SetStage.Idle, { key: "3" }),
    ],
  },
};
export const Completed: Story = {
  args: {
    children: [
      row(SetStage.Complete, { key: "1" }),
      row(SetStage.Complete, { key: "2" }),
      <RpeScale key="rpe" value={7} />,
    ],
  },
};
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    children: row(SetStage.Complete, { readOnly: true, isOnly: true }),
  },
};

export const SingleSet: Story = {
  args: {
    isActive: true,
    canRemoveSet: true,
    children: row(SetStage.Active, { isActive: true, isOnly: true }),
  },
};
