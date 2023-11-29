import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import "../css/login.css";
function Loginform() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [verifying, setVerifying] = useState(false);
  const FETCH_BASE_URI =
    process.env.REACT_APP_FETCH_BASE_URL || "http://localhost:3000";
  async function handleLogin(e) {
    if (userData.email === "" || userData.password === "") {
      setError("Fill the Form");
      return;
    }
    e.target.textContent = "Verifying..";
    setVerifying(true);
    const result = await fetch(`${FETCH_BASE_URI}/log-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });
    const data = await result.json();
    if (!data.errors && data.msg) {
      setError("");
      localStorage.setItem("user", JSON.stringify(data.msg));
      navigate(data.route);
    } else {
      setError(data.errors);
      setVerifying(false);
      e.target.textContent = "Log-In";
    }
  }

  function updateUserDate(property, value) {
    setUserData((prev) => {
      return { ...prev, [property]: value };
    });
  }
  return (
    <div className="log-in-container">
      <div className="log-in">
        <div className="log-in-title">Log-In</div>
        <div>Welcome Back</div>
        <div className={`error-message ${error === "" ? "hide-message" : ""}`}>
          {error + "  !!"}
        </div>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter the email"
          className="sign-in-input"
          value={userData.email}
          onChange={(e) => updateUserDate("email", e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter the passworld"
          className="sign-in-input"
          value={userData.password}
          onChange={(e) => updateUserDate("password", e.target.value)}
          required
        />
        <button
          onClick={async (e) => {
            await handleLogin(e);
          }}
          className={`log-in-button ${verifying ? "blinking-item" : ""}`}
        >
          Log-In
        </button>
        <div className="link-to-other-method">
          Are you a new user?
          <Link to="/Sign-up">Sign-up</Link>
        </div>
      </div>
    </div>
  );
}

export default Loginform;
