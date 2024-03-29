import React, { useState } from "react";
import Editor from "../components/Editor";
const FETCH_BASE_URI =
  process.env.REACT_APP_FETCH_BASE_URL || "http://localhost:3000";
const EXAMPLE_SYNTAX = `
Input: 1, 2
output:3
Explanation: 1 + 2 = 3
`;
const LANGUAGES = ["python", "java", "c"];
function getObjectOfLanguages() {
  let langObj = {};
  for (let lang of LANGUAGES) {
    langObj[lang] = "";
  }
  return langObj;
}

function ProblemComposer() {
  const [numOfExamples, setNumOfExamples] = useState(0);
  const [basicProblemInfo, setBasicProblemInfo] = useState({
    pnum: "",
    title: "",
    difficulty: "easy",
    description: { overview: "", examples: [] },
    testCases: [],
  });

  const [boilerPlate, setBoilerPlate] = useState(getObjectOfLanguages);
  const [testCode, setTestCode] = useState(getObjectOfLanguages);
  const [submissionTestCode, setSubmissionTestCode] =
    useState(getObjectOfLanguages);
  function setPropartyOfState(state, setState, value, property, index) {
    if (index === undefined) {
      state[property] = value;
    } else {
      state[property][index] = value;
    }
    setState(state);
  }

  function updateBoilerPlateCode(code, lang) {
    setPropartyOfState(boilerPlate, setBoilerPlate, code, lang);
  }

  function updateTestCode(code, lang) {
    setPropartyOfState(testCode, setTestCode, code, lang);
  }

  function updateSubmissionTestCode(code, lang) {
    setPropartyOfState(submissionTestCode, setSubmissionTestCode, code, lang);
  }

  function updateBasicInfoStateByProperty(property, value, index) {
    setPropartyOfState(
      basicProblemInfo,
      setBasicProblemInfo,
      value,
      property,
      index
    );
  }
  function getExampleTemplate() {
    return (
      <div className="admin-example-container">
        {Array.from({ length: numOfExamples }, (V, index) => index).map(
          (v, index) => {
            return (
              <textarea
                cols="30"
                rows="10"
                key={index}
                placeholder={EXAMPLE_SYNTAX}
                type="text"
                onChange={(e) => {
                  basicProblemInfo.description.examples[index] = e.target.value;
                  setBasicProblemInfo(basicProblemInfo);
                }}
              ></textarea>
            );
          }
        )}
      </div>
    );
  }

  function handleProblemSubmit() {
    console.log(basicProblemInfo);
    const newProblem = {
      ...basicProblemInfo,
      boilerPlate,
      testCode,
      submissionTestCode,
    };
    console.log(newProblem);
    fetch(`${FETCH_BASE_URI}/admin/addProblem`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        newProblem: { ...newProblem },
      }),
    })
      .then((result) => {
        result.json().then((data) => {
          if (data.success) {
            // document.getElementById("upload-message").textContent =
            //   data.success;
            alert("success");
          } else {
            // document.getElementById("upload-message").textContent =
            //   "UPLOAD FAILED";
            alert("Upload Failed");
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="problem-composer-container">
      <div className="admin-basic-problem-info">
        <div className="admin-basic-problem-credentials">
          <div className="admin-section-titles admin-flex-div">
            <div>Problem Number:</div>
            <div>Title:</div>
            <div>Difficulty:</div>
          </div>
          <div className="admin-flex-div">
            <input
              type="number"
              placeholder="Problem Number"
              onChange={(e) =>
                updateBasicInfoStateByProperty("pnum", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Problem Title"
              onChange={(e) =>
                updateBasicInfoStateByProperty("title", e.target.value)
              }
            />
            <select
              onChange={(e) =>
                updateBasicInfoStateByProperty("difficulty", e.target.value)
              }
            >
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </div>
        </div>
        <div className="overview-container">
          <div className="admin-section-titles">Description:</div>
          <textarea
            className="overview"
            cols="30"
            rows="10"
            placeholder="OverView"
            onChange={(e) => {
              basicProblemInfo.description.overview = e.target.value;
              setBasicProblemInfo(basicProblemInfo);
            }}
          ></textarea>
          <div className="admin-section-titles">Examples</div>
          <div className="admin-section-container">
            <div className="absolute-top">
              <label htmlFor="Num of example templates">
                Add Example Template
              </label>
              <button
                onClick={() => {
                  if (numOfExamples < 5) {
                    setNumOfExamples(numOfExamples + 1);
                  }
                }}
                className="submit-button"
              >
                +
              </button>
              <button
                onClick={() => {
                  if (numOfExamples > 0) {
                    setNumOfExamples(numOfExamples - 1);
                  }
                }}
                className="submit-button"
              >
                -
              </button>
            </div>
            {numOfExamples > 0 ? getExampleTemplate() : ""}
          </div>
        </div>
        <div className="admin-test-cases">
          <div className="admin-section-titles">TestCases:</div>
          <input
            type="text"
            placeholder="CASE 0"
            onChange={(e) =>
              updateBasicInfoStateByProperty("testCases", e.target.value, 0)
            }
          />
          <input
            type="text"
            placeholder="CASE 1"
            onChange={(e) =>
              updateBasicInfoStateByProperty("testCases", e.target.value, 1)
            }
          />
          <input
            type="text"
            placeholder="CASE 2"
            onChange={(e) =>
              updateBasicInfoStateByProperty("testCases", e.target.value, 2)
            }
          />
        </div>
      </div>
      <div className="admin-section-titles">BoilerPlates and TestCode</div>
      <div className="admin-editor-container-section ">
        {LANGUAGES.map((lang, index) => {
          return (
            <div key={index} className="boiler-and-test-container">
              <div className="admin-boiler-monaco-editor">
                <Editor
                  key={index}
                  defaultLanguage={lang}
                  getCodeInfo={updateBoilerPlateCode}
                />
              </div>
              <div key={index} className="admin-test-monaco-editor">
                <Editor
                  key={index}
                  defaultLanguage={lang}
                  getCodeInfo={updateTestCode}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="admin-section-titles">Submission Test Code</div>
      {LANGUAGES.map((lang, index) => {
        return (
          <div key={"key" + index} className="admin-submission-container">
            <div>
              <div key={index} className="admin-submission-monaco-editor">
                <Editor
                  id={index}
                  defaultLanguage={lang}
                  getCodeInfo={updateSubmissionTestCode}
                />
              </div>
            </div>
          </div>
        );
      })}
      <div className="admin-section-titles">UPLOAD PROBLEM</div>
      <div id="upload-message" className="upload-message display-flex-center">
        <button className="submit-button" onClick={handleProblemSubmit}>
          Upload
        </button>
      </div>
    </div>
  );
}

export default ProblemComposer;
