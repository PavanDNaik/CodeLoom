import React, { useEffect, useState } from "react";
import Question from "../components/Question";
const FETCH_BASE_URI =
  process.env.REACT_APP_FETCH_BASE_URL || "http://localhost:3000";
async function getAllProblems(user) {
  let allProblems = sessionStorage.getItem("problemSet");

  if (allProblems) {
    let setOfProblemObject = JSON.parse(allProblems);
    return setOfProblemObject;
  }

  let problemRequest = await fetch(`${FETCH_BASE_URI}/problems`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: user,
    },
  });

  allProblems = await problemRequest.json();

  sessionStorage.setItem("problemSet", JSON.stringify(allProblems));
  return allProblems;
}

function getPrior(a, b, sortFactor) {
  if (a.difficulty === b.difficulty) {
    return a.pnum - b.pnum;
  } else if (
    (a.difficulty === "medium" && b.difficulty === "easy") ||
    (a.difficulty === "hard" && b.difficulty === "medium") ||
    (a.difficulty === "hard" && b.difficulty === "easy")
  ) {
    return sortFactor;
  }
  return -1 * sortFactor;
}

function Problems({ user }) {
  const [allProblems, setAllProblems] = useState(null);
  const [sortFactor, setSortFactor] = useState(1);
  const [listStatus, setListStatus] = useState("Loading...");

  useEffect(() => {
    if (user) {
      getAllProblems(user).then((problemSet) => {
        setAllProblems(Object.values(problemSet));
      });
    } else {
      setListStatus("Log - in to get see The Problems");
    }
  }, [user]);

  useEffect(() => {
    if (allProblems) {
      allProblems.sort((a, b) => getPrior(a, b, sortFactor));
    }
  }, [sortFactor, allProblems]);

  return (
    <div>
      <div className="problemSet">
        <div className="problemset-table-titles">
          <div>Number</div>
          <div>Title</div>
          <div className="editor-config-selects">
            <select
              onChange={(e) => {
                setSortFactor(e.target.value);
              }}
            >
              <option value="0" disabled selected hidden>
                Difficulty
              </option>
              <option value="-1">Easy</option>
              <option value="1">Hard</option>
            </select>
          </div>
        </div>
        {allProblems ? (
          allProblems.map((values, index) => {
            return <Question key={index} {...values} user={user} />;
          })
        ) : (
          <div>{listStatus}</div>
        )}
      </div>
    </div>
  );
}

export default Problems;
