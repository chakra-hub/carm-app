import * as React from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import Add from "@mui/icons-material/Add";

export default function NewWorkspace({
  onWorkspaceAddOrDelete,
  allWorkspaces,
  setCurrentWorkSpaceId,
  addTodos,
}) {
  const [open, setOpen] = React.useState(false);
  const [newWorkspace, setNewWorkspace] = React.useState("");
  return (
    <React.Fragment>
      <Add onClick={() => setOpen(true)} style={{ cursor: "pointer" }} />
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Create new workspace</DialogTitle>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (newWorkspace !== "") {
                onWorkspaceAddOrDelete([...allWorkspaces, newWorkspace]);
                setCurrentWorkSpaceId([...allWorkspaces]?.length);
                setNewWorkspace("");
              }
              setOpen(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  autoFocus
                  required
                  value={newWorkspace}
                  onChange={(e) => {
                    setNewWorkspace(e.target.value);
                  }}
                />
              </FormControl>
              <Button type="submit">Add</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
