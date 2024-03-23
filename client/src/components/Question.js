import React from "react";
import { Link, useNavigate } from "react-router-dom";
function Question({ pnum, title, difficulty, token }) {
  const navigate = useNavigate();
  return (
    <div
      className="question"
      onClick={() => {
        navigate(token ? "/problems/" + title.replaceAll(" ", "-") : "/login");
      }}
    >
      <div>{pnum}</div>
      <Link to={token ? "/problems/" + title.replaceAll(" ", "-") : "/login"}>
        <div>{title}</div>
      </Link>
      <div className={difficulty}>{difficulty}</div>
    </div>
  );
}

export default Question;
