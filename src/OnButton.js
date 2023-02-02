import { useState } from "react";

const OnButton = (props) => {
  const [status, setStatus] = useState(props.status);

  if (props.id < 9) {
    return (
      <button
        style={
          status
            ? { backgroundColor: "rgb(0,225,0)", color: "white" }
            : { backgroundColor: "yellow", color: "black" }
        }
        className="onOff"
        onClick={() => {
          setStatus(!status);
        }}
      >
        {status ? <span>ON</span> : <span>OFF</span>}
      </button>
    );
  }
};

export default OnButton;
