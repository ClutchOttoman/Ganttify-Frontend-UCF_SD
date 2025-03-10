import { useEffect, useState } from 'react';

const useCustomMode = () => {
  const [isCustomMode, setIsCustomMode] = useState(() => {
    return localStorage.getItem('isCustomMode') 
      ? JSON.parse(localStorage.getItem('isCustomMode')) 
      : {boolean: false};
  });

  useEffect(() => {
    const currentState = document.documentElement.classList.contains('custom');
    if (isCustomMode.boolean !== currentState) {
      document.documentElement.classList.toggle('custom', isCustomMode.boolean);
    }
    localStorage.setItem('isCustomMode', JSON.stringify(isCustomMode));
  }, [isCustomMode]);
  

  return [isCustomMode, setIsCustomMode];
};

export default useCustomMode;
