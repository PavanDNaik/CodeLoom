import React from "react";

function Description({ pnum, title, description }) {
  return (
    <div className="problem-info split-pane-layoutCSS">
      <h3 className="problem-title">
        {pnum}. {title}
      </h3>
      <pre className="problem-discrption">
        <h4 className="problem-overview">
          {description && description.overview}
        </h4>
        {description &&
          description.examples.map((value, index) => {
            return (
              <div key={index} className="examples">
                <p>EXAMPLE {index + 1}:</p>
                <pre className="example-overview">{value}</pre>
              </div>
            );
          })}
      </pre>
      <div className="problem-examples"></div>
    </div>
  );
}

export default Description;
