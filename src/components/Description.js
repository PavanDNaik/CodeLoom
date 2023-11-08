import React from "react";

function Description({ pnum, title, description }) {
  return (
    <div className="problem-info split-pane-layoutCSS">
      <h3 className="problem-title">
        {pnum}. {title}
      </h3>
      <pre className="problem-discrption">{description}</pre>
      <div className="problem-examples"></div>
    </div>
  );
}

export default Description;
