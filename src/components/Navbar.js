import React from "react";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <div>
      <ul className="flex">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/">Problems</Link>
        </li>
        <li>
          <Link to="/">Contest</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
