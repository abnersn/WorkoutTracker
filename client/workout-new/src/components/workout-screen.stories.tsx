import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "@workout-tracker/ui";
import { SetStage, type Workout } from "@workout-tracker/types";
import { WorkoutScreen } from "./workout-screen";

const sets = (stage: SetStage, id: string) =>
  [1, 2, 3].map((n) => ({
    id: `${id}-${n}`,
    stage,
    defaultReps: 8,
    defaultWeight: 60,
    defaultRestTime: 90,
  }));

const workout = (overrides: Partial<Workout> = {}): Workout => ({
  id: "push-day",
  name: "Push day",
  date: new Date(),
  duration: 0,
  isComplete: false,
  activeSetId: null,
  activeExerciseId: null,
  exercises: [
    {
      id: "bench",
      name: "Bench press",
      sets: sets(SetStage.Idle, "bench"),
    },
    {
      id: "squat",
      name: "Back squat",
      sets: sets(SetStage.Idle, "squat").slice(0, 1),
    },
  ],
  ...overrides,
});

const meta = {
  title: "Workout/WorkoutScreen",
  component: WorkoutScreen,
  parameters: { layout: "fullscreen" },
  args: {
    workout: workout(),
    onFinish: () => undefined,
    onSaveTemplate: () => undefined,
  },
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    ),
  ],
} satisfies Meta<typeof WorkoutScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const New: Story = {};
export const NoExercises: Story = {
  args: { workout: workout({ exercises: [] }) },
};
export const Finished: Story = {
  args: {
    mode: "view",
    reuseHref: "/workouts/new?id=1&fromLogs=true",
    workout: workout({
      isComplete: true,
      duration: 2712,
      exercises: [
        {
          id: "bench",
          name: "Bench press",
          rpe: 8,
          sets: sets(SetStage.Complete, "bench"),
        },
      ],
    }),
  },
};
