import "./Former.css";
import data from "./FormerTables.json";
import FormerTables from "./FormerTables";
import { useState } from "react";
import Navbar from "./Navbar";

const Former = () => {
  const [info, setInfo] = useState(data);

  function updateData(id) {
    const refreshedData = info.map((data) => {
      if (id === data.id) {
        console.log(data);
        return { ...data };
      }
      return info;
    });
    setInfo(refreshedData);
  }

  return (
    <div className="former">
      <div className="leftColumn">
        {info.slice(0, 4).map((info) => {
          return (
            <FormerTables
              key={info.id}
              id={info.id}
              status={info.status}
              header={info.header}
              tab={info.tab}
              tabValue={info.tabValue}
              desc={info.desc}
              intTabs={info.intTabs}
              intVals={info.intVals}
              intStatus={info.intStatus}
              updateData={updateData}
            />
          );
        })}

        <div className="settings">
          <table>
            <thead>
              <tr>
                <th colSpan={2}>Forming/Cycle Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Allowable Additional Form Time</td>
                <td>0.00</td>
              </tr>
              <tr>
                <td>Total Cycle Time</td>
                <td>3.51</td>
              </tr>
              <tr>
                <td>Cycles Per Minute</td>
                <td>17.08</td>
              </tr>
              <tr>
                <td>Feet Per Minute</td>
                <td>80.90</td>
              </tr>
              <tr>
                <td>Cycles This Shift</td>
                <td>13191889</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="middleColumn">
        {info.slice(4, 8).map((info) => {
          return (
            <FormerTables
              key={info.id}
              id={info.id}
              status={info.status}
              header={info.header}
              tab={info.tab}
              tabValue={info.tabValue}
              desc={info.desc}
            />
          );
        })}
      </div>

      <div className="rightColumn">
        {info.slice(8, 13).map((info) => {
          return (
            <FormerTables
              key={info.id}
              id={info.id}
              header={info.header}
              tab={info.tab}
              tabValue={info.tabValue}
              desc={info.desc}
            />
          );
        })}
      </div>
      <Navbar></Navbar>
    </div>
  );
};

export default Former;
