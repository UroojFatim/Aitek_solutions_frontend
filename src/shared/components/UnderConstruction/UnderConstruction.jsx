import React from 'react'
import { useTheme } from '@/context/ThemeContext';
import UnderConstructionLogo from './UnderConstructionLogo';

const UnderConstruction = () => {
  const { darkMode } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background px-4">
      {darkMode ? (
        <UnderConstructionLogo styling={{ color: "white" }} />
      ) : (
        <UnderConstructionLogo styling={{ color: "black" }} />
      )}
    </div>
  );
};

export default UnderConstruction;
