import React, { useState } from "react";
import { Link } from "react-router-dom";
// import "../css/login.css";
function Loginform() {
  const [error, setError] = useState("");
  function handleLogin() {}
  return (
    <div className="log-in">
      <div>{error}</div>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Enter the email"
      />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Enter the passworld"
      />
      <button
        onClick={(e) => {
          handleLogin(e);
        }}
      >
        submit
      </button>

      <div>
        Are you a new user?
        <Link to="/Sign-up">Sign-up</Link>
      </div>
    </div>
  );
}

export default Loginform;
