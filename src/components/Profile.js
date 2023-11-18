import React, { useState } from "react";
import { Navigate } from "react-router-dom";

function Profile({ name }) {
  const [logout, setLogout] = useState(false);
  function handleLogOut() {
    localStorage.clear();
    setLogout(true);
  }
  return (
    <div>
      {logout && <Navigate to="/" replace={true} state={""}></Navigate>}
      <button
        onClick={(e) => {
          document.getElementById("profile").classList.toggle("display-none");
        }}
      >
        Profile
      </button>
      <div className="display-none drop-down-profile-info" id="profile">
        <h3>{name}</h3>
        <button
          onClick={(e) => {
            handleLogOut();
          }}
        >
          log-out
        </button>
      </div>
    </div>
  );
}

export default Profile;
