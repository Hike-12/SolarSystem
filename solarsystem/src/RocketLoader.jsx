import React, { useEffect, useState } from 'react';

const RocketLoader = ({ onFinish, loadStage }) => {
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    // If loadStage is provided and hasn't reached 5 (all planets), don't finish yet.
    if (loadStage !== undefined && loadStage < 5) return;

    // Wait slightly after loadStage hits 5 for a smooth transition.
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 700); // fade duration
    }, 400); 
    
    return () => clearTimeout(timer);
  }, [loadStage, onFinish]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000', // Pure deep space black
        transition: 'opacity 0.7s ease-in-out',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'auto',
        zIndex: 9999
      }}
    >
      {/* Super clean, instantly loading CSS orbital spinner */}
      <div className="relative flex items-center justify-center w-32 h-32 mb-8">
        {/* Core (Sun) */}
        <div className="absolute w-6 h-6 bg-slate-200 rounded-full shadow-[0_0_20px_rgba(226,232,240,0.4)]"></div>
        
        {/* Inner Orbit */}
        <div className="absolute w-16 h-16 border border-slate-700/50 rounded-full border-t-slate-400 animate-[spin_2s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-300 rounded-full"></div>
        </div>
        
        {/* Outer Orbit */}
        <div className="absolute w-28 h-28 border border-slate-700/50 rounded-full border-b-slate-400 animate-[spin_4s_linear_infinite]">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 bg-slate-400 rounded-full"></div>
        </div>
      </div>

      <div 
        className="text-slate-400 tracking-widest text-sm font-sans animate-pulse"
      >
        Loading...
      </div>
    </div>
  );
};

export default RocketLoader;