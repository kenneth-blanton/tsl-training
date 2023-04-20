import "../../styles/Guide.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import LineData from "../../data/LineInfo.json";
import logo from "../../images/PactiveVideoPoster.png";
import Carousel from "./Carousel";
import uuid from "react-uuid";

const Guide = () => {
  const [opt, setOpt] = useState(LineData[0]); // Holds which key in JSON data is selected
  const [sec, setSec] = useState(opt?.info);

  const handleChange = (e) => {
    const selectedId = e.target.value;
    console.log(selectedId); // SelectedId tracks the current value of the select button
    const selectedOptState = LineData.filter((d) => d.id == selectedId)[0];
    // filter sorts to find only the selectedId, puts the object in an array and gives back the one and only object in the array. Hence the [0]
    console.log(selectedOptState);
    setOpt(selectedOptState);
    // sec[0].id = 1;
  };

  const handleChange2 = (e) => {
    const selectedId = e.target.value;
    const dt = opt.info.filter((x) => x.id == selectedId);
    setSec(dt);
  };
  const pop = sec[0].body.map((se) => {
    return se;
  });

  function signOut() {
    window.sessionStorage.setItem("Account ID", undefined);
    window.sessionStorage.setItem("Account First Name", undefined);
    window.sessionStorage.setItem("Account Last Name", undefined);
    window.sessionStorage.setItem("Account Password", undefined);
    window.sessionStorage.setItem("Account Position", undefined);
  }

  useEffect(() => {
    setOpt(opt); // Default value when page is loaded and changes whenever there is a new option selected
    setSec(opt?.info);
  }, [opt]);

  return (
    <>
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
          <Link to="/" onClick={signOut}>
            Sign-Out
          </Link>
          <Link to="/tests">Test</Link>
        </div>
      </div>
      <div className="Guide">
        <div id="majorSelect">
          <label>Line: &nbsp;</label>
          <select onChange={handleChange} value={opt?.id}>
            {LineData.map((op, i) => {
              return (
                <>
                  <option key={uuid()} value={op.id}>
                    {op.name}
                  </option>
                </>
              );
            })}
          </select>
        </div>
        {opt ? (
          <>
            <div className="iframe">
              <iframe key={uuid()} title={opt?.id} src={opt?.video} />
            </div>

            <div className="sec">
              <div className="secSelect">
                <select onChange={handleChange2} value={sec[0].id}>
                  {opt.info.map((block, i) => {
                    return (
                      <>
                        <option key={uuid()} value={block.id}>
                          {block.name}
                        </option>
                      </>
                    );
                  })}
                </select>
              </div>
              <div className="contento">
                <div className="text">
                  {sec[0].head.map((se, i) => {
                    return (
                      <>
                        <h4>{se}</h4>
                        <p>{pop[i]}</p>
                      </>
                    );
                  })}
                </div>
                <Carousel id={sec} />
              </div>
            </div>
          </>
        ) : (
          "No info"
        )}
      </div>
    </>
  );
};

export default Guide;
