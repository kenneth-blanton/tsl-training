import "./Navbar.css";
import Clock from "react-live-clock";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPrint } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  let today = new Date().toLocaleDateString();

  return (
    <div className="Navbar">
      <div className="major">
        <div className="routeWrapper">
          <Link to="/home">
            <div className="route">
              <h3>Main</h3>
            </div>
          </Link>
          <Link to="/former">
            <div className="route Former">
              <h3>Former</h3>
              <div className="status"></div>
            </div>
          </Link>
          <Link to="/former" disabled>
            <div className="route heat">
              <h3>Heat</h3>
              <div className="status"></div>
            </div>
          </Link>
          <Link to="/trimpress">
            <div className="route trim">
              <div className="condition">Stopped</div>
              <h3>Trim</h3>
              <div className="status"></div>
            </div>
          </Link>
          <Link to="/former">
            <div className="route">
              <h3>Maintenance</h3>
            </div>
          </Link>
        </div>

        <div className="relays">
          <div className="formStatus">
            <div className="status"></div>
            <span className="formsafe">Form - Safety Relay</span>
          </div>
          <div className="tpStatus">
            <div className="status"></div>
            <span className="tpsafe">TP - Safety Relay</span>
          </div>
        </div>

        <div className="brakeIras">
          <div className="brakeStatus">
            <div className="status"></div>
            <span className="brakes">Brakes OK to Run</span>
          </div>
          <div className="irasStatus">
            <div className="status"></div>
            <span className="iras">Iras Not @ Target Position</span>
          </div>
        </div>
      </div>

      <div className="sidebar">
        <div className="clock">
          <Clock format={"HH:mm:ss"} ticking={true} />
          <span>&emsp;{today}</span>
        </div>

        <div className="help-print">
          <Link to="/tsl-training/" className="help">
            Help
            <FontAwesomeIcon className="book" icon={faBook} />
          </Link>

          <div className="print">
            Print
            <FontAwesomeIcon className="printer" icon={faPrint} />
          </div>
        </div>

        <fieldset>
          <legend>Recipe</legend>
          9X12 18CPMJL_9X12 YCNB12X95203 24MIL
          <span className="fieldTime">&emsp;{today}</span>
          &emsp;
          <Clock className="fieldTime" format={"hh:mm:ssa"} ticking={true} />
        </fieldset>
      </div>
    </div>
  );
};

export default Navbar;
