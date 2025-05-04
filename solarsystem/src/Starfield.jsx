import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Starfield = () => {
  const galaxyRef = useRef();
  const starsRef = useRef();  // New ref for stars layer
  
  // Load both textures
  const milkyWayTexture = useTexture('/textures/milkyway.jpg');
  const starsTexture = useTexture('/textures/stars.jpg');
  
  // Set up the textures with better settings
  milkyWayTexture.mapping = THREE.EquirectangularReflectionMapping;
  milkyWayTexture.encoding = THREE.sRGBEncoding;
  starsTexture.mapping = THREE.EquirectangularReflectionMapping;
  starsTexture.encoding = THREE.sRGBEncoding;

  // Animate both layers at different speeds
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Slow rotation for galaxy layer
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = -time * 0.01;
    }
    
    // Slightly different rotation speed and direction for stars
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.008;  // Different direction
      starsRef.current.rotation.x = Math.sin(time * 0.05) * 0.01;  // Subtle wobble
    }
  });
  
  return (
    <group>
      {/* Outer galaxy layer */}
      <mesh ref={galaxyRef} rotation={[0, Math.PI, 0]}>
        <sphereGeometry args={[500, 64, 64]} />
        <meshBasicMaterial 
          map={milkyWayTexture} 
          side={THREE.BackSide} 
          transparent={false}
          opacity={0.8}
          toneMapped={false}
        />
      </mesh>
      
      {/* Inner star layer with different rotation */}
      <mesh ref={starsRef} rotation={[Math.PI/4, 0, 0]}>
        <sphereGeometry args={[450, 32, 32]} />
        <meshBasicMaterial 
          map={starsTexture} 
          side={THREE.BackSide}
          transparent={true}
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

export default Starfield;