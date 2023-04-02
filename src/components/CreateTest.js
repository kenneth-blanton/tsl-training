import { db } from "../data/firebase";
import { useState } from "react";
import logo from "../images/PactiveVideoPoster.png";
import { Link } from "react-router-dom";
import "../styles/CreateTest.css";

const CreateTest = () => {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [correct, setCorrect] = useState("");
  const questions = [];

  const onClick = async () => {
    try {
      const docRef = await db.collection("tests").add({
        title,
        questions: [],
      });

      console.log("Successfully added new test", docRef);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(questions.length);

  const addQuestion = () => {
    console.log(questions.length);
  };

  return (
    <>
      <div className="CreateTest">
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
            <Link to="/">Sign-Out</Link>
            <Link to="/tests">Test</Link>
          </div>
        </div>
        <div className="createTestForm">
          <h2>Create User</h2>
          <div>
            <label>
              <b>Title: </b>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            <br />
            <h4>Questions</h4>
            <label>
              Question:
              <br />
              <input type="text" />
            </label>
            <br />
            <label>
              Correct Answer:
              <br />
              <input type="text" />
            </label>
            <br />
            <label>
              Incorrect Answers:
              <br />
              <input type="text" />
              <br />
              <input type="text" />
              <br />
              <input type="text" />
              <br />
            </label>
            <button onClick={addQuestion}>Add Question</button>
          </div>
          <div>
            <button onClick={onClick}>Create Test</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTest;
