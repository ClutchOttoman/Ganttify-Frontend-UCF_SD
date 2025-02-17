import { useEffect, useState } from 'react';

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('isDarkMode') 
      ? JSON.parse(localStorage.getItem('isDarkMode')) 
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const currentState = document.documentElement.classList.contains('dark');
    if (isDarkMode !== currentState) {
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);
  

  return [isDarkMode, setIsDarkMode];
};

export default useDarkMode;
