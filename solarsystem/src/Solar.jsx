import React, { useEffect } from 'react';
import Spline from '@splinetool/react-spline';

const Solar = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const canvas = document.querySelector('canvas');
      console.log('Canvas:', canvas); // Log the canvas element
      if (canvas) {
        console.log('Canvas found, but watermark might be baked into the rendering.');
        clearInterval(interval); // Stop checking
      }
    }, 500);

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <div style={{ clipPath: 'inset(0 60px 60px 0)' }}>
      <Spline
        scene="https://prod.spline.design/9lCLlZLnHCcxz4Lg/scene.splinecode"
        className="w-full h-full"
      />
    </div>
  );
};

export default Solar;