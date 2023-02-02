import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import uuid from "react-uuid";
import FormerEdit from "./FormerEdit";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import Fab from "@mui/material/Fab";
import CloseIcon from "@mui/icons-material/Close";

const FormerTableStructure = (props) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const topBtm = () => {
    if (props.id === 10) {
      return (
        <div className="topBtm">
          <div className="topSec">Top</div>
          <div className="btmSec">Btm</div>
        </div>
      );
    }
  };

  return (
    <>
      {topBtm()}

      <table onClick={handleClickOpen}>
        <thead>
          <tr>
            <th colSpan={2}>{props.header}</th>
          </tr>
        </thead>
        <tbody>
          {props.tab.map((info, i) => {
            return (
              <tr key={uuid()}>
                <td>{info}</td>
                <td>{props.tabValue[i].toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Dialog fullScreen open={open} onClose={handleClose}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <Typography
              sx={{ flex: 1, textAlign: "center" }}
              variant="h5"
              component="div"
            >
              {props.header}
            </Typography>
          </Toolbar>
        </AppBar>
        <FormerEdit
          key={props.id}
          id={props.id}
          status={props.status}
          header={props.header}
          tab={props.tab}
          tabValue={props.tabValue}
          intTabs={props.intTabs}
          intVals={props.intVals}
          desc={props.desc}
          intStatus={props.intStatus}
        />
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Fab type="submit" style={{ borderRadius: 0, width: "10em" }}>
            <KeyboardReturnIcon />
            Enter
          </Fab>
          <Fab
            style={{ borderRadius: 0, width: "10em" }}
            onClick={() => {
              handleClose();
            }}
          >
            <CloseIcon />
            Close
          </Fab>
        </div>
      </Dialog>
    </>
  );
};

export default FormerTableStructure;
