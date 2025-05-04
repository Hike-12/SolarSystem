import React, { forwardRef } from 'react';
import Spline from '@splinetool/react-spline';

const Sun = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="absolute inset-0 z-10 animate-spin-slow pointer-events-none"
      style={{ clipPath: 'inset(0 60px 60px 0)' }}
    >
      <Spline
        scene="https://prod.spline.design/9lCLlZLnHCcxz4Lg/scene.splinecode"
        className="w-full h-full"
      />
    </div>
  );
});

export default Sun;