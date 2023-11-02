import React from "react";
import { Link } from "react-router-dom";
import Profile from "./Profile";

function Navbar({ userName }) {
  return (
    <div className="navbar">
      <ul className="flex">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/problems">Problems</Link>
        </li>
        <li>
          <Link to="/">Contest</Link>
        </li>
        <li>
          {userName ? (
            <Profile name={userName} />
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
