import "../styles/LandingPage.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/PactiveVideoPoster.png";
import { useState, useEffect } from "react";
import { db } from "../data/firebase";
import { CircularProgress } from "@mui/material";
// import Users from "../data/Users.json";

const LandingPage = () => {
  const navigate = useNavigate();
  var pass;
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");
  const [countdown, setCountdown] = useState();

  async function onClick(e) {
    e.preventDefault();
    pass = parseInt(password);
    await db
      .collection("users")
      .where("password", "==", pass)
      .get()
      .then((data) => {
        if (data.empty === true) {
          console.log("No employee");
          setContent("Couldn't find account! Try again or sign up.");
          window.sessionStorage.setItem("Account ID", undefined);
          window.sessionStorage.setItem("Account First Name", undefined);
          window.sessionStorage.setItem("Account Last Name", undefined);
          window.sessionStorage.setItem("Account Password", undefined);
          window.sessionStorage.setItem("Account Position", undefined);
        } else {
          data.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            setCountdown(5);
            setContent("Welcome " + doc.data().firstName + "!");
            window.sessionStorage.setItem("Account ID", doc.id);
            window.sessionStorage.setItem(
              "Account First Name",
              doc.data().firstName
            );
            window.sessionStorage.setItem(
              "Account Last Name",
              doc.data().lastName
            );
            window.sessionStorage.setItem(
              "Account Password",
              doc.data().password
            );
            window.sessionStorage.setItem(
              "Account Position",
              doc.data().position
            );
            document.getElementById("countdown").style.display = "block";
            document.getElementById("content").style.color = "green";

            setTimeout(() => {
              navigate("/tests");
            }, 5000);
          });
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  useEffect(() => {
    const timer =
      countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

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
          <Link to="/tests">Demo</Link>
          <Link to="/sign-up">Sign Up</Link>
        </div>
      </div>
      <div className="LandingPage">
        <div className="form">
          <h2>Enter Log-In</h2>
          <input
            type="number"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onClick(e);
              }
            }}
          />
          <button onClick={onClick}>Sign In</button>
          <br />{" "}
          <p id="countdown" style={{ display: "none" }}>
            You will be redirected in:{" "}
            <span style={{ color: "green" }}>{countdown}</span>
          </p>
          <p style={{ color: "red" }} id="content">
            {content}
          </p>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
