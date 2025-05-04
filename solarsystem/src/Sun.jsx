import React, { useRef, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

const Sun = () => {
  const containerRef = useRef(null);
  
  // Handle rotation animation for the Sun
  useEffect(() => {
    let animationId;
    const rotateElement = () => {
      if (containerRef.current) {
        const currentRotation = parseFloat(containerRef.current.style.getPropertyValue('--rotation') || '0');
        const newRotation = currentRotation + 0.05;
        containerRef.current.style.setProperty('--rotation', newRotation);
      }
      animationId = requestAnimationFrame(rotateElement);
    };
    
    animationId = requestAnimationFrame(rotateElement);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full"
      style={{
        transform: 'rotate(calc(var(--rotation, 0) * 1deg))',
      }}
    >
      <Spline
        scene="https://prod.spline.design/9lCLlZLnHCcxz4Lg/scene.splinecode"
        className="w-full h-full"
      />
    </div>
  );
};

export default Sun;