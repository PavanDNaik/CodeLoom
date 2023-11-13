import React, { useEffect, useState } from "react";

function Submision(props) {
  const [submission, setSubmissions] = useState([]);
  useEffect(() => {
    getLatestSubmissions();
  }, []);
  async function getLatestSubmissions() {
    const userEmailToFetch = JSON.parse(localStorage.getItem("user")).userEmail;
    const fetchedSubmissions = await fetch(
      `http://localhost:5000/submissions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userEmailToFetch,
          pnum: props.problemNumber,
        }),
      }
    );
    fetchedSubmissions.json().then((data) => {
      if (data.listOfSubmission) {
        setSubmissions([...data.listOfSubmission]);
      }
    });
  }
  return (
    <div className="submission-list-container">
      {submission.reverse().map((value, index) => {
        return (
          <div
            key={index}
            className={
              value == "WA" ? "wrong-submission" : "correct-submission"
            }
          >
            {value}
          </div>
        );
      })}
    </div>
  );
}

export default Submision;
