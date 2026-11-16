import type { Meta, StoryObj } from "@storybook/react-vite";
import { ApolloProvider } from "@apollo/client/react";
import { createMockClient, notFound, pushDayLog } from "@workout-tracker/api";
import { App } from "./App";

// The view loads through the data hooks; a mock client answers them with one
// finished workout, and "not found" for any other id.
const client = createMockClient({
  Log: ({ id }) =>
    id === pushDayLog.id ? { data: { log: pushDayLog } } : notFound(),
  PreviousRun: () => ({ data: { previousRun: null } }),
});

const meta = {
  title: "View/WorkoutView",
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

export const FinishedWorkout: Story = { args: { id: pushDayLog.id } };
export const NotFound: Story = { args: { id: "424242424242424242424242" } };
