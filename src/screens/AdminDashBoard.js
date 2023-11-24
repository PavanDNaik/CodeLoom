import React, { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Profile from "../components/Profile";
import ProblemComposer from "../components/ProblemComposer";
import ProblemRefiner from "../components/ProblemRefiner";
import Notification from "../components/Notification";
function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}
function AdminDashBoard() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    setUser(getUser());
  }, []);
  return (
    <div>
      <ul className="navbar-list no-animation">
        <li>
          <Link to="./addProblem">Add problem</Link>
        </li>
        <li>
          <Link to="./editProblem">Edit Problem</Link>
        </li>
        <li>
          <Link to="./Notification"> Notification</Link>
        </li>
        <li>
          <Profile userName={user?.userName} />
        </li>
      </ul>
      <div className="admin-working-container">
        <Routes>
          <Route exact path="/addProblem" element={<ProblemComposer />}></Route>
          <Route exact path="/editProblem" element={<ProblemRefiner />}></Route>
          <Route exact path="/Notification" element={<Notification />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashBoard;
