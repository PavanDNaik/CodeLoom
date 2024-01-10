import React, { useEffect, useState } from "react";
import { AptitudeTree } from "../structures/aptitudeTree";
import AptiType from "../components/AptiType";
import "../css/apti.css";
const FETCH_BASE_URI =
  process.env.REACT_APP_FETCH_BASE_URL || "http://localhost:5000";
const getAptiQuestions = async (type, catagory) => {
  if (!type || !catagory) {
    return null;
  }
  const response = await fetch(FETCH_BASE_URI + "/aptitude/getQuestions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type,
      catagory,
    }),
  });

  const data = await response.json();
  // console.log(data);
  return data.questions;
};
function Aptitude() {
  const [explore, setExplore] = useState(AptitudeTree);
  const [questions, setQuestions] = useState([]);
  const [currentType, setCurrentType] = useState("");
  const [currentCatagory, setCurrentCatagory] = useState("");
  const updateCurrentType = (type) => {
    setCurrentType(type);
  };
  const updateCurrentCatagory = (cat) => {
    setCurrentCatagory(cat);
  };

  useEffect(() => {
    getAptiQuestions(currentType, currentCatagory).then((qs) => {
      // console.log(qs);
      setQuestions(qs);
    });
  }, [currentCatagory]);
  return (
    <div>
      <div className="apti-vs-container">
        <div className="apti-explorer">
          {explore?.map((type, i) => {
            return (
              <AptiType
                key={i}
                type={type}
                updateCurrentType={updateCurrentType}
                updateCurrentCatagory={updateCurrentCatagory}
              />
            );
          })}
        </div>
        <div className="apti-quetion-container"></div>
      </div>
    </div>
  );
}

export default Aptitude;
