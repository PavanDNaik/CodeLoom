import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
function Editor({ getCodeInfo, problemInfo }) {
  const [theme, setTheme] = useState("vs-dark");
  const [lang, setLang] = useState("python");

  function handleChange(code) {
    getCodeInfo(code, lang);
  }

  return (
    <>
      <div className="editor-config-selects">
        <select
          onChange={(e) => {
            setLang(e.target.value);
            if (problemInfo.boilerPlate) {
              getCodeInfo(problemInfo.boilerPlate[e.target.value], lang);
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
        {/* options=
        {{
          minimap: {
            enabled: false,
          },
        }} */}
        <MonacoEditor
          value={problemInfo.boilerPlate ? problemInfo.boilerPlate[lang] : ""}
          language={lang}
          theme={theme}
          resizerSize={5}
          onChange={(value) => handleChange(value, lang)}
        />
      </div>
    </>
  );
}

export default Editor;
