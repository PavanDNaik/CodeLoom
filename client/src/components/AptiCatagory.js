import React from "react";

function AptiCatagory({
  cat,
  typeName,
  updateCurrentType,
  updateCurrentCatagory,
  curCatagory,
}) {
  const handleClick = () => {
    updateCurrentType(typeName);
    updateCurrentCatagory(cat.catagoryName);
  };
  return (
    <div
      className={`apti-categary-header ${
        curCatagory === cat?.catagoryName ? "highlight-apti-cat" : ""
      }`}
      onClick={handleClick}
    >
      <h3>
        <span>{"->"}</span>
        {cat?.catagoryName}
      </h3>
    </div>
  );
}

export default AptiCatagory;
