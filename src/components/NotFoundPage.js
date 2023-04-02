import { useLocation } from "react-router";
import logo from "../images/PactiveVideoPoster.png";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  const location = useLocation();
  return (
    <>
      <div className="NotFoundPage">
        <div className="appBar">
          <div className="logo">
            <a
              href="https://pactivevergreen.com/"
              target="_blank"
              rel="noreferrer"
            >
              <img src={logo} alt="logo" />
            </a>
          </div>
          <div className="links">
            <Link to="/">Home</Link>
          </div>
        </div>
        <h1>Oh no! There is no page here at: {location.pathname}.</h1>
      </div>
    </>
  );
};

export default NotFoundPage;
