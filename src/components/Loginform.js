import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import "../css/login.css";
function Loginform() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function handleLogin() {
    const result = await fetch("http://localhost:5000/log-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await result.json();
    if (!data.errors && data.msg) {
      setError("");
      localStorage.setItem("user", JSON.stringify(data.msg));
      navigate(data.route);
    } else {
      setError(data.errors);
    }
  }
  return (
    <div className="log-in">
      <div>{error}</div>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Enter the email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Enter the passworld"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={async (e) => {
          await handleLogin(e);
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
