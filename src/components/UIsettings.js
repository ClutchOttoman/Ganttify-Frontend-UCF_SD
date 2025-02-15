import React, { useState, useEffect } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {buildPath} from './buildPath';
import useDarkMode from './useDarkMode';
import useHighContrastMode from './useHighContrastMode';
import './UIsettings.css'
import DashboardPreview  from '../Images/assets/setting_previews/dashboard_preview.svg?react';
import TimetablePreview  from '../Images/assets/setting_previews/timetable_preview.svg?react';


const UISettings = () => {
    const [isDarkMode, setIsDarkMode] = useDarkMode();
    const [isHighContrastMode, setIsHightContrastMode] = useHighContrastMode();
    const [fontStyle, setFontStyle] = useState(() => {
        return localStorage.getItem("fontStyle") || "Inter";
    });
    const [message, setMessage] = useState('');

    //Dynamically changes the image preview svgs
    const backgroundColor = isDarkMode ? "#121212" : isHighContrastMode ? "white" : "white";
    const borderColor = isDarkMode ? "#FFF" : isHighContrastMode ? "#000000 " : "#000000 ";
    const navbarColor = isDarkMode ? "#333" : isHighContrastMode ? "#6B2B00" : "#FDDC87";
    //Dashboard related svgs
    const sideBarColor = isDarkMode ? "#2f2f2f" : isHighContrastMode ? "#f3b35b" : "#DC6B2C";
    const sideBarButtonColor = isDarkMode ? "#424242" : isHighContrastMode ? "#402C12" : "#FFF";
    const viewButtonColor = isDarkMode ? "#2f2f2f"  : isHighContrastMode ? "#002238 " : "#135C91";
    const projectCardColor = isDarkMode ? "#424242" : isHighContrastMode ? "#f3b35b" : "#FDDC87";
    const projectCardBorderColor =  isDarkMode ? "#2f2f2f" : isHighContrastMode ? "#402C12" : "#DC6B2C";
    //Timetable related svgs
    const timetableColor = isDarkMode ? "#222" : isHighContrastMode ? "white" : "white";
    const timetableInnerColor = isDarkMode ? "#333" : isHighContrastMode ?  "#FFF" : "#FFF";
    const timetableBorderColor = isDarkMode ? "#FFF" : isHighContrastMode ? "#000000 " : "#000000 ";
    const gridColor = isDarkMode? "white" : isHighContrastMode ? "black" : "black"

    const toggleDarkMode = async () => {

      // Handles localStorage.
      setIsDarkMode((prevMode) => {
        if (!prevMode) {
          setIsHightContrastMode(false); // Turn off High Contrast Mode if it's on
        }
        return !prevMode;
      });

      const savedUserInfo = localStorage.getItem('user_data');
      const savedUserId = JSON.parse(savedUserInfo)._id; // use user id to query database.
      console.log("Toggling dark mode, savedUserId = " + savedUserId);

      const response = await fetch(buildPath(`api/ui-settings/toggle-default-dark-mode/${savedUserId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok){
        // Set error message here.
        setMessage("Unable to toggle to dark mode");
      } else {
        const message = await response.json();
        setMessage(message);
      }
    };
  
    const toggleHighContrastMode = async () => {

      // Handles localStorage.
      setIsHightContrastMode((prevMode) => {
        if (!prevMode) {
          setIsDarkMode(false); // Turn off Dark Mode if it's on
        }
        return !prevMode;
      });

      const savedUserInfo = localStorage.getItem('user_data');
      const savedUserId = JSON.parse(savedUserInfo)._id; // use user id to query database.
      console.log("Toggling high contrast mode, savedUserId = " + savedUserId);
      const status = response.status;
      const statusText = await response.text()
      console.log("Status of the toggle dark mode" + status);
      console.log("Status of the toggle dark mode" + statusText);

      const response = await fetch(buildPath(`api/ui-settings/toggle-default-high-contrast-mode/${savedUserId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok){
        // Set error message here.
        setMessage("Unable to toggle to high contrast mode");
      } else {
        const message = await response.json();
        setMessage(message);
      }

    };

    // Handles Font Changes
    const handleFontChange = async (event) => {

      // Handle localStorage.
      setFontStyle(event.target.value)
      const selectedFont = event.target.value;
      document.body.style.fontFamily = selectedFont;

      const savedUserInfo = localStorage.getItem('user_data');
      const savedUserId = JSON.parse(savedUserInfo)._id; // use user id to query database.
      console.log("Changing font style, savedUserId = " + savedUserId);

      const response = await fetch(buildPath(`api/ui-settings/change-font-style/${savedUserId}/${selectedFont}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok){
        // Set error message here.
        setMessage("Unable to save font style changes");
      } else {
        const message = await response.json();
        setMessage(message);
      }

      localStorage.setItem("fontStyle", selectedFont);

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

            {/* Color UI/CVD Filter Preview Container */}
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
              <div className="img-container">
                <DashboardPreview className="dashboard-preview" style={{
                      '--background-color': backgroundColor,
                      '--navbar-color': navbarColor,
                      '--border-color': borderColor,
                      '--sidebar-color': sideBarColor,
                      '--sidebar-btn-color': sideBarButtonColor,
                      '--card-color': projectCardColor,
                      '--view-btn-color': viewButtonColor,
                      '--project-color': projectCardColor,
                      '--project-border-color': projectCardBorderColor,
                  }} />
                  <TimetablePreview className="timetable-preview" style={{
                      '--background-color': backgroundColor,
                      '--navbar-color': navbarColor,
                      '--border-color': borderColor,
                      '--timetable-color': timetableColor,
                      '--timetable-inner-color': timetableInnerColor,
                      '--timetable-border-color': timetableBorderColor,
                      '--grid-color': gridColor,
                  }} />
              </div>
            </div>

            {/* Font Editing Container */}
            <div className="font-container">
              <h1>Change Font:</h1>
              <select 
                  className="font-selector" 
                  onChange={handleFontChange}
                  value={fontStyle}

              >
                <option value="Inter"> Default </option>
                <option value="Merriweather">Merriweather </option>
                <option value="Arial">Arial </option>
                <option value="Verdana">Verdana </option>
                <option value="Open Sans">Open Sans </option>
                <option value="Courier New">Courier New </option>
                <option value="Opendyslexic">Opendyslexic</option>

              </select>
              </div>
        </div>
    )
}

export default UISettings
