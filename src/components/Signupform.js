import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/login.css";
function Signupform() {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function handleSignUp() {
    const result = await fetch("http://localhost:5000/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    const data = await result.json();
    if (data.errors) {
      setError(data.errors);
    } else {
      setError("");
      localStorage.setItem("user", JSON.stringify(data.msg));
    }
  }
  return (
    <div className="log-in">
      <div>{error}</div>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Enter the name"
        onChange={(e) => setName(e.target.value)}
      />
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
      <input
        type="password"
        name="confirm-password"
        id="consirm-password"
        placeholder="confirm passworld"
      />
      <button
        onClick={(e) => {
          handleSignUp(e);
        }}
      >
        submit
      </button>
      <div>
        Already have an account?
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default Signupform;
