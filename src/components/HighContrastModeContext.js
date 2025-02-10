import { createContext, useState } from "react";

export const HighContrastModeContext = createContext(); // Named export

export const HighContrastModeProvider = ({ children }) => {
  const [isHighContrastMode, setIsHighContrastMode] = useState(false);

  const toggleHighContrastMode = () => {
    setIsHighContrastMode((prevMode) => !prevMode);
  };

  return (
    <HighContrastModeContext.Provider value={{ isHighContrastMode, toggleHighContrastMode }}>
      {children}
    </HighContrastModeContext.Provider>
  );
};
