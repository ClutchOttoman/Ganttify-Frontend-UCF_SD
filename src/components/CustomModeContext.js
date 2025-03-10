import React, { createContext, useState, useEffect } from 'react';

export const CustomContext = createContext();

export const CustomModeProvider = ({ children }) => {
    const [isCustomMode, setIsCustomMode] = useState({boolean: false})

    const toggleCustomMode = () => {
        setIsCustomMode((prevMode) => !prevMode.boolean);
      };

    return (
        <CVDContext.Provider value={{ isCustomMode, toggleCustomMode}}>
            {children}
        </CVDContext.Provider>
    );
};
