import logo from "../../images/PactiveVideoPoster.png";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../data/firebase";
import "../../styles/Tests.css";
import TestListing from "./TestListing";

const Tests = () => {
  function signOut() {
    window.sessionStorage.setItem("Account ID", undefined);
    window.sessionStorage.setItem("Account First Name", undefined);
    window.sessionStorage.setItem("Account Last Name", undefined);
    window.sessionStorage.setItem("Account Password", undefined);
    window.sessionStorage.setItem("Account Position", undefined);
  }

  const [admin, setAdmin] = useState("");

  const [queryState, setQueryState] = useState({
    isLoading: true,
    errorMessage: "",
    docSnapshots: null,
  });

  useEffect(() => {
    async function getAllTests() {
      try {
        setQueryState({
          isLoading: true,
          errorMessage: "",
          docSnapshots: null,
        });
        const docSnapshot = await db.collection("tests").get();
        const docs = docSnapshot.docs;
        setQueryState({
          isLoading: false,
          errorMessage: "",
          docSnapshots: docs,
        });
      } catch (err) {
        setQueryState({
          isLoading: false,
          errorMessage: `Couldn't get connect to database! Try again.`,
          docSnapshots: null,
        });
        console.log(err);
      }
    }

    if (window.sessionStorage.getItem("Account Password") == 246802) {
      setAdmin(<Link to="/create">Admin</Link>);
    }

    getAllTests();
  }, []);

  const { isLoading, errorMessage, docSnapshots } = queryState;

  let content;

  if (isLoading) {
    content = "Loading...";
  } else if (errorMessage) {
    content = errorMessage;
  } else {
    content = <TestListing data={docSnapshots} />;
  }

  return (
    <>
      <div className="Tests">
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
            <Link to="/tsl-training/">Training</Link>
            {admin}
          </div>
        </div>
        <div className="testList">{content}</div>
      </div>
    </>
  );
};

export default Tests;
