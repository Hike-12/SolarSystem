import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Sun from './Sun';
import Planet from './Planet';
import OrbitLine from './OrbitLine';
// import mercuryTexture from '/src/textures/mercury.jpg';

const Solar = () => {
  // Configuration for planets - will be useful when adding more planets
  const planets = [
    {
      name: 'Mercury',
      distance: 5,
      size: 0.4,
      rotationSpeed: 0.5,
      orbitSpeed: 0.3,
      // textureMap: mercuryTexture,
      color: '#A9A9A9',
    }
  ];

  return (
    <div className="relative w-full h-screen">
      <Canvas
        camera={{ position: [0, 15, 25], fov: 50 }}
        className="absolute inset-0 z-0"
      >
        <color attach="background" args={['#030718']} />
        
        {/* Ambient light for overall scene visibility */}
        <ambientLight intensity={0.5} />

        <hemisphereLight skyColor="#ffffff" groundColor="#000033" intensity={0.7} />
        
        {/* Main directional light to simulate sunlight */}
        <pointLight position={[0, 0, 0]} intensity={2} color="#FFF9E0" />
        
        {/* Background stars */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Sun at the center */}
        <Sun position={[0, 0, 0]} size={2} />
        {/* Add this near the planets */}
        <directionalLight position={[10, 15, 5]} intensity={0.5} color="#fff" />
        {/* Planets and their orbits */}
        {planets.map((planet) => (
          <React.Fragment key={planet.name}>
            <OrbitLine radius={planet.distance} />
            <Planet
              name={planet.name}
              orbitRadius={planet.distance}
              size={planet.size}
              rotationSpeed={planet.rotationSpeed}
              orbitSpeed={planet.orbitSpeed}
              textureMap={planet.textureMap}
            />
          </React.Fragment>
        ))}
        
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