import React, { useState, useEffect, useRef } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {buildPath} from './buildPath';
import useDarkMode from './useDarkMode';
import useHighContrastMode from './useHighContrastMode';
import useCustomMode from './useCustomMode'
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
    const [isCustomMode, setIsCustomMode] = useCustomMode();
    const [fontStyle, setFontStyle] = useState(() => {
        return localStorage.getItem("fontStyle") || "Inter";
    });
    const [activeCVD, setActiveCVD] = useState(() => {
      return localStorage.getItem("CVDFilter") || "normal";
  });

    const [message, setMessage] = useState('');

    //UseState for Custom mode
    const [customColors, setCustomColors] = useState({
      styles: {
        background: "#ffffff",
        text: "#000000",
        contentarea: "#ffffff",
        cardcolor: "#FDDC87",
        cardbordercolor: "#DC6B2C",
        timetable: "#ffffff",
        timetableinner: "#FFF",
        timetableborder:"000000",
        navbar: "#FDDC87",
        sidebar:"#DC6B2C",
        buttons: "",
        
      }
    })

    //Dynamically changes the image preview svgs
    let backgroundColor = isDarkMode ? "#121212" : isHighContrastMode ? "white" : isCustomMode.boolean ? customColors.styles.background : "white";
    let borderColor = isDarkMode ? "#FFF" : isHighContrastMode ? "#000000 " : "#000000 ";
    let navbarColor = isDarkMode ? "#333" : isHighContrastMode ? "#6B2B00" : isCustomMode.boolean ? customColors.styles.navbar : "#FDDC87";
    //Dashboard related svgs
    let sideBarColor = isDarkMode ? "#2f2f2f" : isHighContrastMode ? "#f3b35b" : isCustomMode.boolean ? customColors.styles.sidebar : "#DC6B2C";
    let sideBarButtonColor = isDarkMode ? "#424242" : isHighContrastMode ? "#402C12" : isCustomMode.boolean ? customColors.styles?.buttons || "#FFFFFF" : "#FFFFFF";
    let viewButtonColor = isDarkMode ? "#2f2f2f"  : isHighContrastMode ? "#002238 " : isCustomMode.boolean ? customColors.styles?.buttons || "#135C91" : "#135C91";
    let projectCardColor = isDarkMode ? "#424242" : isHighContrastMode ? "#f3b35b" : isCustomMode.boolean ? customColors.styles.cardcolor : "#fddc87";
    let projectCardBorderColor =  isDarkMode ? "#2f2f2f" : isHighContrastMode ? "#402C12" : isCustomMode.boolean ? customColors.styles.cardbordercolor : "#DC6B2C";
    //Timetable related svgs
    let timetableColor = isDarkMode ? "#222" : isHighContrastMode ? "white" : isCustomMode.boolean ? customColors.styles.timetable : "white";
    let timetableInnerColor = isDarkMode ? "#333" : isHighContrastMode ?  "#FFF" : isCustomMode.boolean ? customColors.styles.timetable : "#FFF";
    let timetableBorderColor = isDarkMode ? "#FFF" : isHighContrastMode ? "#000000 " : isCustomMode.boolean ? customColors.styles.timetableborder : "#000000 ";
    let gridColor = isDarkMode? "white" : isHighContrastMode ? "black" : "black"
    let addTaskButtonColor = isDarkMode ? "#333" : isHighContrastMode ? "#002238" : isCustomMode.boolean ? customColors.styles?.buttons || "#DC6B2C" : "#DC6B2C";


    const toggleDarkMode = async () => {

      // Handles localStorage.
      setIsDarkMode((prevMode) => {
        if (!prevMode) {
          setIsHightContrastMode(false); // Turn off Dark Mode if it's on
          setIsCustomMode((prevState) => ({
            ...prevState,
            boolean: false 
          })); 
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
          setIsCustomMode((prevState) => ({
            ...prevState,
            boolean: false 
          })); 
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

    const toggleCustomMode = () => {
      setIsCustomMode((prevMode) => {
          setIsDarkMode(false);
          setIsHightContrastMode(false);
        return {
          boolean: !prevMode.boolean,
          ...customColors,
        }
      });
    }

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

  //Handler for custom colors
  const handleCustomColorChange = (event) =>{
    const {id, value} = event.target;
    console.log(value)
    setCustomColors((prevColors) => ({
      ...prevColors,
      styles: {
        ...prevColors.styles,
        [id]: value, 
        ...(id === "cardcolor" && { cardbordercolor: darkenColor(value, 15) }), // Generate a darker border for cards
        ...(id === "timetable" && { timetableborder: darkenColor(value, 15) }), // Generate a darker border for timetable
      },
    }))
  }

  const brightenColor = (hex, percent) => {
    if(hex === undefined) 
      return;
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
  
    // Increase brightness by the given percentage
    r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
    g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
    b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
  
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const darkenColor = (hex, percent) => {
    if(hex === undefined) 
      return;
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
  
    // Reduce brightness by the given percentage
    r = Math.max(0, Math.floor(r * (1 - percent / 100)));
    g = Math.max(0, Math.floor(g * (1 - percent / 100)));
    b = Math.max(0, Math.floor(b * (1 - percent / 100)));
  
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  

  //Will apply custom colors to the entire website, for now only the UI settings page.
  const applyCustomColorChange = () =>{
    document.documentElement.style.setProperty("--background-color", customColors.styles.background);
    document.documentElement.style.setProperty("--text", customColors.styles.text);
    document.documentElement.style.setProperty("--contentarea", customColors.styles.contentarea);
    document.documentElement.style.setProperty("--cardcolor", customColors.styles.cardcolor);
    document.documentElement.style.setProperty("--timetable", customColors.styles.timetable);
    document.documentElement.style.setProperty("--timetableinner", customColors.styles.timetableinner);
    document.documentElement.style.setProperty("--timetableborder", customColors.styles.timetableborder);
    document.documentElement.style.setProperty("--navbar", customColors.styles.navbar);
    document.documentElement.style.setProperty("--sidebar", customColors.styles.sidebar);
    document.documentElement.style.setProperty("--buttons", customColors.styles.buttons);
    console.log(customColors.styles)
  }
      
    return(
      <div>
        <h1 class="title"></h1>
        <div class="settings-container ">
          {/* Color Settings Container */}
            {/* Color UI/CVD Filter Preview Container */}
            <div class="ui-preview-container ">
            <h2>
            Color UI Preview: 
              <span className="normal-text">
                  Prototype colorblind UI is not calculated in realtime. This uses the Brettel 1997 method from  
                  <a href="https://daltonlens.org/colorblindness-simulator" target="_blank" rel="noopener noreferrer">daltonlens.org</a> 
                  for a mock-up CVD preview of tritanopia.
              </span>
            </h2>

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
              <h3>Themes</h3>
                <div class="default-colorbar">
                  <div>
                        <button
                            onClick={toggleDarkMode}
                            className={`dark-mode-toggle ${isDarkMode ? "dark" : ""}`}
                            aria-label="Toggle dark mode"
                        >
                            <div className="thumb"></div>
                        </button>
                        <span>Dark Mode</span>
                  </div>
                  <div>
                        <button
                            onClick={toggleHighContrastMode}
                            className={`high-contrast-mode-toggle ${isHighContrastMode ? "high-contrast" : ""}`}
                            aria-label="Toggle high-contrast mode"
                        >
                            <div className="thumb"></div> 
                        </button>
                        <span>High Contrast</span>
                  </div>
                  <div>
                        <button
                            onClick={toggleCustomMode}
                            className={`custom-mode-toggle ${isCustomMode ? "custom" : ""}`}
                            aria-label="Toggle high-contrast mode"
                        >
                            <div className="thumb"></div> 
                        </button>
                        <span>Custom</span>
                  </div>
                </div>
                {/* Custom Mode */}
                <div className ={`custom-settings-container ${isCustomMode.boolean ? "visible": ""}`}>
                  <div className ="custom-settings-btn">
                    <input type="color" 
                    className="custom-color-selector"
                    id ="background"
                    value={customColors.styles.background}
                    onChange={handleCustomColorChange}
                    ></input>
                    <span>Background Color</span>
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" 
                    className="custom-color-selector"
                    id ="text"
                    value={customColors.styles.text}
                    onChange={handleCustomColorChange}
                    ></input>
                    <span>text</span>
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" 
                    className="custom-color-selector"
                    id ="contentarea"
                    value={customColors.styles.contentarea}
                    onChange={handleCustomColorChange}
                    ></input>
                    <span>Content Area</span>
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" 
                    className="custom-color-selector"
                    id ="cardcolor"
                    value={customColors.styles.cardcolor}
                    onChange={handleCustomColorChange}
                    ></input>
                    <span>Chart</span>
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" 
                    className="custom-color-selector"
                    id ="timetable"
                    value={customColors.styles.timetable}
                    onChange={handleCustomColorChange}
                    ></input>
                    <span>TimeTable</span>
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" 
                    className="custom-color-selector"
                    id ="texteditor"
                    onChange={handleCustomColorChange}
                    ></input>
                    <span>Text Editor {"N/A"}</span>
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" 
                    className="custom-color-selector"
                    id ="navbar"
                    value={customColors.styles.navbar}
                    onChange={handleCustomColorChange}
                    ></input>
                    <span>Navigation Bar</span>
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" 
                    className="custom-color-selector"
                    id ="sidebar"
                    value={customColors.styles.sidebar}
                    onChange={handleCustomColorChange}
                    ></input>
                    <span>Dashboard Bar</span>
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" 
                    className="custom-color-selector"
                    id ="buttons"
                    value={customColors.styles.buttons}
                    onChange={handleCustomColorChange}
                    ></input>
                    <span>Buttons</span>
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" 
                    className="custom-color-selector"
                    id ="content-area"
                    value={customColors.styles.contentarea}
                    onChange={handleCustomColorChange}
                    ></input>
                    <span>Dropdowns {"N/A"}</span>
                  </div>

                  <div className ="custom-settings-btn">
                    <input type="color" className="custom-color-selector"></input>
                    <span>test</span>
                  </div>

                  <div className ="custom-settings-btn">
                    <input type="color" className="custom-color-selector"></input>
                    <span>test</span>
                  </div>

                  <div>
                    <button type="button" className="btn btn-primary" onClick={applyCustomColorChange}>Apply</button>
              
                  </div>

                </div>

              <h3>CVD Filters</h3>
              <div className="cvd-toolbar">
              <div>
                <button 
                  className={`protan-toggle ${activeCVD === 'protanopia' ? 'active' : 'normal'}`} 
                  onClick={applyProtanCVDFilter}
                >
                  <div className="thumb"></div> 
                </button>
                <span>Protanopia Filter</span>
              </div>
              <div>
                <button 
                  className={`deuteran-toggle ${activeCVD === 'deuteranopia' ? 'active' : 'normal'}`} 
                  onClick={applyDeuteranCVDFilter}
                >
                  <div className="thumb"></div> 
                </button>
                <span>Deuteranopia Filter</span>
              </div>
              <div>
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
              <h3>Font Styles: </h3>
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
      </div>
    )
}

export default UISettings;
