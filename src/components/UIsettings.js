import React, { useState, useEffect, useRef } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {buildPath} from './buildPath';
import useDarkMode from './useDarkMode';
import useHighContrastMode from './useHighContrastMode';
import './UIsettings.css'
import DashboardPreview  from '../Images/assets/setting_previews/dashboard_preview.svg?react';
import TimetablePreview  from '../Images/assets/setting_previews/timetable_preview.svg?react';

const debounce = (func, delay) => {
  const timeoutRef = useRef(null);  // This will persist across renders

  const debouncedFunction = (...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);  // Clear any existing timeout
    }
    timeoutRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  };

  return debouncedFunction;
};
const UISettings = () => {
  
    const [isDarkMode, setIsDarkMode] = useDarkMode();
    const [isHighContrastMode, setIsHightContrastMode] = useHighContrastMode();
    const [fontStyle, setFontStyle] = useState(() => {
        return localStorage.getItem("fontStyle") || "Inter";
    });
    const [activeCVD, setActiveCVD] = useState(() => {
      return localStorage.getItem("CVDFilter") || "normal";
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
    const addTaskButtonColor = isDarkMode ? "#333" : isHighContrastMode ? "#002238" : "#DC6B2C";

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
    
      const response = await fetch(buildPath(`api/toggle-default-dark-mode/${savedUserId}`), {
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

      const response = await fetch(buildPath(`api/toggle-default-high-contrast-mode/${savedUserId}`), {
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

      const response = await fetch(buildPath(`api/change-font-style/${savedUserId}/${selectedFont}`), {
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

    //Filters
    const applyProtanCVDFilter = () => {
      if (activeCVD === 'protanopia') {
        removeCVDFilter();
      } 
      else {
        setActiveCVD('protanopia'); // Apply Protanopia filter
          const allInstances = document.getElementsByClassName("cvd_filter_applicable");
          for (let i = 0; i < allInstances.length; i++) {
            allInstances[i].classList.remove("normal", "protanopia", "deuteranopia", "tritanopia");
            allInstances[i].classList.add("protanopia");
          }
          CVDFilterHandler('protanopia');
        }
    };
    
    const applyDeuteranCVDFilter = () => {
      if (activeCVD === 'deuteranopia') {
        removeCVDFilter();
      } 
      else {
      setActiveCVD('deuteranopia');
      const allInstances = document.getElementsByClassName("cvd_filter_applicable");
      for (let i = 0; i < allInstances.length; i++) {
        allInstances[i].classList.remove("normal", "protanopia", "deuteranopia", "tritanopia");
        allInstances[i].classList.add("deuteranopia");
      }
      CVDFilterHandler('deuteranopia');
      }
    };
    
    const applyTritanCVDFilter = () => {
      if (activeCVD === 'tritanopia') {
        removeCVDFilter();
      } else {
      setActiveCVD('tritanopia');
      const allInstances = document.getElementsByClassName("cvd_filter_applicable");
      for (let i = 0; i < allInstances.length; i++) {
        allInstances[i].classList.remove("normal", "protanopia", "deuteranopia", "tritanopia");
        allInstances[i].classList.add("tritanopia");
      }
      CVDFilterHandler('tritanopia');
    }
    };

    const removeCVDFilter = () => {
      // Get all tags and objects that are of class "cvd_filter_applicable"
      setActiveCVD('normal'); // Remove the active CVD filter
      const allInstances = document.getElementsByClassName("cvd_filter_applicable");

      // Apply no filter.
      for (let i = 0; i < allInstances.length; i++){
        allInstances[i].classList.remove("normal", "protanopia", "deuteranopia", "tritanopia");
        allInstances[i].classList.add("normal");
      }
      CVDFilterHandler('normal');
    }

    const CVDFilterHandler = debounce(async(filter) => {
      const savedUserInfo = localStorage.getItem('user_data');
      const savedUserId = JSON.parse(savedUserInfo)._id; // use user id to query database.
      console.log("Changing CVD filter, savedUserId = " + savedUserId);

      const response = await fetch(buildPath(`api/change-CVD-filter/${savedUserId}/${filter}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok){
        // Set error message here.
        setMessage("Unable to change CVD Filter");
      } else {
        const message = await response.json();
        setMessage(message);
    }

    localStorage.setItem("CVDFilter", filter);
  }, 500);
      
    return(
      <div>
        <h1 class="title"></h1>
        <div class="settings-container d-inline-flex flex-column ">
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
            <div class="ui-preview-container ">
            <h1>
            Color UI Preview: 
              <span className="normal-text">
                  Prototype colorblind UI is not calculated in realtime. This uses the Brettel 1997 method from  
                  <a href="https://daltonlens.org/colorblindness-simulator" target="_blank" rel="noopener noreferrer">daltonlens.org</a> 
                  for a mock-up CVD preview of tritanopia.
              </span>
            </h1>

              {/* This is the container for the preview images */}
              <div className="img-container normal cvd_filter_applicable">
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
                      '--add-task-btn-color': addTaskButtonColor,
                  }} />
              </div>
              <h2>CVD Filters</h2>
              <div className="cvd-toolbar">
                <button 
                  className={`protan-toggle ${activeCVD === 'protanopia' ? 'active' : 'normal'}`} 
                  onClick={applyProtanCVDFilter}
                >
                  <div className="thumb"></div> 
                  
                </button>
                <span>Protanopia Filter</span>
                <button 
                  className={`deuteran-toggle ${activeCVD === 'deuteranopia' ? 'active' : 'normal'}`} 
                  onClick={applyDeuteranCVDFilter}
                >
                  <div className="thumb"></div> 
                </button>
                <span>Deuteranopia Filter</span>
                <button 
                  className={`tritan-toggle ${activeCVD === 'tritanopia' ? 'active' : 'normal'}`} 
                  onClick={applyTritanCVDFilter}
                >
                  <div className="thumb"></div> 
                </button>
                <span>Tritanopia Filter</span>
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
      </div>
    )
}

export default UISettings;
