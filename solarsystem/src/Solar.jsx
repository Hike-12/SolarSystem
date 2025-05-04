import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Sun from './Sun';
import Mercury from './Mercury';
import OrbitLine from './OrbitLine';

// Component to handle Mercury's orbit calculations
const MercuryOrbit = ({ orbitRadius = 5, orbitSpeed = 0.3, setPosition }) => {
  const orbitRef = useRef();
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const x = orbitRadius * Math.cos(t * orbitSpeed);
    const z = orbitRadius * Math.sin(t * orbitSpeed);
    
    // Update position for the Mercury Spline component
    setPosition({ x, y: 0, z });
  });

  return null;
};

const Solar = () => {
  const [mercuryPosition, setMercuryPosition] = useState({ x: 5, y: 0, z: 0 });
  
  // Track window size for responsive positioning
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate center position for reference
  const centerX = windowSize.width / 2;
  const centerY = windowSize.height / 2;

  // Conversion factor from 3D space units to pixels
  // Adjust this value to change the scale of orbits on screen
  const scaleFactor = 50;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D Scene for stars and orbit calculations */}
      <Canvas
        className="absolute inset-0 z-0"
        camera={{ position: [0, 0, 18], fov: 50 }}
      >
        <color attach="background" args={['#030718']} />
        <ambientLight intensity={0.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <OrbitLine radius={5} color="#444444" />
        <MercuryOrbit orbitRadius={5} orbitSpeed={0.3} setPosition={setMercuryPosition} />
        <OrbitControls enablePan={false} enableZoom={true} />
      </Canvas>

      {/* SUN - centered */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{
          left: `${centerX}px`,
          top: `${centerY}px`,
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '200px',
        }}
      >
        <Sun />
      </div>

      {/* MERCURY - positioned based on orbit calculations */}
      <div 
        className="absolute z-10 pointer-events-none"
        style={{
          left: `${centerX + mercuryPosition.x * scaleFactor}px`,
          top: `${centerY + mercuryPosition.z * scaleFactor}px`,
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
        }}
      >
        <Mercury />
      </div>
    </div>
  );
};

export default Solar;