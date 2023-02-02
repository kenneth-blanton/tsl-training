import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const FormerTablesDetails = (props) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        style={{ backgroundColor: "lightgray", cursor: "pointer" }}
        onClick={handleClickOpen}
      >
        <span>Details</span>
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.header}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Content Goes Here
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormerTablesDetails;
