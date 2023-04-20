import { useState } from "react";
import uuid from "react-uuid";

const EditQuestion = ({
  questions,
  question,
  correct,
  wrongs,
  number,
  save,
  removeIt,
}) => {
  const [editActive, setEditActive] = useState(false);
  const [newWrongs, setNewWrongs] = useState(wrongs || []);
  const [newQuestion, setNewQuestion] = useState(question);
  const [newCorrect, setNewCorrect] = useState(correct);

  const handleAddAnswer = () => {
    const abc = [...newWrongs, ""];
    setNewWrongs(abc);
  };

  const handleChangeAnswer = (onChangeValue, i) => {
    const inputdata = [...newWrongs];
    inputdata[i] = onChangeValue.target.value;
    setNewWrongs(inputdata);
  };

  const handleDeleteAnswer = (i) => {
    const deleteWrong = [...newWrongs];
    deleteWrong.splice(i, 1);
    setNewWrongs(deleteWrong);
  };

  const deleteQuestion = (number) => {
    const grim = number.target.id;
    const deleteQuestion = [...questions];
    deleteQuestion.splice(grim, 1);
    removeIt(deleteQuestion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditActive((prev) => !prev);

    questions[number] = {
      question: newQuestion,
      correct: newCorrect,
      incorrect: newWrongs,
    };

    save(questions);
  };

  return (
    <>
      {editActive ? (
        <div className="card" key={number}>
          <p style={{ fontSize: 20, fontWeight: "bold" }} key={uuid()}>
            Question
          </p>
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <p style={{ color: "green", fontSize: 20 }} key={uuid()}>
            Correct Answer
          </p>
          <input
            type="text"
            value={newCorrect}
            onChange={(e) => setNewCorrect(e.target.value)}
          />
          {wrongs.length > 1 ? (
            <p style={{ color: "red", fontSize: 20 }} key={uuid()}>
              Incorrect Answers
            </p>
          ) : (
            <p style={{ color: "red", fontSize: 20 }} key={uuid()}>
              Incorrect Answer
            </p>
          )}
          <button onClick={handleAddAnswer} className="utilButton">
            Add Answer
          </button>
          {newWrongs.map((data, i) => {
            return (
              <div>
                <input
                  value={data}
                  onChange={(e) => handleChangeAnswer(e, i)}
                />
                <button
                  style={{ display: "inline" }}
                  onClick={() => handleDeleteAnswer(i)}
                  className="utilButton"
                >
                  Delete Answer
                </button>
              </div>
            );
          })}
          <button
            style={{ marginTop: "2em" }}
            onClick={() => setEditActive((prev) => !prev)}
            className="utilButton"
          >
            Cancel
          </button>
          <button onClick={handleSubmit} className="utilButton">
            Save
          </button>
          <button id={number} onClick={deleteQuestion} className="utilButton">
            Remove Question
          </button>
        </div>
      ) : (
        <div className="card" key={uuid()}>
          <p style={{ fontSize: 20, fontWeight: "bold" }} key={uuid()}>
            {newQuestion}
          </p>
          <p style={{ color: "green", fontSize: 20 }} key={uuid()}>
            Correct Answer
          </p>
          <p>{newCorrect}</p>
          {newWrongs.length > 1 ? (
            <p style={{ color: "red", fontSize: 20 }} key={uuid()}>
              Incorrect Answers
            </p>
          ) : (
            <p style={{ color: "red", fontSize: 20 }} key={uuid()}>
              Incorrect Answer
            </p>
          )}
          {newWrongs.map((bad) => {
            return (
              <p style={{ margin: ".5em 0" }} key={uuid()}>
                {bad}
              </p>
            );
          })}
          <button
            onClick={() => {
              setEditActive((prev) => !prev);
            }}
            className="utilButton"
          >
            Edit Question
          </button>
        </div>
      )}
    </>
  );
};

export default EditQuestion;
