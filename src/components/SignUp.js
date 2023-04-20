import { Link, useNavigate } from "react-router-dom";
import logo from "../images/PactiveVideoPoster.png";
import { db } from "../data/firebase";
import { useState, useEffect } from "react";
// import Users from "../data/Users.json";

const SignUp = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState();
  const [check, setCheck] = useState();
  const [position, setPosition] = useState("");

  const [content, setContent] = useState();
  const [countdown, setCountdown] = useState();

  function addUser() {
    const newUser = db.collection("users").add({
      firstName,
      lastName,
      password,
      position,
    });
    newUser.then((data) => {
      data.get().then((user) => {
        window.sessionStorage.setItem("Account ID", user.id);
        window.sessionStorage.setItem(
          "Account First Name",
          user.data().firstName
        );
        window.sessionStorage.setItem(
          "Account Last Name",
          user.data().lastName
        );
        window.sessionStorage.setItem("Account Password", user.data().password);
        window.sessionStorage.setItem("Account Position", user.data().position);
        setContent("Welcome " + user.data().firstName + "!");
      });
    });
    document.getElementById("countdown").style.display = "block";

    setTimeout(() => {
      navigate("/tests");
    }, 5000);
  }

  useEffect(() => {
    const timer =
      countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const onClick = () => {
    try {
      if (password === undefined) {
        setContent("Enter your employee ID");
      } else if ((firstName || lastName || position) === "") {
        setContent("Please fill out form");
        console.log("Fill everything out");
      } else if (isNaN(password)) {
        setContent("Enter your log-in");
        console.log("Enter your log-in");
      } else if (check !== password) {
        setContent("Match your employee ID");
        console.log("Match your employee ID");
      } else {
        db.collection("users")
          .where("password", "==", password)
          .get()
          .then((user) => {
            if (user.docs[0]?.exists) {
              console.log("User already exists", user.docs[0].data());
              setContent("User already exists");
            } else {
              addUser();
              setCountdown(5);
            }
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="SignUp">
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
      <div className="CreateNewUser">
        <div className="form">
          <h1>Sign Up</h1>
          <label>
            <h3>First Name</h3>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          <label>
            <h3>Last Name</h3>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          <label>
            <h3>Employee ID</h3>
            <input
              type="number"
              value={password}
              onChange={(e) => setPassword(e.target.valueAsNumber)}
              required
            />
          </label>
          <label>
            <h3>Re-Enter Employee ID</h3>
            <input
              type="number"
              value={check}
              onChange={(e) => setCheck(e.target.valueAsNumber)}
              required
            />
          </label>
          <label>
            <h3>Position</h3>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              style={{ width: "100px", textAlign: "center" }}
            >
              <option value=""></option>
              <option value="OA1">OA1</option>
              <option value="OA2">OA2</option>
              <option value="OA3">OA3</option>
              <option value="OS1">OS1</option>
              <option value="OS2">OS2</option>
              <option value="OS3">OS3</option>
            </select>
          </label>
          <p id="countdown" style={{ display: "none" }}>
            You will be redirected in:{" "}
            <span style={{ color: "green" }}>{countdown}</span>
          </p>
          <p style={{ color: "red" }}>{content}</p>
          <button onClick={onClick}>Create User</button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
