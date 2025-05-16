import { OrbitControls, Stars, Shadow } from '@react-three/drei';
import React, { useState, Suspense, lazy, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress, Html } from '@react-three/drei';

// Only import essential components directly
import Sun from './Sun';
import Starfield from './Starfield';

// Lazy load the rest
const Mercury = lazy(() => import('./Mercury'));
const Venus = lazy(() => import('./Venus'));
const Earth = lazy(() => import('./Earth'));
const Mars = lazy(() => import('./Mars'));
const AsteroidBelt = lazy(() => import('./AsteroidBelt'));
const Jupiter = lazy(() => import('./Jupiter'));
const Saturn = lazy(() => import('./Saturn'));
const Uranus = lazy(() => import('./Uranus'));
const Neptune = lazy(() => import('./Neptune'));
const OrbitLine = lazy(() => import('./OrbitLine'));

import RocketLoader from './RocketLoader';

const Solar = () => {
  const [showOrbitLines, setShowOrbitLines] = useState(true);
  const [loadStage, setLoadStage] = useState(0);
  
  // Progressive loading of planets
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadStage < 5) setLoadStage(loadStage + 1);
    }, 600);
    return () => clearTimeout(timer);
  }, [loadStage]);

  return (
    <div className="relative w-full h-screen">
      <button 
        onClick={() => setShowOrbitLines(!showOrbitLines)}
        className="absolute top-4 right-4 z-10 bg-slate-800 text-white px-4 py-2 rounded-md opacity-80 hover:opacity-100"
      >
        {showOrbitLines ? 'Hide Orbit Lines' : 'Show Orbit Lines'}
      </button>

      <Canvas
        camera={{ position: [0, 10, 15], fov: 50 }}
        className="absolute inset-0 z-0"
        shadows
        gl={{ 
          antialias: true, // Start with antialiasing off for faster loading
          powerPreference: "high-performance" 
        }}
      >
        <color attach="background" args={['#030718']} />
        <ambientLight intensity={0.5} />
        
        {/* Essential components load first */}
        <Suspense fallback={<RocketLoader />}>
          <Starfield />
          <Sun position={[0, 0, 0]} size={4} />
          
          {/* Inner planets load next */}
          {loadStage >= 1 && (
            <>
              <Suspense fallback={null}>
                {showOrbitLines && <OrbitLine radius={8} color="#6A6A92" eccentricity={0.2}/>}
                <Mercury orbitRadius={8} />
                
                {showOrbitLines && <OrbitLine radius={13} color="#E89D65" eccentricity={0.1}/>}
                <Venus orbitRadius={13} />
              </Suspense>
            </>
          )}
          
          {/* Earth and Mars */}
          {loadStage >= 2 && (
            <Suspense fallback={null}>
              {showOrbitLines && <OrbitLine radius={18} color="#4A99E9" eccentricity={0.017}/>}
              <Earth orbitRadius={18} />
              
              {showOrbitLines && <OrbitLine radius={26} color="#E27B58" eccentricity={0.09}/>}
              <Mars orbitRadius={26} />
            </Suspense>
          )}
          
          {/* Asteroid belt - load after Mars */}
          {loadStage >= 3 && (
            <Suspense fallback={null}>
              <AsteroidBelt innerRadius={32} outerRadius={42} count={800} />
            </Suspense>
          )}
          
          {/* Outer planets */}
          {loadStage >= 4 && (
            <Suspense fallback={null}>
              {showOrbitLines && <OrbitLine radius={52} color="#E8C275" eccentricity={0.049}/>}
              <Jupiter orbitRadius={52} />
              
              {showOrbitLines && <OrbitLine radius={64} color="#E8B465" eccentricity={0.057}/>}
              <Saturn orbitRadius={64} />
            </Suspense>
          )}
          
          {/* Furthest planets */}
          {loadStage >= 5 && (
            <Suspense fallback={null}>
              {showOrbitLines && <OrbitLine radius={76} color="#4FC3C3" eccentricity={0.046}/>}
              <Uranus orbitRadius={76} />
              
              {showOrbitLines && <OrbitLine radius={88} color="#3066BE" eccentricity={0.009}/>}
              <Neptune orbitRadius={88} />
            </Suspense>
          )}
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            minDistance={17}
            maxDistance={500}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Solar;

// const Solar = () => {
//   // State to track orbit lines visibility
//   const [showOrbitLines, setShowOrbitLines] = useState(true);

//   // Toggle function
//   const toggleOrbitLines = () => {
//     setShowOrbitLines(!showOrbitLines);
//   };

//   return (
//     <div className="relative w-full h-screen">
//       {/* Toggle button - positioned in the top right corner */}
//       <button 
//         onClick={toggleOrbitLines}
//         className="absolute top-4 right-4 z-10 bg-slate-800 text-white px-4 py-2 rounded-md opacity-80 hover:opacity-100 transition-opacity"
//         style={{ backdropFilter: 'blur(5px)' }}
//       >
//         {showOrbitLines ? 'Hide Orbit Lines' : 'Show Orbit Lines'}
//       </button>

//       <Canvas
//         camera={{ position: [0, 10, 15], fov: 50 }}
//         className="absolute inset-0 z-0"
//         shadows
//         gl={{ antialias: true }}
//       >
//         <color attach="background" args={['#030718']} />

//         {/* Ambient light for overall scene visibility */}
//         <ambientLight intensity={0.5} />

//         <hemisphereLight skyColor="#ffffff" groundColor="#000033" intensity={0.5} />

//         {/* Main light source at the center (Sun) */}
//         <pointLight
//           position={[0, 0, 0]}
//           intensity={5.0}
//           color="#FFF9E0"
//           distance={60}
//           castShadow
//           shadow-mapSize={[2048, 2048]}
//           shadow-bias={-0.0005}
//           shadow-radius={3}
//         />
//         {/* Add distant light to create contrast */}
//         <directionalLight
//           position={[30, 20, 30]}
//           intensity={0.2}
//           color="#CCE8FF"
//           castShadow
//         />
//         {/* Background stars */}
//         <Starfield />

//         {/* Sun at the center */}
//         <Sun position={[0, 0, 0]} size={4} />

//         {/* Mercury and its orbit - conditional rendering */}
//         {showOrbitLines && <OrbitLine radius={8} color="#6A6A92" eccentricity={0.2}/>}
//         <Mercury orbitRadius={8} />

//         {/* Venus and its orbit - conditional rendering */}
//         {showOrbitLines && <OrbitLine radius={13} color="#E89D65" eccentricity={0.1}/>}
//         <Venus orbitRadius={13} />

//         {/* Earth and its orbit - conditional rendering */}
//         {showOrbitLines && <OrbitLine radius={18} color="#4A99E9" eccentricity={0.017}/>}
//         <Earth orbitRadius={18} />

//         {/* Mars and its orbit - conditional rendering */}
//         {showOrbitLines && <OrbitLine radius={26} color="#E27B58" eccentricity={0.09}/>}
//         <Mars orbitRadius={26} />

//         {/* Asteroid belt between Mars and Jupiter */}
//         <AsteroidBelt innerRadius={32} outerRadius={42} count={1500} />

//         {/* Jupiter and its orbit - conditional rendering */}
//         {showOrbitLines && <OrbitLine radius={52} color="#E8C275" eccentricity={0.049}/>}
//         <Jupiter orbitRadius={52} />

//         {/* Saturn and its orbit - conditional rendering */}
//         {showOrbitLines && <OrbitLine radius={64} color="#E8B465" eccentricity={0.057}/>}
//         <Saturn orbitRadius={64} />

//         {/* Uranus and its orbit - conditional rendering */}
//         {showOrbitLines && <OrbitLine radius={76} color="#4FC3C3" eccentricity={0.046}/>}
//         <Uranus orbitRadius={76} />

//         {/* Neptune and its orbit - conditional rendering */}
//         {showOrbitLines && <OrbitLine radius={88} color="#3066BE" eccentricity={0.009}/>}
//         <Neptune orbitRadius={88} />

//         {/* Camera controls */}
//         <OrbitControls
//           enablePan={true}
//           enableZoom={true}
//           minDistance={17}
//           maxDistance={500}
//         />

//       </Canvas>
//     </div>
//   );
// };

// export default Solar;