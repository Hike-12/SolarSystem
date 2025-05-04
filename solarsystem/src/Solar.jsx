import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Starfield from './Starfield';
import Sun from './Sun';
import Mercury from './Mercury';

// Create a marker object inside Canvas to track Mercury's position
const MercuryOrbitMarker = ({ setPosition }) => {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    const angle = clock.getElapsedTime() * 0.3; // Speed of orbit
    const radius = 5; // Distance from sun
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    
    if (ref.current) {
      ref.current.position.set(x, 0, z);
      setPosition({ x, y: 0, z });
    }
  });

  return <mesh ref={ref} visible={false} />;
};

const Solar = () => {
  const splineRef = useRef();
  const [mercuryPosition, setMercuryPosition] = useState({ x: 5, y: 0, z: 0 });

  return (
    <div className="relative w-full h-screen">
      {/* Outer Space Background */}
      <Canvas
        className="absolute inset-0 z-0"
        camera={{ position: [0, 0, 18], fov: 50 }}
      >
        <color attach="background" args={['#030718']} />
        <ambientLight intensity={0.8} />
        <Starfield />
        <OrbitControls enablePan={false} enableZoom={true} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
        <MercuryOrbitMarker setPosition={setMercuryPosition} />
      </Canvas>

      {/* SUN */}
      <div
        ref={splineRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ clipPath: 'inset(0 60px 60px 0)' }}
      >
        <Sun />
      </div>

      {/* MERCURY */}
      <div 
        className="absolute z-10 pointer-events-none"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(calc(${mercuryPosition.x}rem + -50%), calc(${mercuryPosition.z}rem + -50%))`,
          width: '2rem',
          height: '2rem'
        }}
      >
        <Mercury />
      </div>
    </div>
  );
};

export default Solar;