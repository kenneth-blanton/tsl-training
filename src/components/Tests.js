import logo from "../images/PactiveVideoPoster.png";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../data/firebase";
import "../styles/Tests.css";
import TestListing from "./TestListing";

const Tests = () => {
  const [queryState, setQueryState] = useState({
    isLoading: true,
    errorMessage: "",
    docSnapshots: null,
  });

  useEffect(() => {
    async function getAllUsers() {
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

    getAllUsers();
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
            <Link to="/tsl-training/">Training</Link>
          </div>
        </div>
        <div className="testList">{content}</div>
      </div>
    </>
  );
};

export default Tests;
