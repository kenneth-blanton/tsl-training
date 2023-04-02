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

  const { title, questions, corrects, answers, testLength } = data;
  console.log(questions);

  const allAnswers = Object.values(answers[current] || [["hi"], ["bye"]]);
  const renderedAnswers = [...allAnswers[0], ...allAnswers[1]];
  shuffleArray(renderedAnswers);
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
            {renderedAnswers?.map((answer, i) => {
              return (
                <button key={i} value={answer} onClick={getAnswer}>
                  {answer.toString()}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <TestResults score={score} />
      )}
    </div>
  );
};

export default TestContent;
