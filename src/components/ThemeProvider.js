import React, {useState, createContext, useEffect, useLayoutEffect} from 'react';

export const ThemeContext = createContext();

const ThemeProvider = ({children}) =>{
  //Theme States
  const [theme, setTheme] = useState(() => {
    const storedUserData = JSON.parse(localStorage.getItem("user_data"));
    if(storedUserData === null)
      return

    storedUserData.uiOptions.theme = storedUserData.uiOptions.theme || "default";
    return storedUserData.uiOptions.theme
  });

  //UseState for Custom mode, retrieved from user_data
  const [customColors, setCustomColors] = useState(() => {
      const storedUserData = JSON.parse(localStorage.getItem("user_data"));
      if(storedUserData === null)
          return
      storedUserData.uiOptions.custom = {
        ...{
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
        },
        ...storedUserData.uiOptions.custom, // Keep existing values if they exist
  };

  localStorage.setItem("user_data", JSON.stringify(storedUserData));

  return storedUserData.uiOptions.custom;
});


  //useLayoutEffect to prevent flashing
  useLayoutEffect(() => {
    document.documentElement.className = theme;
    const storedUserData = JSON.parse(localStorage.getItem("user_data"));
    if(storedUserData === null)
        return
    
    storedUserData.uiOptions.theme = theme || "default";
    localStorage.setItem("user_data", JSON.stringify(storedUserData));
    
    if(theme == 'custom'){
      document.documentElement.style.setProperty("--background-color", customColors.background);
      document.documentElement.style.setProperty("--text", customColors.text);
      document.documentElement.style.setProperty("--contentarea", customColors.contentarea);
      document.documentElement.style.setProperty("--cardcolor", customColors.cardcolor);
      document.documentElement.style.setProperty("--cardbordercolor", customColors.cardbordercolor);
      document.documentElement.style.setProperty("--timetable", customColors.timetable);
      document.documentElement.style.setProperty("--timetableinner", customColors.timetableinner);
      document.documentElement.style.setProperty("--timetableborder", customColors.timetableborder);
      document.documentElement.style.setProperty("--navbar", customColors.navbar);
      document.documentElement.style.setProperty("--sidebar", customColors.sidebar);
      document.documentElement.style.setProperty("--buttons", customColors.buttons);
      console.log(customColors)
    }

  }, [theme, customColors]);

  const [fontStyle, setFontStyle] = useState(() => {
    const storedUserData = JSON.parse(localStorage.getItem("user_data"));
    if(storedUserData === null)
      return
    storedUserData.uiOptions.fontStyle = storedUserData.uiOptions.fontStyle || "Inter";
    localStorage.setItem("user_data", JSON.stringify(storedUserData));
    return storedUserData.uiOptions.fontStyle
  });

  const [activeCVD, setActiveCVD] = useState(() =>{
    const storedUserData = JSON.parse(localStorage.getItem("user_data"));
    if(storedUserData === null)
      return
    storedUserData.uiOptions.CVDFilter = storedUserData.uiOptions.CVDFilter || "normal";
    localStorage.setItem("user_data", JSON.stringify(storedUserData));
    return storedUserData.uiOptions.CVDFilter
  })

  useLayoutEffect(() => {
    document.body.style.fontFamily = fontStyle;
  }, [fontStyle]);

  //To be passed as "props" once useContext() is invoked
  const contextValue = {
    theme,
    setTheme,
    customColors,
    setCustomColors,
    fontStyle,
    setFontStyle,
    activeCVD, setActiveCVD,
  };

  return(
    <div className={`${activeCVD} cvd_filter_applicable`}>
      <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
    </div>
  )
}

export default ThemeProvider;