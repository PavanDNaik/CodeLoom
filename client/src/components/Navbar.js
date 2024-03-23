import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Profile from "./Profile";
import ThemeSelect from "./ThemeSelect";

function Navbar({ userName }) {
  const [active, setActive] = useState("");
  const [bg, setBg] = useState("");
  const route = useLocation();

  useEffect(() => {
    if (route.pathname === "/home") {
      setBg("Black-bg");
    } else if (route.pathname == "/home/aptitude") {
      setBg("apti-color");
    } else {
      setBg("");
    }
  }, [route]);

  const getLink = useCallback(
    (value, to) => {
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
    },
    [active]
  );

  return (
    <div className="navbar">
      <ul className={`${bg} navbar-list`}>
        <li>{getLink("Home", "/home")}</li>
        <li>{getLink("Problems", "/home/problems")}</li>
        <li>{getLink("Aptitude", "/home/aptitude")}</li>
        <li>
          <ThemeSelect />
        </li>
        <li>
          <Profile userName={userName} />
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
