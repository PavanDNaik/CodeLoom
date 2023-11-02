import React from "react";
import { Link } from "react-router-dom";
function Question({ pnum, title, difficulty }) {
  return (
    <div className="question">
      <div>{pnum}</div>
      <Link to={"/problems/" + title.replaceAll(" ", "-")}>
        <div>{title}</div>
      </Link>
      <div>{difficulty}</div>
    </div>
  );
}

export default Question;
