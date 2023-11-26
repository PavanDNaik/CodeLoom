import React from "react";
import { Link } from "react-router-dom";
function Question({ pnum, title, difficulty, user }) {
  return (
    <div className="question">
      <div>{pnum}</div>
      <Link to={user ? "/problems/" + title.replaceAll(" ", "-") : "/login"}>
        <div>{title}</div>
      </Link>
      <div className={difficulty}>{difficulty}</div>
    </div>
  );
}

export default Question;
