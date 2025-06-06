import React, { createContext, useContext, useState } from 'react';

const PlaygroundContext = createContext();

// Export the hook as a named export to fix Fast Refresh
export function usePlayground() {
  const context = useContext(PlaygroundContext);
  if (!context) {
    throw new Error('usePlayground must be used within a PlaygroundProvider');
  }
  return context;
}

export const PlaygroundProvider = ({ children }) => {
  const [values, setValues] = useState({
    // Sun parameters
    sunSize: 4,
    sunRotationSpeed: 0.01,
    
    // Planet sizes
    mercurySize: 0.38,
    venusSize: 0.95,
    earthSize: 1,
    marsSize: 0.53,
    jupiterSize: 2.2,
    saturnSize: 1.8,
    uranusSize: 1.6,
    neptuneSize: 1.5,
    
    // Orbit distances
    mercuryOrbit: 8,
    venusOrbit: 13,
    earthOrbit: 18,
    marsOrbit: 26,
    jupiterOrbit: 52,
    saturnOrbit: 64,
    uranusOrbit: 76,
    neptuneOrbit: 88,
    
    // Orbit speeds
    mercurySpeed: 0.02,
    venusSpeed: 0.015,
    earthSpeed: 0.01,
    marsSpeed: 0.008,
    jupiterSpeed: 0.005,
    saturnSpeed: 0.004,
    uranusSpeed: 0.003,
    neptuneSpeed: 0.002,
    
    // Rotation speeds
    mercuryRotation: 0.004,
    venusRotation: -0.002,
    earthRotation: 0.01,
    marsRotation: 0.009,
    jupiterRotation: 0.02,
    saturnRotation: 0.018,
    uranusRotation: 0.012,
    neptuneRotation: 0.011,
    
    // Global settings
    timeScale: 1,
    ambientLight: 0.5,
    starfieldDensity: 1000,
  });

  const updateValue = (key, value) => {
    setValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetToDefaults = () => {
    setValues({
      sunSize: 4,
      sunRotationSpeed: 0.01,
      mercurySize: 0.38,
      venusSize: 0.95,
      earthSize: 1,
      marsSize: 0.53,
      jupiterSize: 2.2,
      saturnSize: 1.8,
      uranusSize: 1.6,
      neptuneSize: 1.5,
      mercuryOrbit: 8,
      venusOrbit: 13,
      earthOrbit: 18,
      marsOrbit: 26,
      jupiterOrbit: 52,
      saturnOrbit: 64,
      uranusOrbit: 76,
      neptuneOrbit: 88,
      mercurySpeed: 0.02,
      venusSpeed: 0.015,
      earthSpeed: 0.01,
      marsSpeed: 0.008,
      jupiterSpeed: 0.005,
      saturnSpeed: 0.004,
      uranusSpeed: 0.003,
      neptuneSpeed: 0.002,
      mercuryRotation: 0.004,
      venusRotation: -0.002,
      earthRotation: 0.01,
      marsRotation: 0.009,
      jupiterRotation: 0.02,
      saturnRotation: 0.018,
      uranusRotation: 0.012,
      neptuneRotation: 0.011,
      timeScale: 1,
      ambientLight: 0.5,
      starfieldDensity: 1000,
    });
  };

  return (
    <PlaygroundContext.Provider value={{ values, updateValue, resetToDefaults }}>
      {children}
    </PlaygroundContext.Provider>
  );
};
