import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Sun from './Sun';
import Mercury from './Mercury'; // Import Mercury from Planet.jsx (or rename the file)
import OrbitLine from './OrbitLine';
import Starfield from './Starfield';

const Solar = () => {
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
        <Starfield />
        
        {/* Sun at the center */}
        <Sun position={[0, 0, 0]} size={2} />
        
        {/* Add directional light for better visibility */}
        <directionalLight position={[10, 15, 5]} intensity={0.5} color="#fff" />
        
        {/* Mercury and its orbit */}
        <OrbitLine radius={5} color="#6A6A92" eccentricity={0.2}/>
        <Mercury orbitRadius={5} />
        
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