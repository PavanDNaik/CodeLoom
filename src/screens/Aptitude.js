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
  const storedData = sessionStorage.getItem(`/${type}/${catagory}`);
  if (storedData) {
    return JSON.parse(storedData);
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
        sessionStorage.setItem(
          `/${currentType}/${currentCatagory}`,
          JSON.stringify(qs)
        );
        console.log(...qs);
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
    <div className="aptitude">
      <div className="apti-top-headers">
        <div>Chose Catagory</div>
        <div>Questions</div>
        <div></div>
      </div>
      <div className="apti-vs-container">
        <div className="apti-explorer">
          {explore?.map((type, i) => {
            return (
              <AptiType
                key={i}
                type={type}
                catagory={currentQuestion?.catagoryName}
                updateCurrentType={updateCurrentType}
                updateCurrentCatagory={updateCurrentCatagory}
              />
            );
          })}
        </div>
        <div className="apti-question-container">
          <AptiQuestion
            question={currentQuestion?.quetion}
            catagory={currentQuestion?.catagoryName}
            number={index}
          />
          {currentQuestion ? (
            <button
              className="fixed-right-bottom run-button"
              onClick={() => setIndex(index + 1)}
            >
              Next
            </button>
          ) : (
            <div className="no-question-selected">
              <h1>Welcome to our Aptitude Test Page!</h1>
              <br></br>
              <p>
                We're delighted to have you here as you embark on the journey of
                exploring and assessing your skills and abilities. This Aptitude
                Test is designed to help you uncover your strengths, identify
                areas for improvement, and showcase your potential.
              </p>
              <div className="apti-wel"></div>
              <p>Happy testing!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Aptitude;
