import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/landing.css";
function Landing() {
  const navigate = useNavigate();
  const [logged, setLogged] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("user")) {
      setLogged(true);
    }
  }, []);
  return (
    <div className="landing-page-container">
      <div className="landing-title">
        CODE <div className="landing-title-part2">LOOM</div>
      </div>
      <div>
        <div className="typing-text">
          <h3>A New Way to Learn</h3>
          <h2 id="type-h2" className="typing-text-h2">
            Explore and expand your skills
          </h2>
          <p>
            If you're passionate about taking on some of the most captivating
            challenges, you've found the perfect space.
          </p>
          <button
            onClick={() => navigate("/sign-up")}
            className="landing-get-started"
          >
            Let's Get Started
          </button>
        </div>
      </div>

      {logged ? (
        <div className="landing-sign-up-buttons">
          <button onClick={() => navigate("/home")} className="landing-sign-up">
            Already Logged In
          </button>
        </div>
      ) : (
        <div className="landing-sign-up-buttons">
          <button
            onClick={() => navigate("/login")}
            className="landing-sign-in"
          >
            Sign-In
          </button>
          <button
            onClick={() => navigate("/sign-up")}
            className="landing-sign-up"
          >
            Sign-Up
          </button>
        </div>
      )}
    </div>
  );
}

export default Landing;
