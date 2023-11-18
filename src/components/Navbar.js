import React, { useState } from "react";
import { Link } from "react-router-dom";
import Profile from "./Profile";

function Navbar({ userName }) {
  const [active, setActive] = useState("Home");
  function getLink(value, to) {
    return (
      <Link
        to={to}
        className={active === value ? "active-navbar-elements" : ""}
        onClick={() => {
          setActive(value);
        }}
      >
        {value}
      </Link>
    );
  }

  return (
    <div className="navbar">
      <ul className="navbar-list">
        <li>{getLink("Home", "/home")}</li>
        <li>{getLink("Problems", "./problems")}</li>
        <li>{getLink("Contact", "./contact")}</li>
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
