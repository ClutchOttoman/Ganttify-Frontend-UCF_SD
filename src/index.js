
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const applyThemeSettings = () => {
  const savedDarkMode = localStorage.getItem('isDarkMode');
  const savedContrastMode = localStorage.getItem('isHighContrastMode');

  const isDarkMode = savedDarkMode ? JSON.parse(savedDarkMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isHighContrast = savedContrastMode ? JSON.parse(savedContrastMode) : window.matchMedia('(prefers-contrast: more)').matches;

  if (isDarkMode) document.body.classList.add('dark');  // Keep using body.dark
  if (isHighContrast) document.body.classList.add('high-contrast');

  // Ensure visibility is hidden until styles are fully applied
  document.body.style.visibility = 'hidden';
};

// Run before React initializes
applyThemeSettings();


const RootComponent = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      document.body.style.visibility = 'visible'; // Ensure styles apply before rendering
      setIsLoaded(true);
    }, 50); // Reduced delay
  }, []);

  return isLoaded ? <App /> : null;
};



const root = ReactDOM.createRoot(document.getElementById('root'));

setTimeout(() => {
  root.render(
    <React.StrictMode>
      <RootComponent />
    </React.StrictMode>
  );
}, 0); // Ensure styles apply before React initializes

reportWebVitals();

