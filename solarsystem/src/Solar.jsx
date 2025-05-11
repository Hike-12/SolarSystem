import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Shadow } from '@react-three/drei';
import Sun from './Sun';
import Mercury from './Mercury';
import OrbitLine from './OrbitLine';
import Starfield from './Starfield';
import Venus from './Venus';
import Earth from './Earth';
import Mars from './Mars';

const Solar = () => {
  return (
    <div className="relative w-full h-screen">
      <Canvas
        camera={{ position: [0, 15, 25], fov: 50 }}
        className="absolute inset-0 z-0"
        shadows // Enable shadows in the renderer
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
          distance={100}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0005}
          shadow-radius={3}
        />
        {/* Add distant light to create contrast */}
        <directionalLight
          position={[50, 30, 50]}
          intensity={0.2}
          color="#CCE8FF" // Slight blue tint for spatial depth
          castShadow
        />
        {/* Background stars */}
        <Starfield />

        {/* Sun at the center */}
        <Sun position={[0, 0, 0]} size={2} />

        {/* Mercury and its orbit */}
        <OrbitLine radius={5} color="#6A6A92" eccentricity={0.2}/>
        <Mercury orbitRadius={5} />

        {/* Venus and its orbit */}
        <OrbitLine radius={8} color="#E89D65" eccentricity={0.1}/>
        <Venus orbitRadius={8} />

        {/* Earth and its orbit */}
        <OrbitLine radius={12} color="#4A99E9" eccentricity={0.017}/>
        <Earth orbitRadius={12} />

        <OrbitLine radius={15} color="#E27B58" eccentricity={0.09}/>
        <Mars orbitRadius={15} />

        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
    </div>
  );
};

export default Solar;
