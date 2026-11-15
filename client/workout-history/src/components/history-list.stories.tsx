import type { Meta, StoryObj } from "@storybook/react-vite";
import { HistoryList } from "./history-list";

const day = 24 * 3600 * 1000;
const entries = [
  { id: "1", name: "Push day", date: new Date(Date.now() - 3 * day) },
  { id: "2", name: "Pull day", date: new Date(Date.now() - 5 * day) },
  { id: "3", name: "Legs", date: new Date(Date.now() - day) },
];

const meta = {
  title: "History/HistoryList",
  component: HistoryList,
  parameters: { layout: "padded" },
  args: { entries, onRemove: () => undefined },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[28rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HistoryList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { entries: [] } };
export const LongName: Story = {
  args: {
    entries: [
      {
        id: "9",
        name: "Upper body hypertrophy block, week 3, heavy singles then back-off volume",
        date: new Date(),
      },
    ],
  },
};
