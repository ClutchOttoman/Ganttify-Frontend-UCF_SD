import React, { useState } from "react";
import tinycolor from "tinycolor2";

const ContrastChecker = () => {
  const [mode, setMode] = useState("default");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");

  const getContrastRatio = (color1, color2) => {
    return tinycolor.readability(color1, color2).toFixed(2);
  };

  const contrastRatio = getContrastRatio(bgColor, textColor);
  const minDefaultRatio = 4.0;
  const minHighContrastRatio = 7.0;

  let contrastMessage = "";
  let contrastColor = "green";
  let icon = "✅";

  if (contrastRatio < minDefaultRatio) {
    contrastMessage = `❌ Not enough contrast. Current: ${contrastRatio}:1, Minimum: 4:1`;
    contrastColor = "red";
    icon = "❌";
  } else if (contrastRatio < minHighContrastRatio) {
    contrastMessage = `⚠️ Meets default mode (4:1) but not high contrast (7:1). Current: ${contrastRatio}:1`;
    contrastColor = "orange";
    icon = "⚠️";
  } else {
    contrastMessage = `✅ Meets high contrast standards (7:1). Current: ${contrastRatio}:1`;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>UI Color Customization</h2>
      
      <label style={styles.label}>
        Select Mode:
        <select value={mode} onChange={(e) => setMode(e.target.value)} style={styles.select}>
          <option value="default">Default (Customizable)</option>
          <option value="dark" disabled>Dark Mode (Locked)</option>
          <option value="high-contrast" disabled>High Contrast (Locked)</option>
        </select>
      </label>

      {mode === "default" && (
        <>
          <div style={styles.colorPickerWrapper}>
            <label style={styles.colorLabel}>
              Background Color: 
              <input 
                type="color" 
                value={bgColor} 
                onChange={(e) => setBgColor(e.target.value)} 
                style={styles.colorInput}
              />
            </label>

            <label style={styles.colorLabel}>
              Text Color: 
              <input 
                type="color" 
                value={textColor} 
                onChange={(e) => setTextColor(e.target.value)} 
                style={styles.colorInput}
              />
            </label>
          </div>

          <div 
            style={{
              ...styles.sampleText,
              background: bgColor,
              color: textColor,
            }}
          >
            Sample Text
          </div>

          <div style={{ ...styles.contrastMessage, color: contrastColor }}>
            <span style={styles.icon}>{icon}</span>
            {contrastMessage}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    maxWidth: "600px",
    margin: "0 auto",
    background: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  colorLabel: {
    fontSize: "16px",
    color: "#555",
    display: "flex",
    alignItems: "center",
    marginRight: "20px",
  },
  colorInput: {
    width: "40px",
    height: "40px",
    border: "none",
    padding: "0",
    cursor: "pointer",
    marginLeft: "10px",
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
  icon: {
    marginRight: "10px",
    fontSize: "24px",
  }
};

export default ContrastChecker;
