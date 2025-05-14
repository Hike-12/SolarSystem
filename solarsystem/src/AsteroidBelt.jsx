import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const AsteroidBelt = ({ innerRadius = 16, outerRadius = 30, count = 1000 }) => {
  // Create a memoized array of asteroid positions and sizes
  const asteroids = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Random radius within the belt
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      
      // Random position on the circle with that radius
      const angle = Math.random() * Math.PI * 2;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      
      // Random y position to give the belt some thickness
      // Thinner near edges, thicker in the middle
      const beltThickness = 0.5 + 1.5 * (1 - Math.abs(2 * (radius - innerRadius) / (outerRadius - innerRadius) - 1));
      const y = (Math.random() - 0.5) * beltThickness;
      
      // Random size for asteroids - smaller ones are more common
      const size = Math.random() * 0.05 + 0.02;
      
      // Random rotation speed
      const rotationSpeed = (Math.random() - 0.5) * 0.01;
      
      // Random orbital speed - further ones move slower
      const orbitSpeed = 0.01 + (0.05 * innerRadius / radius);

      temp.push({ position: [x, y, z], size, radius, angle, rotationSpeed, orbitSpeed });
    }
    return temp;
  }, [innerRadius, outerRadius, count]);

  // Create a reusable geometry and material for performance
  const asteroidGeometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const asteroidMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.9,
      metalness: 0.1,
    }), []);

  // Animation for the asteroid belt
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    
    // Update each asteroid's position
    for (let i = 0; i < asteroidRefs.current.length; i++) {
      if (asteroidRefs.current[i]) {
        const asteroid = asteroidRefs.current[i];
        const data = asteroids[i];
        
        // Update angle based on orbital speed
        data.angle += data.orbitSpeed * 0.01;
        
        // Calculate new position
        const x = data.radius * Math.cos(data.angle);
        const z = data.radius * Math.sin(data.angle);
        
        // Update position
        asteroid.position.set(x, data.position[1], z);
        
        // Rotate asteroid
        asteroid.rotation.x += data.rotationSpeed;
        asteroid.rotation.y += data.rotationSpeed * 0.5;
      }
    }
  });

  // Create refs for all asteroids
  const asteroidRefs = React.useRef([]);

  return (
    <group>
      {asteroids.map((data, i) => (
        <mesh
          key={i}
          ref={(el) => { asteroidRefs.current[i] = el }}
          geometry={asteroidGeometry}
          material={asteroidMaterial}
          position={data.position}
          scale={[data.size, data.size, data.size]}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
};

export default AsteroidBelt;