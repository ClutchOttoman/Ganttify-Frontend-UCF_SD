import React from "react";
import useDarkMode from './useDarkMode';
import useHighContrastMode from './useHighContrastMode';
import './UIsettings.css'
import dashboard_preview from '../Images/assets/setting_previews/dashboard_preview.svg';
import timetable_preview from '../Images/assets/setting_previews/timetable_preview.svg';

const UISettings = () => {
    const [isDarkMode, setIsDarkMode] = useDarkMode();
    const [isHighContrastMode, setIsHightContrastMode] = useHighContrastMode();
    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => {
          if (!prevMode) {
            setIsHightContrastMode(false); // Turn off High Contrast Mode if it's on
          }
          return !prevMode;
        });
      };
  
      const toggleHighContrastMode = () => {
        setIsHightContrastMode((prevMode) => {
          if (!prevMode) {
            setIsDarkMode(false); // Turn off Dark Mode if it's on
          }
          return !prevMode;
        });
      };
      
    return(
        <div class="settings-container">
          {/* Color Settings Container */}
            <div class="color-preset-container">
            <h1>Preset Color Options:</h1>
                <div class="default-colorbar">
                        <button
                            onClick={toggleDarkMode}
                            className={`dark-mode-toggle ${isDarkMode ? "dark" : ""}`}
                            aria-label="Toggle dark mode"
                        >
                            <div className="thumb"></div>
                        </button>
                        <span>Dark Mode</span>
                        <button
                            onClick={toggleHighContrastMode}
                            className={`high-contrast-mode-toggle ${isHighContrastMode ? "high-contrast" : ""}`}
                            aria-label="Toggle high-contrast mode"
                        >
                            <div className="thumb"></div> 
                        </button>
                        <span>High Contrast</span>
                </div>
            </div>

            {/* Color UI Preview Container */}
            <div class="ui-preview-container">
            <h1>
            Color UI Preview: 
              <span className="normal-text">
                  Prototype colorblind UI is not calculated in realtime. This uses the Brettel 1997 method from  
                  <a href="https://daltonlens.org/colorblindness-simulator" target="_blank" rel="noopener noreferrer">daltonlens.org</a> 
                  for a mock-up CVD preview of tritanopia.
              </span>
            </h1>

              {/* This is the container for the preview images */}
              <div className="imgs-container">
                  <img src={dashboard_preview} className="dashboardimg"/>
                  <img src={timetable_preview}  className="timetableimg"/>
              </div>
            </div>

            {/* CVD Filter Preview Container */}
            <div class="font-container">
            <h1>Font Options:</h1>
            </div>
        </div>
    )
}

export default UISettings