import React, { useContext } from "react";
import { DarkModeContext } from "./DarkModeContext"; // Correct import
import "./DarkModeSwitch.css";

function DarkModeSwitch() {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext); // Use correct context values

  return (
    <label className="switch">
      <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
      <span className="slider round"></span>
    </label>
  );
}

export default DarkModeSwitch;

