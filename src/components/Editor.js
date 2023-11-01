import React, { useState } from "react";

function Editor() {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("python");
  const [testResult, setTestResult] = useState("");

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
    <div>
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
      ></textarea>
      <button onClick={async (e) => await handleRun(e)}>run</button>
      <pre className="testresult">{testResult}</pre>
    </div>
  );
}

export default Editor;
