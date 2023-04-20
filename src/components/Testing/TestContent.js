import { useEffect, useState } from "react";
import TestResults from "./TestResults";
const TestContent = ({
  data,
  shuffleArray,
  current,
  setCurrent,
  score,
  setScore,
}) => {
  const getAnswer = async function (e) {
    const answerVal = e.target.value;
    if (answerVal === correct) {
      setScore(score + 1);
      console.log("Correct!");
    }
    setCurrent(current + 1);
  };

  const { title, questions, corrects, wrongs, testLength } = data;

  const allAnswers = [];
  wrongs[current]?.map((bad) => {
    allAnswers.push(bad);
  });
  allAnswers.push(corrects[current]);
  shuffleArray(allAnswers);
  const question = questions[current];
  const correct = corrects[current];

  return (
    <div className="TestContent">
      {current < testLength ? (
        <>
          <h1>{title}</h1>
          <h3>{question}</h3>
          {/* <p>The correct answer is: {correct}</p> */}
          <div className="answers">
            {allAnswers?.map((answer, i) => {
              return (
                <button key={i} value={answer} onClick={getAnswer}>
                  {answer.toString()}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <TestResults score={score} length={questions.length} title={title} />
      )}
    </div>
  );
};

export default TestContent;
