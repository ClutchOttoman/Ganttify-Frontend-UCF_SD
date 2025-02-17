import React, { createContext, useState, useEffect } from 'react';

export const CVDContext = createContext();

export const CVDProvider = ({ children }) => {
    const [activeCVD, setActiveCVD] = useState(() => {
        return localStorage.getItem("CVDFilter") || "normal";
    });

    useEffect(() => {
        localStorage.setItem("CVDFilter", activeCVD);
    }, [activeCVD]);

    return (
        <CVDContext.Provider value={{ activeCVD, setActiveCVD }}>
            {children}
        </CVDContext.Provider>
    );
};
