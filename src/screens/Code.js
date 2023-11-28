import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import Description from "../components/Description";
import Submision from "../components/Submision";
import Editor from "../components/Editor";
import backSVG from "../images/back.svg";
import Profile from "../components/Profile";
const FETCH_BASE_URI =
  process.env.REACT_APP_FETCH_BASE_URL || "http://localhost:3000";
//fetch problem
async function getProblemInfo({ problemId, token }) {
  if (localStorage.getItem(problemId)) {
    return JSON.parse(localStorage.getItem(problemId));
  }
  const problemInfoString = await fetch(
    `${FETCH_BASE_URI}/problems/${problemId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    }
  );

  const problemInfoObject = await problemInfoString
    .json()
    .catch((err) => console.log(err));
  return { ...problemInfoObject };
}

function Code() {
  //editor and problem hooks
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("python");
  const [problemInfo, setProblemInfo] = useState({});
  const [testResult, setTestResult] = useState("");
  // const [clickable, setClickable] = useState(true);
  //tab hooks
  const [submitionOrInfo, setSubmitionOrInfo] = useState("DESCRIPTION");
  const [showCaseOrResult, setshowCaseOrResult] = useState("CASE");

  //split-pane
  const [bodySizes, setBodySizes] = useState([100, "10%", "auto"]);
  const [editorSizes, setEditorSizes] = useState([100, "10%", "auto"]);
  const problemId = useParams();
  //loader
  useEffect(() => {
    getProblemInfo(
      problemId,
      JSON.parse(localStorage.getItem("user")).userEmail
    ).then((data) => {
      if (!data) {
        console.log("could not fint data");
      } else {
        if (data.fetchError) {
          console.log(data.fetchError);
          navigate("/404");
        } else {
          setProblemInfo({ ...data });
          localStorage.setItem(
            data.title && data.title.replaceAll(" ", "-"),
            JSON.stringify(data)
          );
        }
      }
    });
  }, [problemId]);

  //callbakc to editor
  const getCodeInfo = (codeFromEditor, language) => {
    setCode(codeFromEditor);
    setLang(language);
  };

  //general tab switching
  function showTab(tabValue, currentTabValue, setTabValue) {
    if (currentTabValue !== tabValue) {
      setTabValue(tabValue);
    }
  }

  //setting messages
  function setMessageInResult(outputMessage) {
    showTab("RESULT", showCaseOrResult, setshowCaseOrResult);
    setTestResult(outputMessage);
  }

  function showSubmissionSuccesMessage() {
    const submissionPopMessage = document.getElementById("submission-message");
    submissionPopMessage.classList.toggle("display-none");
    submissionPopMessage.classList.toggle("submission-success-message");
    setTimeout(() => {
      submissionPopMessage.classList.toggle("display-none");
      submissionPopMessage.classList.toggle("submission-success-message");
    }, 2500);
  }

  function getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  function userNotLogedIn() {
    if (getUser()) {
      return false;
    } else {
      alert("Please Login to Continue!!");
      return true;
    }
  }
  async function handleRun(e) {
    if (userNotLogedIn()) {
      return;
    }

    e.target.disabled = true;
    setMessageInResult("Running...");
    const result = await fetch(`${FETCH_BASE_URI}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        lang: lang,
        pnum: problemInfo.pnum,
      }),
    }).catch((err) => {
      setMessageInResult("SERVER ERROR!");
      console.log(err);
    });

    if (result) {
      const output = await result.json();
      if (output.error) {
        setMessageInResult(output.error);
      } else if (output.substring && output?.substring(0, 4) === "True") {
        setMessageInResult("All Test Cases Passed");
      } else {
        setMessageInResult(output);
      }
    }

    setTimeout(() => {
      e.target.disabled = false;
    }, 2000);
  }

  async function handleSubmit(e) {
    if (userNotLogedIn()) {
      return;
    }
    e.target.disabled = true;
    setMessageInResult("Executing...");
    const user = getUser();
    const result = await fetch(`${FETCH_BASE_URI}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        lang: lang,
        pnum: problemInfo.pnum,
        userEmail: user.userEmail,
      }),
    }).catch((err) => {
      setMessageInResult("SERVER ERROR!");
      console.log(err);
    });
    if (!result) {
      setTestResult("");
      return;
    }
    const output = await result.json();
    if (output.error) {
      setMessageInResult(output.error);
    } else if (output.substring && output.substring(0, 4) === "True") {
      setMessageInResult("All Test Cases Passed");
      showSubmissionSuccesMessage();
    } else {
      setMessageInResult(output);
    }

    setTimeout(() => {
      e.target.disabled = false;
    }, 2000);
  }

  return (
    <div className="coding-interface">
      <div className="coding-interface-navbar">
        <div className="back-svg" onClick={() => navigate(-1)}>
          <img src={backSVG} alt="<" />
          <span>Back</span>
        </div>
        <Profile userName={getUser()?.userName} />
      </div>
      <div className="display-none" id="submission-message">
        SUBMISSION SUCCESSFULL
      </div>
      <SplitPane split="vertical" sizes={bodySizes} onChange={setBodySizes}>
        <Pane
          minSize={50}
          maxSize="70%"
          className="description-submission-container"
        >
          <div className="stick-top-of-container-2">
            <button
              onClick={(e) => {
                showTab("DESCRIPTION", submitionOrInfo, setSubmitionOrInfo);
              }}
              className={submitionOrInfo === "DESCRIPTION" ? "clicked" : ""}
            >
              Description
            </button>
            <button
              onClick={(e) => {
                showTab("SUBMISSION", submitionOrInfo, setSubmitionOrInfo);
              }}
              className={submitionOrInfo === "SUBMISSION" ? "clicked" : ""}
            >
              Submissions
            </button>
          </div>
          {submitionOrInfo === "DESCRIPTION" ? (
            <Description {...problemInfo} />
          ) : (
            <Submision problemNumber={String(problemInfo.pnum)} />
          )}
        </Pane>

        <Pane className="editor-testcases-container">
          <SplitPane
            split="horizontal"
            sizes={editorSizes}
            onChange={setEditorSizes}
          >
            <Pane
              minSize={50}
              maxSize="90%"
              className="monaco-editor-container"
            >
              <Editor getCodeInfo={getCodeInfo} problemInfo={problemInfo} />
            </Pane>

            <div className="result-test-case-container split-pane-layoutCSS ">
              <div className="stick-top-of-container">
                <div>
                  <button
                    onClick={(e) =>
                      showTab("CASE", showCaseOrResult, setshowCaseOrResult)
                    }
                    className={showCaseOrResult === "CASE" ? "clicked" : ""}
                  >
                    TestCase
                  </button>
                  <button
                    onClick={(e) =>
                      showTab("RESULT", showCaseOrResult, setshowCaseOrResult)
                    }
                    className={showCaseOrResult === "RESULT" ? "clicked" : ""}
                  >
                    TestResult
                  </button>
                </div>
                <span className="run-submit-button-container">
                  <button
                    onClick={async (e) => await handleRun(e)}
                    className="run-button"
                  >
                    Run
                  </button>
                  <button
                    onClick={async (e) => await handleSubmit(e)}
                    className="submit-button"
                  >
                    Submit
                  </button>
                </span>
              </div>
              {showCaseOrResult === "RESULT" ? (
                <div className="output-section-container">
                  <pre className="editor-testresult">{testResult}</pre>
                </div>
              ) : (
                <div className="Test-cases-container">
                  {problemInfo.testCases &&
                    problemInfo.testCases.map((val, index) => {
                      return (
                        <pre key={index}>
                          <h4 className="test-cases-heading">CASE {index}</h4>
                          <div className="test-case-input">{`${val}`}</div>
                        </pre>
                      );
                    })}
                </div>
              )}
            </div>
          </SplitPane>
        </Pane>
      </SplitPane>
    </div>
  );
}

export default Code;
