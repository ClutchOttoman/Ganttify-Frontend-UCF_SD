import { useEffect, useState } from 'react';

const useHighContrastMode = () => {
    const [isHighContrastMode, setIsHighContrastMode] = useState(() => {
      const savedMode = localStorage.getItem('isHighContrastMode');
      return savedMode ? JSON.parse(savedMode) : false;
    });
  
    useEffect(() => {
      // Apply high contrast mode class based on state
      if (isHighContrastMode) {
        document.body.classList.add('high-contrast');
        if(window.location.pathname === '/dashboard/ui-settings'){
          document.querySelector(".high-contrast-mode-toggle").classList.toggle("active"); //Adding active class for sliders
        }
      } else {
        document.body.classList.remove('high-contrast');
      }
  
      // Save the user's preference in localStorage
      localStorage.setItem('isHighContrastMode', JSON.stringify(isHighContrastMode));
    }, [isHighContrastMode]);
  
    return [isHighContrastMode, setIsHighContrastMode];
  };
  

export default useHighContrastMode;
