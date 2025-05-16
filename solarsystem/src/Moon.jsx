import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Moon = ({ orbitRadius = 2.5, size = 0.27, timeSpeed = 1 }) => {
  const moonRef = useRef();
  const orbitRef = useRef();
  
  // Load moon texture
  const moonTexture = useTexture('/textures/moon.jpg');
  
  // Earth's moon takes about 27.3 days to orbit Earth
  const orbitSpeed = 0.23;
  
  // Animation for rotation and orbit
  useFrame(({ clock }) => {
    if (moonRef.current && orbitRef.current) {
      // Moon orbit animation
      const t = clock.getElapsedTime() * timeSpeed;
      const theta = t * orbitSpeed;
      const x = orbitRadius * Math.cos(theta);
      const z = orbitRadius * Math.sin(theta);
      
      // Update position in orbit
      orbitRef.current.position.set(x, 0, z);
      
      // Moon rotation (tidally locked to Earth)
      moonRef.current.rotation.y = theta;
    }
  });
  
  return (
    <group ref={orbitRef}>
      <Sphere ref={moonRef} args={[size, 32, 16]} castShadow receiveShadow>
        <meshStandardMaterial 
          map={moonTexture}
          roughness={1.0}
          metalness={0.0}
        />
      </Sphere>
    </group>
  );
};

export default Moon;