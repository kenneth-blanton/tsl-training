import "./TrimPress.css";
import Navbar from "./Navbar";

const TrimPress = () => {
  return (
    <div className="trimPress">
      <div className="leftColumn">
        <p>Tables go here</p>
      </div>

      <div className="middleColumn">
        <p>Status goes here</p>
      </div>

      <div className="rightColumn">
        <p>Tables go here</p>
      </div>
      <Navbar></Navbar>
    </div>
  );
};

export default TrimPress;
