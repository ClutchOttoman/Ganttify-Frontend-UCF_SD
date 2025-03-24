import React, { useState, useEffect, useRef, useContext } from 'react';
import {buildPath} from './buildPath';
import { ThemeContext } from './ThemeProvider'; 
import './UIsettings.css'
import DashboardPreview  from '../Images/assets/setting_previews/dashboard_preview.svg?react';
import TimetablePreview  from '../Images/assets/setting_previews/timetable_preview.svg?react';

import * as wcagContrast from 'wcag-contrast';


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
  const { theme, setTheme, customColors, setCustomColors, fontStyle, setFontStyle, activeCVD, setActiveCVD } = useContext(ThemeContext);
  const [pendingColors, setPendingColors] = useState(customColors);

  const [contrastWarnings, setContrastWarnings] = useState({}); //added

    const [message, setMessage] = useState('');


// Function to calculate contrast ratio
const getContrastRatio = (color1, color2) => {
  return wcagContrast.hex(color1, color2);
};

// Function to validate contrast and show warnings
const validateContrast = (id, newColor) => {
  let newWarnings = { ...contrastWarnings };

  // Define key UI elements to check contrast against
  const elementsToCheck = {
    cardcolor: ["text", "buttons"],
    text: ["background", "sidebarbtn", "contentarea", "cardcolor", "timetable", "texteditor", "navbar", "buttons", "dropdown", "todolist"],
    background: ["text", "buttons"],
    contentarea: ["text", "buttons"],
    timetable: ["text", "buttons"],
    texteditor: ["text"],
    navbar: ["text"],
    buttons: ["background", "text", "contentarea", "cardcolor", "timetable", "todolist"],
    dropdown: ["text"],
    todolist: ["text", "buttons"],
    sidebarbtn: ["text", "sidebar"],
    sidebar: ["text", "sidebarbtn"],
  };

  const contrastRequirements = {
    default: 4.5,
    highContrast: 7.0,
  };

  if (elementsToCheck[id]) {
    elementsToCheck[id].forEach((element) => {
      const color1 = newColor;
      const color2 = customColors[element];

      if (!color2) return;

      const ratio = getContrastRatio(color1, color2);

      if (ratio < contrastRequirements.default) {
        newWarnings[element] = `⚠️ Minimum contrast of 4.5:1 is recommended for ${element}. You have ${ratio.toFixed(1)}:1.`;
      } else if (ratio < contrastRequirements.highContrast) {
        newWarnings[element] = `✅ ${element} meets the default contrast (4.5:1). If you want high contrast, you have ${ratio.toFixed(1)}:1, and you need 7:1.`;
      } else {
        newWarnings[element] = `✅ ${element} meets the high contrast requirement (7:1).`;
      }
    });
  }

  setContrastWarnings(newWarnings);
};


    // Assuming theme values are 'dark', 'custom', or 'high-contrast'
    let backgroundColor = theme === 'dark' ? "#121212" : theme === 'high-contrast' ? "white" : theme === 'custom' ? customColors.background : "white";
    let borderColor = theme === 'dark' ? "#FFF" : theme === 'high-contrast' ? "#000000" : "#000000";
    let navbarColor = theme === 'dark' ? "#333" : theme === 'high-contrast' ? "#6B2B00" : theme === 'custom' ? customColors.navbar : "#FDDC87";

    // Dashboard related svgs
    let sideBarColor = theme === 'dark' ? "#2f2f2f" : theme === 'high-contrast' ? "#f3b35b" : theme === 'custom' ? customColors.sidebar : "#DC6B2C";
    let sideBarButtonColor = theme === 'dark' ? "#424242" : theme === 'high-contrast' ? "#402C12" : theme === 'custom' ? customColors?.sidebarbtn || "#FFFFFF" : "#FFFFFF";
    let viewButtonColor = theme === 'dark' ? "#2f2f2f" : theme === 'high-contrast' ? "#002238" : theme === 'custom' ? customColors?.buttons || "#DC6B2C" : "#DC6B2C"; //changed color
    let projectCardColor = theme === 'dark' ? "#424242" : theme === 'high-contrast' ? "#f3b35b" : theme === 'custom' ? customColors.cardcolor : "#fddc87";
    let projectCardBorderColor = theme === 'dark' ? "#2f2f2f" : theme === 'high-contrast' ? "#402C12" : theme === 'custom' ? customColors.cardbordercolor : "#DC6B2C";

    // Timetable related svgs
    let timetableColor = theme === 'dark' ? "#222" : theme === 'high-contrast' ? "white" : theme === 'custom' ? customColors.timetable : "white";
    let timetableInnerColor = theme === 'dark' ? "#333" : theme === 'high-contrast' ? "#FFF" : theme === 'custom' ? customColors.timetableinner : "#FFF";
    let timetableBorderColor = theme === 'dark' ? "#FFF" : theme === 'high-contrast' ? "#000000" : theme === 'custom' ? customColors.timetableborder : "#000000";
    let gridColor = theme === 'dark' ? "white" : theme === 'high-contrast' ? "black" : "black";
    let addTaskButtonColor = theme === 'dark' ? "#333" : theme === 'high-contrast' ? "#002238" : theme === 'custom' ? customColors?.buttons || "#DC6B2C" : "#DC6B2C";

    const toggleDarkMode = async () => {
      setTheme((prevTheme) => {
        const newTheme = prevTheme === 'dark' ? 'default' : 'dark';

        const savedUserInfo = localStorage.getItem('user_data');
        const savedUserId = JSON.parse(savedUserInfo)._id; 

        const response = fetch(buildPath(`api/toggle-theme/${savedUserId}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: newTheme, 
          }),
        });
    
        response.then(async (res) => {
          if (!res.ok) {
            setMessage("Unable to toggle to dark mode");
          } else {
            const message = await res.json();
            setMessage(message);
          }
        });
    
        return newTheme;
      });
    };
  
    const toggleHighContrastMode = async () => {
      setTheme((prevTheme) => {
        const newTheme = prevTheme === 'high-contrast' ? 'default' : 'high-contrast';

        const savedUserInfo = localStorage.getItem('user_data');
        const savedUserId = JSON.parse(savedUserInfo)._id; 
    
        const response = fetch(buildPath(`api/toggle-theme/${savedUserId}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: newTheme, 
          }),
        });
    
        response.then(async (res) => {
          if (!res.ok) {
            setMessage("Unable to toggle to contrast mode");
          } else {
            const message = await res.json();
            setMessage(message);
          }
        });
    
        return newTheme; 
      });
    };

    const toggleCustomMode = () => {
      setTheme((prevTheme) => {
        const newTheme = prevTheme === 'custom' ? 'default' : 'custom';
        const savedUserInfo = localStorage.getItem('user_data');
        const savedUserId = JSON.parse(savedUserInfo)._id; 
    
        const response = fetch(buildPath(`api/toggle-theme/${savedUserId}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: newTheme, 
          }),
        });
    
        response.then(async (res) => {
          if (!res.ok) {
            setMessage("Unable to toggle to custom mode");
          } else {
            const message = await res.json();
            setMessage(message);
          }
        });
    
        return newTheme; 
      });
    }

    // Handles Font Changes
    const handleFontChange = async (event) => {

      // Handle localStorage.
      setFontStyle(event.target.value)
      const selectedFont = event.target.value;
      document.body.style.fontFamily = selectedFont;

      let savedUserInfo = localStorage.getItem('user_data');
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

      savedUserInfo = JSON.parse(localStorage.getItem('user_data'));
      savedUserInfo.uiOptions.fontStyle = selectedFont
      localStorage.setItem("user_data", JSON.stringify(savedUserInfo))

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
      let savedUserInfo = localStorage.getItem('user_data');
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

    savedUserInfo = JSON.parse(localStorage.getItem('user_data'));
    savedUserInfo.uiOptions.CVDFilter = filter;
    localStorage.setItem("user_data", JSON.stringify(savedUserInfo))
  }, 500);

  //Handler for custom colors
  const handleCustomColorChange = (event) =>{
    const {id, value} = event.target;
    console.log(value)
    setPendingColors((prevColors) => ({
      ...prevColors,
      [id]: value, 
      ...(id === "buttons" && { buttonshover: brightenColor(value, 15) }),
      ...(id === "dropdown" && { dropdownhover: brightenColor(value, 15) }),
      ...(id === "cardcolor" && { cardbordercolor: darkenColor(value, 15) }), // Generate a darker border for cards
      ...(id === "timetable" && { timetableborder: darkenColor(value, 15), timetableinner: brightenColor(value, 15) }), // Generate a darker border for timetable
      ...(id === "texteditor" && { texteditorinner: brightenColor(value, 15) }),
      ...(id === "todolist" && { todolistinner: brightenColor(value, 15) }),
      
    }));

    validateContrast(id, value);
  };

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
    let userData = JSON.parse(localStorage.getItem("user_data"))
    userData.uiOptions.custom = { ...pendingColors };
    localStorage.setItem("user_data", JSON.stringify(userData))
    setCustomColors(pendingColors)
    
    const savedUserInfo = localStorage.getItem('user_data');
    const savedUserId = JSON.parse(savedUserInfo)._id; 

    const response = fetch(buildPath(`api/update-custom/${savedUserId}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        custom: pendingColors, 
      }),
    });

    response.then(async (res) => {
      if (!res.ok) {
        setMessage("Unable to toggle to custom mode");
      } else {
        const message = await res.json();
        setMessage(message);
      }
    });

  }

  const applyReset = () => {
    let userData = JSON.parse(localStorage.getItem("user_data"));

    // Default color values
    const defaultColors = {
      background: "#ffffff",
      text: "#000000",
      contentarea: "#ffffff",
      cardcolor: "#FDDC87",
      cardbordercolor: "#DC6B2C",
      timetable: "#ffffff",
      timetableinner: "#FFF",
      timetableborder: "#000000",
      navbar: "#FDDC87",
      sidebar: "#DC6B2C",
      buttons: "#DC6B2C",
      buttonshover:"",
      texteditor:"#f0f0f0",
      texteditorinner:"#fff",
      dropdown:"#ffffff",
      dropdownhover:"#ffffff",
      todolist:"#dc6b2c",
      todolistinner:"#ffffff",
      sidebarbtn:"#ffffff",
    };

    setPendingColors(defaultColors);
    setCustomColors(defaultColors);
    setContrastWarnings({}); // Clear all contrast warnings

    userData.uiOptions.custom = { ...defaultColors };
    localStorage.setItem("user_data", JSON.stringify(userData));

    const savedUserInfo = localStorage.getItem('user_data');
    const savedUserId = JSON.parse(savedUserInfo)._id; 

    const response = fetch(buildPath(`api/update-custom/${savedUserId}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        custom: defaultColors, 
      }),
    });

    response.then(async (res) => {
      if (!res.ok) {
        setMessage("Unable to toggle to custom mode");
      } else {
        const message = await res.json();
        setMessage(message);
      }
    });
};

      
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
                            className={`dark-mode-toggle ${theme === 'dark' ? "dark" : ""}`}
                            aria-label="Toggle dark mode"
                        >
                            <div className="thumb"></div>
                        </button>
                        <span>Dark Mode</span>
                  </div>
                  <div>
                        <button
                            onClick={toggleHighContrastMode}
                            className={`high-contrast-mode-toggle ${theme === 'high-contrast' ? "high-contrast" : ""}`}
                            aria-label="Toggle high-contrast mode"
                        >
                            <div className="thumb"></div> 
                        </button>
                        <span>High Contrast</span>
                  </div>
                  <div>
                        <button
                            onClick={toggleCustomMode}
                            className={`custom-mode-toggle ${theme === 'custom' ? "custom" : ""}`}
                            aria-label="Toggle high-contrast mode"
                        >
                            <div className="thumb"></div> 
                        </button>
                        <span>Custom</span>
                  </div>
                </div>

                {/* Custom Mode */}
                <div className ={`custom-settings-container ${theme === 'custom' ? "visible": ""}`}>
                  <div className ="custom-settings-btn">
                  <input type="color" className="custom-color-selector" id="background" 
                    value={customColors.background} onChange={handleCustomColorChange} />
                      <span>Background</span>
                    {contrastWarnings.background && <p style={{ color: "red" }}>{contrastWarnings.background}</p>}
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" className="custom-color-selector" id="text" 
                    value={customColors.text} onChange={handleCustomColorChange} />
                      <span>Text</span>
                    {contrastWarnings.text && <p style={{ color: "red" }}>{contrastWarnings.text}</p>}
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" className="custom-color-selector" id="contentarea" 
                    value={customColors.contentarea} onChange={handleCustomColorChange} />
                      <span>Content Area</span>
                    {contrastWarnings.contentarea && <p style={{ color: "red" }}>{contrastWarnings.contentarea}</p>}
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" className="custom-color-selector" id="cardcolor" 
                    value={customColors.cardcolor} onChange={handleCustomColorChange} />
                      <span>Chart Cards</span>
                    {contrastWarnings.cardcolor && <p style={{ color: "red" }}>{contrastWarnings.cardcolor}</p>}
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" className="custom-color-selector" id="timetable" 
                    value={customColors.timetable} onChange={handleCustomColorChange} />
                      <span>Time Table</span>
                    {contrastWarnings.timetable && <p style={{ color: "red" }}>{contrastWarnings.timetable}</p>}
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" className="custom-color-selector" id="texteditor" 
                    value={customColors.texteditor} onChange={handleCustomColorChange} />
                      <span>Text Editor</span>
                    {contrastWarnings.texteditor && <p style={{ color: "red" }}>{contrastWarnings.texteditor}</p>}
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" className="custom-color-selector" id="navbar" 
                    value={pendingColors.navbar} onChange={handleCustomColorChange} />
                      <span>Navigation Bar</span>
                    {contrastWarnings.navbar && <p style={{ color: "red" }}>{contrastWarnings.navbar}</p>}  
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" className="custom-color-selector" id="sidebar" 
                    value={pendingColors.sidebar} onChange={handleCustomColorChange} />
                      <span>Side Bar</span>
                    {contrastWarnings.sidebar && <p style={{ color: "red" }}>{contrastWarnings.sidebar}</p>}
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" className="custom-color-selector" id="sidebarbtn" 
                    value={customColors.sidebarbtn} onChange={handleCustomColorChange} />
                      <span>Side Bar Button</span>
                    {contrastWarnings.sidebarbtn && <p style={{ color: "red" }}>{contrastWarnings.sidebarbtn}</p>}
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" className="custom-color-selector" id="buttons" 
                    value={customColors.buttons} onChange={handleCustomColorChange} />
                      <span>Buttons</span>
                    {contrastWarnings.buttons && <p style={{ color: "red" }}>{contrastWarnings.buttons}</p>}
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" className="custom-color-selector" id="dropdown" 
                    value={customColors.dropdown} onChange={handleCustomColorChange} />
                      <span>Dropdown Menu</span>
                    {contrastWarnings.dropdown && <p style={{ color: "red" }}>{contrastWarnings.dropdown}</p>}
                  </div>

                  <div className ="custom-settings-btn">
                  <input type="color" className="custom-color-selector" id="todolist" 
                    value={customColors.todolist} onChange={handleCustomColorChange} />
                      <span>To-Do List</span>
                    {contrastWarnings.todolist && <p style={{ color: "red" }}>{contrastWarnings.todolist}</p>}
                  </div>

                  

                  <div class="d-flex gap-2">
                    <button type="button" className="btn btn-primary" onClick={applyCustomColorChange}>Apply</button>
                    <button type="button" className="btn btn-primary" onClick={applyReset}>Reset</button>        
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
