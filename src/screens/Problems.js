import React, { useEffect, useState } from "react";
import Question from "../components/Question";
async function getAllProblems(user) {
  let allProblems = sessionStorage.getItem("problemSet");

  if (allProblems) {
    let setOfProblemObject = JSON.parse(allProblems);
    return setOfProblemObject;
  }

  let problemRequest = await fetch("http://localhost:5000/problems", {
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

function Problems({ user }) {
  const [allProblems, setAllProblems] = useState(null);
  const [listStatus, setListStatus] = useState("Loading...");
  useEffect(() => {
    if (user) {
      getAllProblems(user).then((problemSet) => {
        setAllProblems(problemSet);
      });
    } else {
      setListStatus("Log - in to get see The Problems");
    }
  }, []);

  return (
    <div>
      <div className="problemSet">
        <div className="problemset-table-titles">
          <div>Number</div>
          <div>Title</div>
          <div>Difficulty</div>
        </div>
        {allProblems ? (
          Object.values(allProblems).map((values, index) => {
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
