import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
      <Navbar {...info} />
      <div className="problemSet">
        {allProblems &&
          Object.values(allProblems).map((values, index) => {
            return <Question key={index} {...values} />;
          })}
      </div>

      <Footer />
    </div>
  );
}

export default Problems;
