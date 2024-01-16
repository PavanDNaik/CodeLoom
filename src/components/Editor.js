import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import codeIcon from "../images/editor-icons/code-icon.png";
function Editor({ getCodeInfo, problemInfo, defaultLanguage }) {
  const [theme, setTheme] = useState("vs-dark");
  const [lang, setLang] = useState(
    defaultLanguage ? defaultLanguage : "python"
  );

  function handleChange(code) {
    getCodeInfo(code, lang);
  }

  return (
    <>
      <div className="editor-header">
        <div className="tab-buttons">
          <img src={codeIcon} alt="o" className="editor-medium-icons" />
          <span>Code</span>
        </div>
      </div>
      <div className="editor-config-selects">
        {!defaultLanguage ? (
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
            {/* <option value="cpp">C++</option> */}
          </select>
        ) : (
          <div className="default-language">Default: {defaultLanguage}</div>
        )}

        <select
          onChange={(e) => {
            setTheme(e.target.value);
          }}
        >
          <option value="vs-dark" disabled hidden selected>
            Theme
          </option>
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
          value={
            problemInfo && problemInfo.boilerPlate
              ? problemInfo.boilerPlate[lang]
              : ""
          }
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
