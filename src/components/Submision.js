import React, { useEffect, useState } from "react";

function Submision(props) {
  const [submission, setSubmissions] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("Loading...");
  useEffect(() => {
    getLatestSubmissions();
  }, []);
  async function getLatestSubmissions() {
    try {
      if (!localStorage.getItem("user")) {
        setFetchStatus("Log-In/Sign-Up to see submissions!!");
        return;
      }
      const userEmailToFetch = JSON.parse(
        localStorage.getItem("user")
      )?.userEmail;
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
          if (!data.listOfSubmission.length) {
            setFetchStatus("No Submissions !!");
          }
          setSubmissions([...data.listOfSubmission]);
        } else {
          setFetchStatus("No Submissions !!");
        }
      });
    } catch {
      setFetchStatus("No submissions!!");
    }
  }
  return (
    <div className="submission-list-container">
      <div className="submission-list-header">
        <div>Status</div>
        <h5 className="date-of-submission">Date</h5>
      </div>
      {submission.length == 0 ? (
        <div className="submission-list-loading">{fetchStatus}</div>
      ) : (
        submission
          .slice()
          .reverse()
          .map((value, index) => {
            return (
              <div
                key={index}
                className={
                  value.charAt(0) === "A"
                    ? "correct-submission"
                    : "wrong-submission"
                }
              >
                <h6 className="date-of-submission">{value.substring(2)}</h6>
              </div>
            );
          })
      )}
    </div>
  );
}

export default Submision;
