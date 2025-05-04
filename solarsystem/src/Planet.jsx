import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';

const Planet = ({ 
  name, 
  orbitRadius, 
  size, 
  rotationSpeed, 
  orbitSpeed, 
  textureMap, // Replace color with textureMap
  normalMap, // Optional: for surface details
  specularMap, // Optional: for shininess
  bumpMap // Optional: for surface relief
}) => {
  // References for the planet and its group (orbit)
  const planetRef = useRef();
  const orbitRef = useRef();

  // Load textures
  const textures = textureMap ? useTexture({
    map: textureMap,
    normalMap: normalMap || '',
    bumpMap: bumpMap || '',
    specularMap: specularMap || ''
  }) : {};
  
  // Remove unused textures to prevent errors
  if (textures.normalMap === '') delete textures.normalMap;
  if (textures.bumpMap === '') delete textures.bumpMap;
  if (textures.specularMap === '') delete textures.specularMap;
  
  // Add a fallback in case texture loading fails
  const material = textureMap ? (
    <meshStandardMaterial 
      {...textures}
      metalness={0.2} 
      roughness={0.8}
      bumpScale={0.05}
    />
  ) : (
    <meshStandardMaterial 
      color="#A9A9A9" // Fallback color for Mercury
      metalness={0.2} 
      roughness={0.8}
    />
  );

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
          {material}
        </Sphere>
      </group>
    </group>
  );
};

export default Planet;