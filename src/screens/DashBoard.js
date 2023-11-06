import React from "react";
import { useNavigate } from "react-router-dom";

function DashBoard() {
  const navigate = useNavigate();

  return (
    <div>
      DashBoard
      <button onClick={() => navigate("/sign-up")}>Sign-up</button>
      <button onClick={() => navigate("/home")}>Preview</button>
    </div>
  );
}

export default DashBoard;
