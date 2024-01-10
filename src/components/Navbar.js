import React, { useState } from "react";
import { Link } from "react-router-dom";
import Profile from "./Profile";
import moonImg from "../images/dark-mode.svg";
import sunImg from "../images/light-mode.svg";

function Navbar({ userName }) {
  const [active, setActive] = useState("");
  const [themeImg, setThemeImg] = useState(
    getCurrentTheme() === "light-mode" ? moonImg : sunImg
  );

  function getCurrentTheme() {
    if (document.body.classList.contains("light-mode")) {
      return "light-mode";
    } else return "dark-mode";
  }

  function handleThemeChange() {
    if (getCurrentTheme() === "light-mode") {
      document.body.classList.remove("light-mode");
      setThemeImg(sunImg);
    } else {
      document.body.classList.add("light-mode");
      setThemeImg(moonImg);
    }
  }
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
        <li>{getLink("Problems", "/home/problems")}</li>
        <li>{getLink("Aptitude", "/home/aptitude")}</li>
        <li>
          <img
            src={themeImg}
            alt=""
            className="switch-theme-icon"
            onClick={handleThemeChange}
          />
        </li>
        <li>
          <Profile userName={userName} />
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
