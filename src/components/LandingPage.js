import "../styles/LandingPage.css";
import { Link } from "react-router-dom";
import logo from "../images/PactiveVideoPoster.png";
import { useState } from "react";
import { db } from "../data/firebase";
import { CircularProgress } from "@mui/material";

const LandingPage = () => {
  var pass;
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");

  const onClick = async (e) => {
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
            setContent(<CircularProgress />);
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
            window.location.href = "/tests";
          });
          console.log(pass);
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

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
        </div>
      </div>
      <div className="LandingPage">
        <img
          src="https://images.unsplash.com/photo-1516937941344-00b4e0337589?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kdXN0cmlhbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
          alt="fdfg"
        />
        <div className="login">
          <form>
            <label>
              Enter Log-In{" "}
              <input
                type="number"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <input type="submit" value="Sign-In" onClick={onClick} />
            {/* <button onClick={onClick}>Sign In</button> */}
          </form>
          <p>{content}</p>
          <button>Sign Up</button>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
