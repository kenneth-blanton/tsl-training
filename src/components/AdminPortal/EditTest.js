import { Link, useParams, useNavigate } from "react-router-dom";
import logo from "../../images/PactiveVideoPoster.png";
import { db } from "../../data/firebase";
import { useEffect, useState } from "react";
import uuid from "react-uuid";
import EditQuestion from "./EditQuestion";

const EditTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  var docRef = db.collection("tests").doc(id);

  const [questions, setQuestions] = useState("");

  useEffect(() => {
    docRef.get().then((doc) => {
      setQuestions(doc.data().questions);
    });
  }, []);

  function signOut() {
    window.sessionStorage.setItem("Account ID", undefined);
    window.sessionStorage.setItem("Account First Name", undefined);
    window.sessionStorage.setItem("Account Last Name", undefined);
    window.sessionStorage.setItem("Account Password", undefined);
    window.sessionStorage.setItem("Account Position", undefined);
  }

  const addQuestion = () => {
    const abc = [...questions, { question: "", correct: "", incorrect: "" }];
    setQuestions(abc);
  };

  const deleteQuestion = (data) => {
    setQuestions(data);
    docRef.set({ questions: data }, { merge: true });
  };

  const deleteTest = () => {
    alert("Are you sure you want to do this?");
    docRef.delete().then(
      setTimeout(() => {
        navigate("/create");
      }, 1000)
    );
  };

  const goBack = () => {
    navigate("/create");
  };

  const saveData = (data) => {
    console.log(data);
    docRef.set({ questions }, { merge: true });
  };

  return (
    <>
      <div className="EditTest">
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
        <button onClick={goBack} className="utilButton">
          Back to Tests
        </button>
        <div className="questions">
          {Object.values(questions).map((info, i) => {
            return (
              <EditQuestion
                key={uuid()}
                number={i}
                questions={questions}
                question={info.question}
                correct={info.correct}
                wrongs={info.incorrect}
                save={saveData}
                removeIt={deleteQuestion}
              />
            );
          })}
          <button onClick={addQuestion} className="utilButton">
            Add New Question
          </button>
          <button onClick={deleteTest} className="utilButton">
            Delete Test
          </button>
        </div>
      </div>
    </>
  );
};

export default EditTest;
