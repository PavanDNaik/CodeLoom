import React, { useEffect, useState } from "react";

const getAnswerFromChar = (ch) => {
  return ch?.charCodeAt(0) - 65;
};
function AptiQuestion({ question, number, catagory }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answer, showAnwser] = useState(false);
  const handleVerify = () => {
    if (selectedAnswer === null) {
      alert("select and option!!");
      return;
    }
    if (selectedAnswer == getAnswerFromChar(question?.answer)) {
      alert("correct");
    } else {
      console.log(getAnswerFromChar(question?.answer) + " " + selectedAnswer);
      alert("wrong");
    }
  };
  useEffect(() => {
    setSelectedAnswer(null);
    showAnwser(false);
    console.log(question);
  }, [question]);

  return question ? (
    <div className="apti-question">
      <h1>{catagory}</h1>
      <h2>
        {number >= 0 ? number + 1 : "#"}. {question?.title}
      </h2>
      <div className="apti-option-container">
        {question &&
          question.options?.map((opt, i) => {
            return (
              <div className="apti-option" key={i}>
                <input
                  type="checkbox"
                  name={"answer" + i}
                  id="answer"
                  checked={selectedAnswer === i}
                  onClick={() => {
                    setSelectedAnswer(i);
                  }}
                />
                <span>{opt}</span>
              </div>
            );
          })}
      </div>
      <div className="apti-answer-section">
        <div className="buttons">
          <button className="submit-button" onClick={handleVerify}>
            verify
          </button>
          <button
            className="run-button"
            onClick={() => {
              showAnwser(!answer);
            }}
          >
            {answer ? "hide" : "show"} Answer
          </button>
        </div>
        {answer ? (
          <div className="answer-section">
            <div className="answer">
              {" "}
              <span className="green">Answer</span> :{" "}
              {question && question.answer}
            </div>
            <div className="explain">
              <span className="green">Explanation</span> :{" "}
              {question && question.explain}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  ) : (
    <></>
  );
}

export default AptiQuestion;
