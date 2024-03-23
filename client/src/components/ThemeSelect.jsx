import React, { useCallback } from "react";
import { useRecoilState } from "recoil";
import { ThemeAtom } from "../store/atoms/theme";
import moonImg from "../images/dark-mode.svg";
import sunImg from "../images/light-mode.svg";

function ThemeSelect() {
  const [themeAtom, setThemeAtom] = useRecoilState(ThemeAtom);

  const handleThemeChange = useCallback((theme) => {
    if (theme === "DARK") {
      setThemeAtom("LIGHT");
    } else {
      setThemeAtom("DARK");
    }
  }, []);

  return (
    <div>
      <img
        src={themeAtom == "DARK" ? sunImg : moonImg}
        alt=""
        className="switch-theme-icon"
        onClick={() => handleThemeChange(themeAtom)}
      />
    </div>
  );
}

export default ThemeSelect;
