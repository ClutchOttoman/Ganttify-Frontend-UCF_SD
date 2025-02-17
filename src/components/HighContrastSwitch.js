import React, { useContext } from "react";
import { HighContrastModeContext } from "./HighContrastModeContext"; // Correct import
import "./HighContrastSwitch.css";

function HighContrastSwitch() {
  const { isHighContrastMode, toggleHighContrastMode } = useContext(HighContrastModeContext);

  return (
    <label className="switch-high-contrast">
      <input
        type="checkbox"
        checked={isHighContrastMode}
        onChange={toggleHighContrastMode} // toggles high contrast mode
      />
      <span className="sliderhigh round"></span>
    </label>
  );
}

export default HighContrastSwitch;
