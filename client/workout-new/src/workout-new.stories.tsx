import type { Meta, StoryObj } from "@storybook/react-vite";
import { ApolloProvider } from "@apollo/client/react";
import { createMockClient, pushDayLog } from "@workout-tracker/api";
import { App } from "./App";

// The screen loads through the data hooks; a mock client answers them with
// one past workout, opened the way "Do it again" does (`fromLogs`). The
// screen's own components have their stories in the ui library.
const client = createMockClient({
  Log: () => ({ data: { log: pushDayLog } }),
});

const meta = {
  title: "New/WorkoutNew",
  component: App,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <ApolloProvider client={client}>
        <Story />
      </ApolloProvider>
    ),
  ],
} satisfies Meta<typeof App>;
export default meta;
type Story = StoryObj<typeof meta>;

export const RepeatPastWorkout: Story = {
  args: { id: pushDayLog.id, fromLogs: true },
};
