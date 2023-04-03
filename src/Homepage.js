import "./Homepage.css";
import Navbar from "./Navbar";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Homepage = () => {
  const [line, setLine] = useState(2);
  const handleChange = (e) => {
    setLine(e.target.value);
  };
  return (
    <div className="homepage">
      <div className="middleLogo">
        <h3>Version 5.0</h3>
      </div>

      <div className="topWrapper">
        <div className="topRight">
          <h3>Thermoforming Systems, LLC</h3>
          <p>
            <a href="http://www.tslusa.biz/">www.tslusa.biz</a>
          </p>
        </div>
      </div>

      <div className="divider"></div>

      <div className="infoTabs">
        <div className="formerInfo">
          <h3>Former</h3>
          <p>SR#1358</p>
          <div className="formerInfoTabs">
            <p>Total Cycle Time</p>
            <p className="formerInfoTabNum" id="totCycleTime">
              3.51
            </p>
          </div>
          <div className="formerInfoTabs">
            <p>Cycles Per Minute</p>
            <p className="formerInfoTabNum" id="formerInfoTabs">
              17.08
            </p>
          </div>
          <div className="formerInfoTabs">
            <p>Total Cycles</p>
            <p className="formerInfoTabNum" id="formerInfoTabs">
              14672570
            </p>
          </div>
          <div className="formerInfoTabs">
            <p>Cycles This Shift</p>
            <p className="formerInfoTabNum" id="formerInfoTabs">
              13191889
            </p>
          </div>
          <div className="formerInfoTabs">
            <p>Cabinet Temp</p>
            <p className="formerInfoTabNum" id="formerInfoTabs">
              76
            </p>
          </div>
          <div className="formerInfoTabs">
            <p>Ambient Temp</p>
            <p className="formerInfoTabNum" id="formerInfoTabs">
              90
            </p>
          </div>
          <button>Version Info...</button>
        </div>
        <div className="navButtons">
          <div className="middleButtons">
            <div className="utilButtons">
              <div className="chat">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Line</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={line}
                    label="Line"
                    onChange={handleChange}
                  >
                    <MenuItem value={0}>F500</MenuItem>
                    <MenuItem value={1}>F600</MenuItem>
                    <MenuItem value={2}>F800</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
        </div>
        <div className="formerInfo">
          <h3>Trim</h3>
          <p>SR#1358</p>

          <div className="formerInfoTabs">
            <p>Cycles Per Minute</p>
            <p className="formerInfoTabNum" id="formerInfoTabs">
              17.08
            </p>
          </div>
          <div className="formerInfoTabs">
            <p>Total Cycles</p>
            <p className="formerInfoTabNum" id="formerInfoTabs">
              14672570
            </p>
          </div>
          <div className="formerInfoTabs">
            <p>Cycles This Shift</p>
            <p className="formerInfoTabNum" id="formerInfoTabs">
              13191889
            </p>
          </div>
          <div className="formerInfoTabs">
            <p>Cabinet Temp</p>
            <p className="formerInfoTabNum" id="formerInfoTabs">
              76
            </p>
          </div>
        </div>
      </div>

      <Navbar></Navbar>
    </div>
  );
};

export default Homepage;
