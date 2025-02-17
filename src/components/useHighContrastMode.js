import { useEffect, useState } from 'react';

const useHighContrastMode = () => {
    const [isHighContrastMode, setIsHighContrastMode] = useState(() => {
      const savedMode = localStorage.getItem('isHighContrastMode');
      return savedMode ? JSON.parse(savedMode) : false;
    });
  
    useEffect(() => {
      if (isHighContrastMode) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      localStorage.setItem('isHighContrastMode', JSON.stringify(isHighContrastMode));
    }, [isHighContrastMode]);
    
  
    return [isHighContrastMode, setIsHighContrastMode];
  };
  

export default useHighContrastMode;

