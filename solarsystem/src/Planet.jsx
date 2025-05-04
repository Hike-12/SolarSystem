import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

const Planet = ({ 
  name, 
  orbitRadius, 
  size, 
  rotationSpeed, 
  orbitSpeed, 
  color
}) => {
  // References for the planet and its group (orbit)
  const planetRef = useRef();
  const orbitRef = useRef();

  // Animation for both rotation and revolution
  useFrame(({ clock }) => {
    if (planetRef.current && orbitRef.current) {
      // Planet rotation around its own axis
      planetRef.current.rotation.y += rotationSpeed * 0.01;
      
      // Planet revolution around the sun
      const t = clock.getElapsedTime();
      const x = orbitRadius * Math.cos(t * orbitSpeed);
      const z = orbitRadius * Math.sin(t * orbitSpeed);
      
      // Update planet position in orbit
      orbitRef.current.position.x = x;
      orbitRef.current.position.z = z;
    }
  });

  return (
    <group>
      {/* This group handles the orbit */}
      <group ref={orbitRef} position={[orbitRadius, 0, 0]}>
        {/* The actual planet */}
        <Sphere ref={planetRef} args={[size, 32, 32]}>
          <meshStandardMaterial 
            color={color} 
            metalness={0.2} 
            roughness={0.8} 
          />
        </Sphere>
      </group>
    </group>
  );
};

export default Planet;