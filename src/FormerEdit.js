import { useState } from "react";

const FormerEdit = (props) => {
  return (
    <>
      <div className="internalSettings">
        <table>
          <thead>
            <tr>
              <th colSpan={2} style={{ textAlign: "center" }}>
                {props.header}
              </th>
            </tr>
          </thead>
          <tbody>
            {props.intTabs.map((info, i) => {
              return (
                <tr>
                  <td>{info}</td>
                  <td>{props.intVals[i]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FormerEdit;
