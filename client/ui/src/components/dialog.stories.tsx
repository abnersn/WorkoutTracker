import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Dialog } from "../index";

const meta = {
  title: "Primitives/Dialog",
  component: Dialog,
  args: { open: false, title: "Not saved yet", onClose: () => undefined },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Show dialog</Button>
        <Dialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          actions={<Button onClick={() => setOpen(false)}>Got it</Button>}
        >
          Your sets are kept in this browser until you save.
        </Dialog>
      </>
    );
  },
};
