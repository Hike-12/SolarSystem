import React, { useRef, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

// This is a template for when you want to add more planets
// You can create Venus.jsx, Earth.jsx, etc. based on this component

const PlanetBase = ({ splineSceneUrl, rotationSpeed = 0.1 }) => {
  const containerRef = useRef(null);
  
  // Handle rotation animation for the planet
  useEffect(() => {
    let animationId;
    const rotateElement = () => {
      if (containerRef.current) {
        const currentRotation = parseFloat(containerRef.current.style.getPropertyValue('--rotation') || '0');
        const newRotation = currentRotation + rotationSpeed;
        containerRef.current.style.setProperty('--rotation', newRotation);
      }
      animationId = requestAnimationFrame(rotateElement);
    };
    
    animationId = requestAnimationFrame(rotateElement);
    return () => cancelAnimationFrame(animationId);
  }, [rotationSpeed]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full"
      style={{
        transform: 'rotate(calc(var(--rotation, 0) * 1deg))',
      }}
    >
      <Spline
        scene={splineSceneUrl}
        className="w-full h-full"
      />
    </div>
  );
};

export default PlanetBase;