import React, { useState } from "react";
import AptiCatagory from "./AptiCatagory";

function AptiType({ type, updateCurrentType, updateCurrentCatagory }) {
  const [clicked, setClicked] = useState(false);
  return (
    <div className="apti-type">
      <div className="apti-type-heading">
        <button
          className="explorer-button"
          onClick={() => setClicked(!clicked)}
        >
          {clicked ? "-" : "+"}
        </button>
        <h2>{type.typeName}</h2>
      </div>
      <div className="apti-catagory">
        {clicked
          ? type.catagory.map((cat, i) => {
              return (
                <AptiCatagory
                  key={i}
                  cat={cat}
                  typeName={type.typeName}
                  updateCurrentType={updateCurrentType}
                  updateCurrentCatagory={updateCurrentCatagory}
                />
              );
            })
          : ""}
      </div>
    </div>
  );
}

export default AptiType;
