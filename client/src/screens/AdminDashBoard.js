import React, { useEffect, useState } from "react";
import { Link, Routes, Route, useParams } from "react-router-dom";
import Profile from "../components/Profile";
import ProblemComposer from "../components/ProblemComposer";
import ProblemRefiner from "../components/ProblemRefiner";
import Notification from "../components/Notification";
function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}
function checkAuth() {
  if (localStorage.getItem("adminAuthToken")) {
    return true;
  } else {
    return false;
  }
}
function AdminDashBoard() {
  const { admin } = useParams();
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(checkAuth);
  useEffect(() => {
    setUser(getUser());
  }, []);
  return auth ? (
    <div>
      <ul className="navbar-list no-animation">
        <li>
          <Link to={`/admin/${admin}/dashboard/addProblem`}>Add problem</Link>
        </li>
        <li>
          <Link to={`/admin/${admin}/dashboard/editProblem`}>Edit Problem</Link>
        </li>
        <li>
          <Link to={`/admin/${admin}/dashboard/Notification`}>
            Notification
          </Link>
        </li>
        <li>
          <Profile userName={user} />
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
  ) : (
    <div>Page not found</div>
  );
}

export default AdminDashBoard;
