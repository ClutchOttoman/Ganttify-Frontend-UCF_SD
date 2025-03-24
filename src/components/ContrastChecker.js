import React, { useState, useContext } from "react";
import tinycolor from "tinycolor2";
import { ThemeContext } from './ThemeProvider'; 
import { buildPath } from "./buildPath";

const ContrastChecker = () => {
  const [mode, setMode] = useState("default");
  const { theme, setTheme, customColors, setCustomColors, fontStyle, setFontStyle, activeCVD, setActiveCVD } = useContext(ThemeContext);
  const [pendingColors, setPendingColors] = useState(customColors);
  const [contrastWarnings, setContrastWarnings] = useState([]);
  const [message, setMessage] = useState('');

  const defaultSettings = {
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
    buttons: "",
    buttonshover:"",
    texteditor:"#f0f0f0",
    texteditorinner:"#fff",
    dropdowns:"#ffffff",
    dropdownshover:"#ffffff",
    todolist:"#dc6b2c",
    todolistinner:"#ffffff",
    scrollbar:"#888",
    scrollbarinner:"#FDDC87",
  }

  const isDefault = Object.entries(customColors).every(([key, value]) => value === defaultSettings[key])

  const customLabels = {
    background: "Background Color",
    text: "Text Color",
    contentarea: "Content Area",
    cardcolor: "Chart",
    timetable: "Time Table",
    texteditor: "Text Editor",
    navbar: "Navigation Bar",
    sidebar: "Dashboard Bar",
    buttons: "Buttons",
    dropdowns: "Dropdown Menu",
    todolist: "To-Do List",
    scrollbar: "Scrollbar"
  };

  const colorKeys = Object.keys(customLabels);
  // List of keys to filter pairs
  const importantKeys = ['background', 'contentarea', 'text', 'buttons'];
  
  const contrastPairs = [];
  for (let i = 0; i < colorKeys.length; i++) {
    for (let j = i + 1; j < colorKeys.length; j++) {
      const pair = [colorKeys[i], colorKeys[j]];
      // Check if either element in the pair is part of the importantKeys
      if (importantKeys.includes(pair[0]) || importantKeys.includes(pair[1])) {
        contrastPairs.push(pair);
      }
    }
  }
  

const getContrastRatio = (color1, color2) => {
  return tinycolor.readability(color1, color2).toFixed(2);
};

const minDefaultRatio = 4.0;

const contrastResults = contrastPairs.map(([key1, key2]) => {
  const ratio = getContrastRatio(customColors[key1], customColors[key2]);

  let message = `✅ ${customLabels[key1]} vs ${customLabels[key2]}: ${ratio}:1 (Good)`;
  let color = "green";

  if (ratio < minDefaultRatio) {
    message = `❌ ${customLabels[key1]} vs ${customLabels[key2]}: ${ratio}:1 (Fails Contrast)`;
    color = "red";
  }

  return { message, color };
});

  //Handler for custom colors
  const handleCustomColorChange = (event) =>{
    const {id, value} = event.target;
    setPendingColors((prevColors) => ({
      ...prevColors,
      [id]: value, 
      ...(id === "buttons" && { buttonshover: brightenColor(value, 15) }),
      ...(id === "dropdowns" && { dropdownshover: brightenColor(value, 15) }),
      ...(id === "cardcolor" && { cardbordercolor: darkenColor(value, 15) }), // Generate a darker border for cards
      ...(id === "timetable" && { timetableborder: darkenColor(value, 15), timetableinner: brightenColor(value, 15) }), // Generate a darker border for timetable
      ...(id === "texteditor" && { texteditorinner: brightenColor(value, 15) }),
      ...(id === "todolist" && { todolistinner: brightenColor(value, 15) }),
      ...(id === "scrollbar" && { scrollbarinner: brightenColor(value, 15) })
      
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

  const applyReset = () =>{
    let userData = JSON.parse(localStorage.getItem("user_data"))
    setPendingColors({
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
      buttons: "",
      buttonshover:"",
      texteditor:"#f0f0f0",
      texteditorinner:"#fff",
      dropdowns:"#ffffff",
      dropdownshover:"#ffffff",
      todolist:"#dc6b2c",
      todolistinner:"#ffffff",
      scrollbar:"#888",
      scrollbarinner:"#FDDC87",
    })
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
  const filteredResults = contrastResults.filter(result => result.color === 'red' || result.color === 'orange');
  

  return (
    <div style={{width: "100% "}}>
          {/*<div 
            style={{
              ...styles.sampleText,
              background: customColors.background,
              color: customColors.text,
            }}
          >
            Sample Text
          </div>*/}

        <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '10px', 
        width: '100%', 
        padding: '5px', 
        }}>
        {Object.entries(customColors)
          .filter(([key]) => !['timetableinner', 'timetableborder', 'cardbordercolor',  'todolistinner', 'texteditorinner','dropdownshover', 'buttonshover', 'scrollbarinner'].includes(key))
          .map(([key, value]) => (
          <div style={styles.colorPickerWrapper} key={key}>
            <label style={styles.colorLabel}>
              {customLabels[key]}: 
            </label>
            <input 
                type="color" 
                id={key} 
                value={pendingColors[key]} 
                onChange={handleCustomColorChange} 
                style={styles.colorInput} 
              />
          </div>
        ))}
        </div>

      { !isDefault ? 
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '10px', 
          transition: 'opacity 0.3s ease' 
        }}>
          {filteredResults.map((result, index) => (
            <p key={index} style={{ color: result.color }}>
              {result.message}
            </p>
          ))}
        </div>
          :
          <></>
      }

        <div class="d-flex gap-2">
          <button type="button" className="btn btn-primary" onClick={applyCustomColorChange}>Apply</button>
          <button type="button" className="btn btn-primary" onClick={applyReset}>Reset</button>        
        </div> 

        

    </div>
    
  );
};

const styles = {

  label: {
    fontSize: "16px",
    color: "#555",
    display: "block",
    marginBottom: "10px",
    marginTop: "20px",
  },
  select: {
    padding: "8px",
    fontSize: "14px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #ddd",
    outline: "none",
    background: "#fff",
  },
  colorPickerWrapper: {
    display: "flex",
  },
  colorLabel: {
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    width: '175px',
  },
  colorInput: {
    width: "40px",
    height: "40px",
    border: "none",
    cursor: "pointer",
    padding: "0"
  },
  sampleText: {
    marginTop: "20px",
    padding: "20px",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontSize: "18px",
  },
  contrastMessage: {
    marginTop: "15px",
    fontWeight: "bold",
    fontSize: "18px",
  },
};

export default ContrastChecker;
