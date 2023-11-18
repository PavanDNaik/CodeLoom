import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="landing-page-container ">
      <div className="landing-title street-light-effect">CODE LOOM</div>
      <button onClick={() => navigate("/sign-up")} style={{ float: "right" }}>
        SIGN-UP
      </button>
    </div>
  );
}

export default Landing;
