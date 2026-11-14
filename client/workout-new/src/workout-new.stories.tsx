import type { Meta, StoryObj } from "@storybook/react-vite";
import { openDB } from "idb";
import { SetStage } from "@workout-tracker/types";
import { App } from "./App";

const LOG_KEY = 9001;

// The screen reads IndexedDB, which Storybook's browser has: seed one past workout
// and open it the way "Do it again" does (`fromLogs`). The screen's own components
// have their stories in the ui library.
async function seedLog() {
  const db = await openDB("workoutTracker", 1, {
    upgrade(db) {
      db.createObjectStore("workouts", { keyPath: "id" });
      db.createObjectStore("logs", { autoIncrement: true });
    },
  });
  await db.put(
    "logs",
    {
      id: "push-day",
      name: "Push day",
      date: new Date(),
      duration: 2712,
      isComplete: true,
      activeSetId: null,
      activeExerciseId: null,
      exercises: [
        {
          id: "bench",
          name: "Bench press",
          rpe: 8,
          sets: [1, 2, 3].map((n) => ({
            id: `bench-${n}`,
            stage: SetStage.Complete,
            defaultReps: 8,
            defaultWeight: 60 + n * 5,
            defaultRestTime: 90,
          })),
        },
      ],
    },
    LOG_KEY,
  );
  db.close();
}

const meta = {
  title: "New/WorkoutNew",
  component: App,
  parameters: { layout: "fullscreen" },
  loaders: [seedLog],
} satisfies Meta<typeof App>;
export default meta;
type Story = StoryObj<typeof meta>;

export const RepeatPastWorkout: Story = {
  args: { id: String(LOG_KEY), fromLogs: true },
};
