import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ConfirmDialog, Dialog } from "../index";

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

export const ConfirmDelete: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button tone="danger" onClick={() => setOpen(true)}>
          Delete workout
        </Button>
        <ConfirmDialog
          open={open}
          title="Delete Push day?"
          description="It leaves your workout list. Workouts you've already finished stay in History."
          confirmLabel="Delete workout"
          cancelLabel="Keep workout"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </>
    );
  },
};
