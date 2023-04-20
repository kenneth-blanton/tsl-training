import { db } from "../../data/firebase";
import { useEffect, useState } from "react";
import logo from "../../images/PactiveVideoPoster.png";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/AdminDashboard.css";
import AdminTestListing from "./TestListing";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [queryState, setQueryState] = useState({
    isLoading: true,
    errorMessage: "",
    docSnapshots: null,
  });
  const [title, setTitle] = useState("");

  function signOut() {
    window.sessionStorage.setItem("Account ID", undefined);
    window.sessionStorage.setItem("Account First Name", undefined);
    window.sessionStorage.setItem("Account Last Name", undefined);
    window.sessionStorage.setItem("Account Password", undefined);
    window.sessionStorage.setItem("Account Position", undefined);
  }

  const createTest = () => {
    db.collection("tests")
      .add({
        title,
        questions: [
          {
            question: "Sample Question",
            correct: "Default Correct Answer",
            incorrect: ["Default Incorrect Answer"],
          },
        ],
      })
      .then((doc) => {
        setTimeout(() => {
          navigate("/edit-test/" + doc.id);
        }, 1000);
      });
  };

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
    getAllTests();
  }, []);

  const { isLoading, errorMessage, docSnapshots } = queryState;

  let content;

  if (isLoading) {
    content = "Loading...";
  } else if (errorMessage) {
    content = errorMessage;
  } else {
    content = <AdminTestListing data={docSnapshots} />;
  }

  return (
    <>
      <div className="AdminDashboard">
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
            <Link to="/tests">Tests</Link>
          </div>
        </div>
        <div className="testList">
          <h2>Admin Portal</h2>
          {content}
          <div className="form">
            <h2>Create Test</h2>
            <label>
              <h3>Title of New Test</h3>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            <button onClick={createTest}>Create Test</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
