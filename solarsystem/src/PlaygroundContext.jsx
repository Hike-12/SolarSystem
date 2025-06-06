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
    
    // Orbit speeds - Earth = 0.15 as reference, others scaled proportionally
    mercurySpeed: 0.30,    // Mercury orbits ~2x faster than Earth
    venusSpeed: 0.225,     // Venus orbits ~1.5x faster than Earth
    earthSpeed: 0.15,      // Earth reference speed
    marsSpeed: 0.12,       // Mars orbits ~0.8x Earth's speed
    jupiterSpeed: 0.075,   // Jupiter orbits ~0.5x Earth's speed
    saturnSpeed: 0.06,     // Saturn orbits ~0.4x Earth's speed
    uranusSpeed: 0.045,    // Uranus orbits ~0.3x Earth's speed
    neptuneSpeed: 0.03,    // Neptune orbits ~0.2x Earth's speed (slowest)
    
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
      mercurySpeed: 0.30,
      venusSpeed: 0.225,
      earthSpeed: 0.15,
      marsSpeed: 0.12,
      jupiterSpeed: 0.075,
      saturnSpeed: 0.06,
      uranusSpeed: 0.045,
      neptuneSpeed: 0.03,
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
