import React, { useEffect, useState } from "react";
const FETCH_BASE_URI =
  process.env.REACT_APP_FETCH_BASE_URL || "http://localhost:3000";
function Submision(props) {
  const [submissions, setSubmissions] = useState([]);
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
      const fetchedSubmissions = await fetch(`${FETCH_BASE_URI}/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userEmailToFetch,
          pnum: props.problemNumber,
        }),
      }).catch((err) => console.log(err));
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
        <div>Language</div>
        <div className="date-of-submission">Date</div>
      </div>
      {submissions.length === 0 ? (
        <div className="submission-list-loading">{fetchStatus}</div>
      ) : (
        submissions
          .slice()
          .reverse()
          .map((submision, index) => {
            return (
              <div key={index} className="submission-element">
                <h4
                  className={
                    submision.status === "AC"
                      ? "correct-submission"
                      : "wrong-submission"
                  }
                >
                  {submision.status}
                </h4>
                <h5 className="language">{submision.lang}</h5>
                <h5 className="date-of-submission">{submision.date}</h5>
              </div>
            );
          })
      )}
    </div>
  );
}

export default Submision;
