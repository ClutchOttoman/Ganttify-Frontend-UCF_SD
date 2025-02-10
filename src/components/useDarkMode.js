import { useEffect, useState } from 'react';

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Apply dark mode or light mode class based on the state
    if (isDarkMode) {
      document.body.classList.add('dark');
      if(window.location.pathname === '/dashboard/ui-settings'){
        document.querySelector(".dark-mode-toggle").classList.toggle("active"); //Adding active class for sliders
      }
    } else {
      document.body.classList.remove('dark');
    }

    // Save the user's preference in localStorage
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return [isDarkMode, setIsDarkMode];
};

export default useDarkMode;
