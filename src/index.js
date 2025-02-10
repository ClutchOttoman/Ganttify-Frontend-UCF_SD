import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Dark mode
const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return [isDarkMode, setIsDarkMode];
};

const DarkModeLoader = () => {
  const [isDarkMode] = useDarkMode();
  useEffect(() => {
    // Add no-flash class to prevent any render until theme is applied
    document.body.classList.remove('no-flash');
  }, []);
  return null;
};



// High contrast
const useHighContrastMode = () => {
  const [isHighContrastMode, setIsHighContrastMode] = useState(() => {
    const savedMode = localStorage.getItem('isHighContrastMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: high-contrast)').matches;
  });

  useEffect(() => {
    if (isHighContrastMode) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('isHighContrastMode', JSON.stringify(isHighContrastMode));
  }, [isHighContrastMode]);

  return [isHighContrastMode, setIsHighContrastMode];
};

const HighContrastModeLoader = () => {
  const [isHighContrastMode] = useHighContrastMode();
  useEffect(() => {
    // Add no-flash class to prevent any render until theme is applied
    document.body.classList.remove('no-flash');
  }, []);
  return null;
};

// Prevent React from rendering until theme is applied
document.body.classList.add('no-flash');

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HighContrastModeLoader/>
    <DarkModeLoader />
    <App />
  </React.StrictMode>
);

reportWebVitals();
