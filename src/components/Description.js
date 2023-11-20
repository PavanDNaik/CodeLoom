import React from "react";

function Description({ pnum, title, description }) {
  return (
    <div className="problem-info split-pane-layoutCSS">
      <h3 className="problem-title">
        {pnum}. {title}
      </h3>
      <div className="problem-descrption">
        <h4 className="problem-overview">
          {description && description.overview}
        </h4>
        {description &&
          description.examples.map((value, index) => {
            return (
              <div key={index} className="examples">
                <h4>EXAMPLE {index + 1}:</h4>
                <p className="example-overview">{value}</p>
              </div>
            );
          })}
      </div>
      <div className="problem-examples"></div>
    </div>
  );
}

export default Description;
