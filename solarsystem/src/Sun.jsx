import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import { usePlayground } from './PlaygroundContext';

const Sun = ({ position = [0, 0, 0], onClick, timeSpeed = 1 }) => {
  const sunRef = useRef();
  const { values } = usePlayground();
  
  // Load sun textures from the public folder
  const sunTextures = useTexture({
    map: '/textures/sun.jpg',
    normalMap: '/textures/sun-normalize.jpeg',
    emissiveMap: '/textures/sun-emissive.jpg' // Add the emissive texture
  });
  
  // Sun rotation animation with pulsing effect
  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += values.sunRotationSpeed * timeSpeed; // Slow rotation
      
      // Create subtle pulsing effect for emissive intensity
      const pulse = Math.sin(clock.getElapsedTime() * 0.5) * 0.2 + 1.3;
      sunRef.current.material.emissiveIntensity = pulse;
    }
  });

  return (
    <group position={position} onClick={(e) => {
            e.stopPropagation();
            onClick("Sun"); // This passes the planet name to the handler
          }}>
      {/* Sun glow effect - increased intensity */}
      <pointLight position={[0, 0, 0]} intensity={2.5} color="#FFF9E0" distance={100} />
      
      {/* Sun mesh with texture */}
      <Sphere ref={sunRef} args={[values.sunSize, 64, 64]}>
        <meshStandardMaterial 
          {...sunTextures}
          // emissive="#ffffff" // Use white for the emissive color to let the texture control the appearance
          emissiveIntensity={0.1} // Increased from default
          toneMapped={false} // Prevents tone mapping from dimming the bright sun
          normalScale={[0.05, 0.05]}
          roughness={0.6}
          metalness={0.3}
        />
      </Sphere>
      
      {/* Additional outer glow effect - increased opacity */}
      <Sphere args={[values.sunSize * 1.2, 32, 32]}>
        <meshBasicMaterial 
          color="#FF4500" 
          transparent={true} 
          opacity={0.2} // Increased from 0.15
        />
      </Sphere>
      
      {/* Inner corona for extra detail */}
      <Sphere args={[values.sunSize * 1.05, 32, 32]}>
        <meshBasicMaterial 
          color="#FFF9E0" 
          transparent={true} 
          opacity={0.3}
        />
      </Sphere>
    </group>
  );
};

export default Sun;