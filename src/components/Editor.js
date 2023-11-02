import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("python");
  const [testResult, setTestResult] = useState("");
  const [problemInfo, setProblemInfo] = useState({});
  const problemId = useParams();
  useEffect(() => {
    getProblemInfo(problemId).then((data) => {
      console.log(data);
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
      }),
    }).catch((err) => {
      console.log(err);
    });
    if (!result) return;
    const output = await result.json();
    setTestResult(output);
    e.target.disable = false;
  }

  return (
    <div className="problem-editor-interface flex-row">
      <div className="problem-info">
        <div className="problem-title">{problemInfo.title}</div>
        <pre className="problem-discrption">{problemInfo.discription}</pre>
        <div className="problem-examples"></div>
      </div>
      <div className="editor-container flex-column">
        <select
          onChange={(e) => {
            setLang(e.target.value);
          }}
        >
          <option value="python">python</option>
          <option value="java">java</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
        </select>
        <textarea
          style={{ width: "300px", height: "400px", border: "1px solid black" }}
          onChange={(e) => setCode(e.target.value)}
          className="editor"
        ></textarea>
        <button onClick={async (e) => await handleRun(e)}>run</button>
        <button>submit</button>
        <pre className="editor-testresult">{testResult}</pre>
      </div>
    </div>
  );
}

export default Editor;
