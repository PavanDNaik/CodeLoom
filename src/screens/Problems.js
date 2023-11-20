import React, { useEffect, useState } from "react";
import Question from "../components/Question";
async function getAllProblems() {
  let problemRequest = await fetch("http://localhost:5000/problems", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let allProblems = await problemRequest.json();
  return allProblems;
}

function Problems() {
  const [allProblems, setAllProblems] = useState({});

  let info = localStorage.getItem("user");
  if (info) {
    info = JSON.parse(info);
  }

  useEffect(() => {
    getAllProblems().then((problemSet) => {
      setAllProblems(problemSet.problems);
    });
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
            return <Question key={index} {...values} />;
          })
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default Problems;
