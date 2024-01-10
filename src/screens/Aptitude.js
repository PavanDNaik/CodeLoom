import React, { useEffect, useState } from "react";
import { AptitudeTree } from "../structures/aptitudeTree";
import AptiType from "../components/AptiType";
import AptiQuestion from "../components/AptiQuestion";
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
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [index, setIndex] = useState(0);
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
      if (qs?.length) {
        setQuestions([...qs]);
        setCurrentQuestion(qs[0]);
        setIndex(0);
      } else {
        setQuestions([]);
      }
      setIndex(0);
    });
  }, [currentCatagory]);

  useEffect(() => {
    if (questions && questions.length) {
      if (questions.length <= index) {
        alert("You have completed all the questions");
        setIndex(0);
      } else {
        setCurrentQuestion(questions[index]);
      }
    }
  }, [index]);

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
        <div className="apti-question-container">
          <AptiQuestion question={currentQuestion?.quetion} number={index} />
          <button
            className="fixed-right-bottom run-button"
            onClick={() => setIndex(index + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Aptitude;
