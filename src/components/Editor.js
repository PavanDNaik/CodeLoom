import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import Description from "./Description";
import Submision from "./Submision";

//fetch problem
async function getProblemInfo({ problemId }) {
  const problemInfoString = await fetch(
    `http://localhost:5000/problems/${problemId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const problemInfoObject = await problemInfoString
    .json()
    .catch((err) => console.log(err));
  return { ...problemInfoObject.problemInfo };
}

function Editor() {
  //editor and problem hooks
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("python");
  const [theme, setTheme] = useState("vs-dark");
  const [problemInfo, setProblemInfo] = useState({});
  const [submitionOrInfo, setSubmitionOrInfo] = useState("info");

  //output - hooks
  const [testResult, setTestResult] = useState("");
  const [caseOrResult, setCaseOrResult] = useState(false);

  //split-pane
  const [bodySizes, setBodySizes] = useState([100, "10%", "auto"]);
  const [editorSizes, setEditorSizes] = useState([100, "10%", "auto"]);
  const problemId = useParams();

  useEffect(() => {
    getProblemInfo(problemId).then((data) => {
      setProblemInfo({ ...data });
    });
  }, [problemId]);

  async function handleRun(e) {
    e.target.disable = true;
    const result = await fetch("http://localhost:5000/run", {
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
      console.log(err);
    });
    if (!result) return;
    const output = await result.json();
    setCaseOrResult && setCaseOrResult(true);
    setTestResult(output);
    e.target.disable = false;
  }

  async function handleSubmit(e) {
    e.target.disable = true;
    const user = JSON.parse(localStorage.getItem("user"));
    const result = await fetch("http://localhost:5000/submit", {
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
      console.log(err);
    });
    if (!result) return;
    const output = await result.json();
    setCaseOrResult && setCaseOrResult(true);
    setTestResult(output);
    e.target.disable = false;
  }

  return (
    <div className="coding-interface">
      <SplitPane split="vertical" sizes={bodySizes} onChange={setBodySizes}>
        <Pane minSize={50} maxSize="70%">
          <div className="description-submission-container">
            <div>
              <button
                onClick={() => {
                  if (submitionOrInfo === "sub") {
                    setSubmitionOrInfo("info");
                  }
                }}
              >
                Description
              </button>
              <button
                onClick={() => {
                  if (submitionOrInfo === "info") {
                    setSubmitionOrInfo("sub");
                  }
                }}
              >
                Submissions
              </button>
            </div>
            {submitionOrInfo === "info" ? (
              <Description {...problemInfo} />
            ) : (
              <Submision />
            )}
          </div>
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
              <div className="editor-config-selects">
                <select
                  onChange={(e) => {
                    setLang(e.target.value);
                    if (problemInfo.boilerPlate) {
                      setCode(problemInfo.boilerPlate[e.target.value]);
                    }
                  }}
                >
                  <option value="python">python</option>
                  <option value="java">java</option>
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                </select>
                <select
                  onChange={(e) => {
                    setTheme(e.target.value);
                  }}
                >
                  <option value="vs-dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div className="codeEditor">
                <MonacoEditor
                  value={
                    problemInfo.boilerPlate ? problemInfo.boilerPlate[lang] : ""
                  }
                  language={lang}
                  theme={theme}
                  resizerSize={5}
                  onChange={(value) => setCode(value)}
                />
              </div>
            </Pane>

            <div className="result-test-case-container split-pane-layoutCSS ">
              <div className="stick-top-of-container">
                <div>
                  <button
                    onClick={() => caseOrResult && setCaseOrResult(false)}
                  >
                    TestCase
                  </button>
                  <button
                    onClick={() => !caseOrResult && setCaseOrResult(true)}
                  >
                    TestResult
                  </button>
                </div>
                <div>
                  <button onClick={async (e) => await handleRun(e)}>run</button>
                  <button onClick={async (e) => await handleSubmit(e)}>
                    submit
                  </button>
                </div>
              </div>
              {caseOrResult ? (
                <div className="output-section-container">
                  <pre className="editor-testresult">{testResult}</pre>
                </div>
              ) : (
                <div className="Test-cases-caontainer">
                  {problemInfo.testCases &&
                    problemInfo.testCases.map((val, index) => {
                      return (
                        <pre key={index}>
                          <h4>CASE {index}</h4>
                          {`${val}`}
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

export default Editor;
