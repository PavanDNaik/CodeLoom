import React from "react";

function Description({ pnum, title, description }) {
  return (
    <div className="problem-info split-pane-layoutCSS">
      <h3 className="problem-title">
        {pnum}. {title}
      </h3>
      <pre className="problem-discrption">
        <h4>{description && description.overview}</h4>
        {description &&
          description.examples.map((value, index) => {
            return (
              <pre key={index}>
                <p>EXAMPLE {index + 1}:</p>
                {value}
              </pre>
            );
          })}
      </pre>
      <div className="problem-examples"></div>
    </div>
  );
}

export default Description;
