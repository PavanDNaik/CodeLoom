import { atom } from "recoil";
export const ThemeAtom = atom({
  key: "ThemeAtom",
  default: "DARK",
  effects: [
    ({ onSet }) => {
      onSet((theme) => {
        console.log(theme);
        if (theme === "DARK") {
          document.body.classList.remove("light-mode");
        } else {
          document.body.classList.add("light-mode");
        }
      });
    },
  ],
});
