import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Shadow } from '@react-three/drei';
import Sun from './Sun';
import Mercury from './Mercury';
import OrbitLine from './OrbitLine';
import Starfield from './Starfield';
import Venus from './Venus';
import Earth from './Earth';
import Mars from './Mars';
import Jupiter from './Jupiter';
import AsteroidBelt from './AsteroidBelt';

const Solar = () => {
  // State to track orbit lines visibility
  const [showOrbitLines, setShowOrbitLines] = useState(true);

  // Toggle function
  const toggleOrbitLines = () => {
    setShowOrbitLines(!showOrbitLines);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Toggle button - positioned in the top right corner */}
      <button 
        onClick={toggleOrbitLines}
        className="absolute top-4 right-4 z-10 bg-slate-800 text-white px-4 py-2 rounded-md opacity-80 hover:opacity-100 transition-opacity"
        style={{ backdropFilter: 'blur(5px)' }}
      >
        {showOrbitLines ? 'Hide Orbit Lines' : 'Show Orbit Lines'}
      </button>

      <Canvas
        camera={{ position: [0, 10, 15], fov: 50 }}
        className="absolute inset-0 z-0"
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#030718']} />

        {/* Ambient light for overall scene visibility */}
        <ambientLight intensity={0.5} />

        <hemisphereLight skyColor="#ffffff" groundColor="#000033" intensity={0.5} />

        {/* Main light source at the center (Sun) */}
        <pointLight
          position={[0, 0, 0]}
          intensity={5.0}
          color="#FFF9E0"
          distance={60}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0005}
          shadow-radius={3}
        />
        {/* Add distant light to create contrast */}
        <directionalLight
          position={[30, 20, 30]}
          intensity={0.2}
          color="#CCE8FF"
          castShadow
        />
        {/* Background stars */}
        <Starfield />

        {/* Sun at the center */}
        <Sun position={[0, 0, 0]} size={4} />

        {/* Mercury and its orbit - conditional rendering */}
        {showOrbitLines && <OrbitLine radius={8} color="#6A6A92" eccentricity={0.2}/>}
        <Mercury orbitRadius={8} />

        {/* Venus and its orbit - conditional rendering */}
        {showOrbitLines && <OrbitLine radius={13} color="#E89D65" eccentricity={0.1}/>}
        <Venus orbitRadius={13} />

        {/* Earth and its orbit - conditional rendering */}
        {showOrbitLines && <OrbitLine radius={18} color="#4A99E9" eccentricity={0.017}/>}
        <Earth orbitRadius={18} />

        {/* Mars and its orbit - conditional rendering */}
        {showOrbitLines && <OrbitLine radius={26} color="#E27B58" eccentricity={0.09}/>}
        <Mars orbitRadius={26} />

        {/* Asteroid belt between Mars and Jupiter */}
        <AsteroidBelt innerRadius={32} outerRadius={42} count={1500} />

        {/* Jupiter and its orbit - conditional rendering */}
        {showOrbitLines && <OrbitLine radius={52} color="#E8C275" eccentricity={0.049}/>}
        <Jupiter orbitRadius={52} />

        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={17}
          maxDistance={75}
        />

      </Canvas>
    </div>
  );
};

export default Solar;