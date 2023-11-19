import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import js_logo from "../images/js_logo.png";
import python_logo from "../images/python_logo.png";
import css_logo from "../images/css_logo.png";
import cpp_logo from "../images/cpp_logo.png";
import go_logo from "../images/go_logo.png";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page-container">
      <img
        src={go_logo}
        alt=""
        className="background-coding-logos background-coding-logos-1"
      />
      <img
        src={python_logo}
        alt=""
        className="background-coding-logos background-coding-logos-2"
      />
      <img
        src={cpp_logo}
        alt=""
        className="background-coding-logos background-coding-logos-3"
      />
      <img
        src={css_logo}
        alt=""
        className="background-coding-logos background-coding-logos-4"
      />
      <img
        src={js_logo}
        alt=""
        className="background-coding-logos background-coding-logos-5"
      />
      <div className="landing-title street-light-effect">
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

      <div className="landing-sign-up-buttons">
        <button
          onClick={() => navigate("/sign-up")}
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
    </div>
  );
}

export default Landing;
