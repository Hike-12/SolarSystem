import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Mercury = ({ orbitRadius = 5 }) => {
  const mercuryRef = useRef();
  const orbitRef = useRef();
  
  // Load Mercury textures from public folder
  const mercuryTextures = useTexture({
    map: '/textures/mercury.jpg',
    // You can download these additional textures from Solar System Scope
    // https://www.solarsystemscope.com/textures/
    // normalMap: '/textures/mercury-normal.jpg',
    // bumpMap: '/textures/mercury-displacement.jpg',
  });

  // Mercury's physical properties
  const size = 0.4;
  const rotationSpeed = 0.5; // Mercury rotates slowly
  const orbitSpeed = 0.3;   // Mercury orbits relatively fast
  
  // Texture enhancements
  if (mercuryTextures.map) {
    mercuryTextures.map.encoding = THREE.sRGBEncoding;
    mercuryTextures.map.anisotropy = 16;
  }

  // Animation for rotation and orbit
  useFrame(({ clock }) => {
    if (mercuryRef.current && orbitRef.current) {
      // Self-rotation - Mercury has a very slow rotation
      mercuryRef.current.rotation.y += rotationSpeed * 0.005;
      
      // Orbit calculations - Mercury's orbit is highly elliptical
      const t = clock.getElapsedTime();
      
      // Create a slightly eccentric orbit
      const eccentricity = 0.2;
      const theta = t * orbitSpeed;
      const distance = orbitRadius * (1 - eccentricity * Math.cos(theta));
      
      const x = distance * Math.cos(theta);
      const z = distance * Math.sin(theta);
      
      // Update position in orbit
      orbitRef.current.position.x = x;
      orbitRef.current.position.z = z;
    }
  });

  return (
    <group>
      <group ref={orbitRef} position={[orbitRadius, 0, 0]}>
        {/* Mercury sphere */}
        <Sphere ref={mercuryRef} args={[size, 64, 32]}>
          <meshStandardMaterial
            {...mercuryTextures}
            metalness={0.2}
            roughness={0.85}
            // These properties only take effect when you add the corresponding maps
            normalScale={[0.05, 0.05]}
            bumpScale={0.02}
            emissive="#000000" // Mercury has no internal light
            reflectivity={0.5}  // Mercury is somewhat reflective
          />
        </Sphere>
        
        {/* Subtle ambient occlusion sphere for shadow effect */}
        <Sphere args={[size * 1.01, 32, 16]}>
          <meshBasicMaterial
            color="#000000"
            transparent={true}
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      </group>
    </group>
  );
};

export default Mercury;