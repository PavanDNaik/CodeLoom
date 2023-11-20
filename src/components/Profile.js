import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import logoutSVG from "../images/log-out.svg";
import profilSVG from "../images/profile.svg";
function Profile({ name }) {
  const [logout, setLogout] = useState(false);
  function handleLogOut() {
    localStorage.clear();
    setLogout(true);
  }
  return (
    <div>
      {logout && <Navigate to="/" replace={true} state={""}></Navigate>}
      <div
        onClick={(e) => {
          document.getElementById("profile").classList.toggle("display-none");
        }}
        className="profile-icon-div"
      >
        <img src={profilSVG} alt="Profile" />
      </div>
      <div className="display-none drop-down-profile-info" id="profile">
        <h3>{name}</h3>
        <div
          className="log-out-profile"
          onClick={(e) => {
            handleLogOut();
          }}
        >
          <div>log-out</div>
          <img src={logoutSVG} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Profile;
