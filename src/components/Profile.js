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
      <h3>{name}</h3>
      <button onClick={() => handleLogOut()}>log-out</button>
    </div>
  );
}

export default Profile;
