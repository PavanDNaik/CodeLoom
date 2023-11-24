import React, { useState } from "react";
import Editor from "../components/Editor";
const EXAMPLE_SYNTAX = `
Input: 1, 2
output:3
Explanation: 1 + 2 = 3
`;
const LANGUAGES = ["python", "java", "c"];
function getObjectOfLanguages() {
  let obj = {};
  for (let lang of LANGUAGES) {
    obj[lang] = "";
  }
  return obj;
}

function ProblemComposer() {
  const [numOfExamples, setNumOfExamples] = useState(0);
  const [basicProblemInfo, setBasicProblemInfo] = useState({
    pnum: "",
    title: "",
    difficulty: "easy",
    descrption: "",
    examples: [],
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
    if (numOfExamples > 5) {
      alert("examples should be less then 6");
      return "";
    }
    return (
      <div>
        {Array.from({ length: numOfExamples }, (V, index) => index).map(
          (v, index) => {
            return (
              <textarea
                cols="30"
                rows="10"
                key={index}
                placeholder={EXAMPLE_SYNTAX}
                onChange={(e) => {
                  updateBasicInfoStateByProperty(
                    "examples",
                    e.target.value,
                    index
                  );
                }}
              ></textarea>
            );
          }
        )}
      </div>
    );
  }

  function handleProblemSubmit() {
    const newProblem = {
      ...basicProblemInfo,
      boilerPlate,
      testCode,
      submissionTestCode,
    };
    console.log(newProblem);
    fetch("http://localhost:5000/admin/addProblem", {
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
            document.getElementById("upload-message").textContent =
              data.success;
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
        <div className="admin-section-titles">Problem Number:</div>
        <input
          type="number"
          placeholder="Problem Number"
          onChange={(e) =>
            updateBasicInfoStateByProperty("pnum", e.target.value)
          }
        />
        <div className="admin-section-titles">Title:</div>
        <input
          type="text"
          placeholder="Problem Title"
          onChange={(e) =>
            updateBasicInfoStateByProperty("title", e.target.value)
          }
        />
        <div className="admin-section-titles">Difficulty:</div>
        <select
          onChange={(e) =>
            updateBasicInfoStateByProperty("difficulty", e.target.value)
          }
        >
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
        <div className="admin-section-titles">Description:</div>
        <div>
          <textarea
            cols="30"
            rows="10"
            placeholder="OverView"
            onChange={(e) =>
              updateBasicInfoStateByProperty("descrption", e.target.value)
            }
          ></textarea>
          <div>
            <input
              type="number"
              id="numOfExamples"
              placeholder="num of examples[0<n<5]"
            />
            <button
              onClick={() => {
                setNumOfExamples(
                  document.getElementById("numOfExamples").value
                );
              }}
            >
              Get example template
            </button>
            {numOfExamples > 0 ? getExampleTemplate() : ""}
          </div>
        </div>
        <div className="admin-section-titles">TestCases:</div>
        <div className="admin-test-cases">
          <input
            type="text"
            onChange={(e) =>
              updateBasicInfoStateByProperty("testCases", e.target.value, 0)
            }
          />
          <input
            type="text"
            onChange={(e) =>
              updateBasicInfoStateByProperty("testCases", e.target.value, 1)
            }
          />
          <input
            type="text"
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
          <div key={index} className="admin-submission-container">
            <div>
              <div key={index} className="admin-submission-monaco-editor">
                <Editor
                  key={index}
                  defaultLanguage={lang}
                  getCodeInfo={updateSubmissionTestCode}
                />
              </div>
            </div>
          </div>
        );
      })}
      <div className="admin-section-titles">UPLOAD PROBLEM</div>
      <div id="upload-message" className="upload-message"></div>
      <button className="upload" onClick={handleProblemSubmit}>
        Upload
      </button>
    </div>
  );
}

export default ProblemComposer;
