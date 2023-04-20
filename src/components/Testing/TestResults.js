import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../data/firebase";

const TestResults = (props) => {
  const { score, length, title } = props;

  const id = useParams();
  var account = window.sessionStorage.getItem("Account ID");
  if (account == null) {
    account = "BJ";
  }

  var docRef = db.collection("users").doc(account);

  useEffect(() => {
    docRef
      .get()
      .then((doc) => {
        if (account == "BJ") {
          console.log("Congratulations");
        } else {
          docRef.set(
            {
              testsTaken: { [Object.values(id).toString()]: { score } },
            },
            { merge: { [Object.values(id).toString()]: { score } } }
          );
        }

        console.log(doc.data());
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, []);

  return (
    <div className="TestResults">
      <h2>
        {title} Score: {score}/{length}
      </h2>
      <div className="links backToTests">
        <Link to="/tests">Go Back to Tests</Link>
      </div>
    </div>
  );
};

export default TestResults;
