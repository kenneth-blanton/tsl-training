import { Link, useParams } from "react-router-dom";
import logo from "../images/PactiveVideoPoster.png";
import { db } from "../data/firebase";
import { useEffect, useState } from "react";
import "../styles/Tests.css";
import TestContent from "./TestContent";

const TakeTest = () => {
  const { id } = useParams();
  const [data, setData] = useState({
    isLoading: true,
    title: "Loading",
    questions: "Loading",
    corrects: "",
    answers: ["Loading"],
    testLength: 1,
  });
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  var docRef = db.collection("tests").doc(id);

  useEffect(() => {
    docRef
      .get()
      .then((doc) => {
        const title = doc?.data()?.title;
        const questions = doc?.data()?.questions;

        shuffleArray(questions);

        let questionsList = [];
        let answersList = [];
        let correctsList = [];

        for (const question of questions) {
          questionsList.push(question.question);
        }

        for (const answers of questions) {
          answersList.push(answers.answers);
        }

        for (const corrects of questions) {
          correctsList.push(corrects.answers.correct.toString());
        }

        const testLength = questions.length;

        setData({
          isLoading: false,
          title,
          questions: questionsList,
          corrects: correctsList,
          answers: answersList,
          testLength,
        });
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, []);

  const { isLoading } = data;

  console.log("Current quesiton ", current);
  console.log(score);

  let content;

  if (isLoading) {
    content = "Loading";
  } else {
    content = (
      <TestContent
        data={data}
        shuffleArray={shuffleArray}
        current={current}
        setCurrent={setCurrent}
        score={score}
        setScore={setScore}
      />
    );
  }

  return (
    <>
      <div className="TakeTest">
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
        <div className="content">{content}</div>
      </div>
    </>
  );

  // const { id } = useParams();
  // const [score, setScore] = useState(0);
  // const [current, setCurrent] = useState(0);
  // const [data, setData] = useState({
  //   title: "",
  //   questions: [],
  //   question: "",
  //   answers: [],
  //   correct: "",
  // });
  // function shuffleArray(array) {
  //   for (var i = array.length - 1; i > 0; i--) {
  //     var j = Math.floor(Math.random() * (i + 1));
  //     var temp = array[i];
  //     array[i] = array[j];
  //     array[j] = temp;
  //   }
  // }
  // useEffect(() => {
  //   async function getTests() {
  //     const test = (await db.collection("tests").doc(id).get()).data();
  //     const questions = test.questions;
  //     console.log(questions);
  //     console.log(Math.floor(Math.random() * questions.length));
  //     const correct = questions[current].answers.correct.toString();
  //     console.log(correct);
  //     const question = questions[current].question;
  //     const answers = Object.values(questions[current].answers);
  //     const allAnswers = [...answers[0], ...answers[1]];
  //     shuffleArray(allAnswers);
  //     setData({
  //       title: test.title,
  //       questions,
  //       question,
  //       answers: allAnswers,
  //       correct,
  //     });
  //   }
  //   getTests();
  // }, [current]);
  // const getAnswer = async function (e) {
  //   const answerVal = e.target.value;
  //   if (answerVal === correct) {
  //     setScore(score + 1);
  //     console.log("Correct!");
  //   }
  //   setCurrent(current + 1);
  // };
  // const { title, question, answers, correct } = data;
  // console.log(question);
  // return (
  //   <div className="TestTest">
  //     <div className="appBar">
  //       <div className="logo">
  //         <a
  //           href="https://pactivevergreen.com/"
  //           target="_blank"
  //           rel="noreferrer"
  //         >
  //           <img src={logo} alt="logo" />
  //         </a>
  //       </div>
  //       <div className="links">
  //         <Link to="/tsl-training/">Training</Link>
  //       </div>
  //     </div>
  //     <div className="content">
  //       {current < data.questions.length ? (
  //         <TestContent
  //           title={title}
  //           question={question}
  //           answers={answers}
  //           getAnswer={getAnswer}
  //         />
  //       ) : (
  //         <TestResults score={score} />
  //       )}
  //     </div>
  //   </div>
  // );
};

export default TakeTest;
