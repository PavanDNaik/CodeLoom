import React, { useEffect, useState } from "react";

function Submision(props) {
  const [submission, setSubmissions] = useState([]);
  useEffect(() => {
    getLatestSubmissions();
  }, []);
  async function getLatestSubmissions() {
    try {
      const userEmailToFetch = JSON.parse(
        localStorage.getItem("user")
      ).userEmail;
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
      ).catch((err) => console.log(err));
      fetchedSubmissions.json().then((data) => {
        if (data.listOfSubmission) {
          setSubmissions([...data.listOfSubmission]);
        }
      });
    } catch {
      console.log("NETWORK ERROR!!");
    }
  }
  return (
    <div className="submission-list-container">
      {submission.map((value, index) => {
        return (
          <div
            key={index}
            className={
              value.charAt(0) === "A"
                ? "correct-submission"
                : "wrong-submission"
            }
          >
            <h5 className="date-of-submission">{value.substring(2)}</h5>
          </div>
        );
      })}
    </div>
  );
}

export default Submision;
