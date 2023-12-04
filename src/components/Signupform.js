import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/login.css";
const FETCH_BASE_URI =
  process.env.REACT_APP_FETCH_BASE_URL || "http://localhost:3000";
function Signupform() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  async function handleSignUp(e) {
    if (
      userData.name === "" ||
      userData.email === "" ||
      userData.password === "" ||
      userData.confirmPassword === ""
    ) {
      setError("Fill The Form");
      return;
    } else if (userData.password !== userData.confirmPassword) {
      setError("Please Confirm Your Password");
      return;
    }
    e.target.textContent = "Verifying...";
    setVerifying(true);
    const result = await fetch(`${FETCH_BASE_URI}/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      }),
    });
    const data = await result.json();
    if (!data.errors && data.token) {
      setError("");
      localStorage.setItem("user", JSON.stringify(data.userName));
      localStorage.setItem("authToken", JSON.stringify(data.token));
      navigate(data.route);
    } else {
      e.target.textContent = "Sign-Up";
      setError("Server Error");
      setVerifying(false);
    }
  }

  function updateUserData(property, value) {
    setUserData((prev) => {
      return { ...prev, [property]: value };
    });
  }
  return (
    <div className="log-in-container">
      <div className="log-in">
        <div className="log-in-title">Sign-Up</div>
        <img
          src="https://gifdb.com/images/high/namaste-ji-indian-girl-cartoon-bowing-c0obxpysirk3iebw.gif"
          width="100px"
          height="80px"
          alt=""
        ></img>
        <div className={`error-message ${error === "" ? "hide-message" : ""}`}>
          {error + " !!"}
        </div>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter the name"
          className="sign-in-input"
          value={userData.name}
          onChange={(e) => updateUserData("name", e.target.value)}
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter the email"
          className="sign-in-input"
          value={userData.email}
          onChange={(e) => updateUserData("email", e.target.value)}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter the password"
          className="sign-in-input"
          value={userData.password}
          onChange={(e) => updateUserData("password", e.target.value)}
        />
        <input
          type="password"
          name="confirm-password"
          id="consirm-password"
          placeholder="confirm password"
          className="sign-in-input"
          value={userData.confirmPassword}
          onChange={(e) => updateUserData("confirmPassword", e.target.value)}
        />
        <button
          onClick={(e) => {
            handleSignUp(e);
          }}
          className={`log-in-button ${verifying ? "blinking-item" : ""}`}
        >
          Sign-Up
        </button>
        <div className="link-to-other-method">
          Already have an account?
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Signupform;
