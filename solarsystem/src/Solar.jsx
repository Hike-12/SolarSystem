import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Spline from '@splinetool/react-spline';

const Starfield = () => {
  const starfieldRef = useRef();

  // Function to create the starfield
  const createStarfield = (count, radius) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * radius * 2;
      const y = (Math.random() - 0.5) * radius * 2;
      const z = (Math.random() - 0.5) * radius * 2;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Varied star sizes for more visual interest
      sizes[i] = Math.random() * 0.15 + 0.05;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointSize: { value: 6.0 },
        time: { value: 0.0 },
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        uniform float pointSize;
        varying float vSize;

        void main() {
          vSize = size;
          vec3 pos = position;
          pos.x += sin(time * 0.2 + position.z * 5.0) * 0.05 * size;
          pos.y += cos(time * 0.2 + position.x * 5.0) * 0.05 * size;
          pos.z += sin(time * 0.2 + position.y * 5.0) * 0.05 * size;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = pointSize * size * (600.0 / length(gl_Position.xyz));
        }
      `,
      fragmentShader: `
        varying float vSize;

        void main() {
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          float alpha = 1.0 - smoothstep(0.4, 0.5, dist);

          vec3 color = mix(vec3(1.0), vec3(0.8, 0.85, 1.0), vSize);
          gl_FragColor = vec4(color, alpha * (0.6 + 0.4 * vSize));
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geometry, material);
  };

  useEffect(() => {
    const starfield = createStarfield(2000, 80);
    starfieldRef.current = starfield;
  }, []);

  useFrame(({ clock, scene }) => {
    if (starfieldRef.current) {
      starfieldRef.current.material.uniforms.time.value = clock.getElapsedTime();
      starfieldRef.current.rotation.y += 0.0005; // Rotate the starfield
      scene.add(starfieldRef.current);
    }
  });

  return null;
};

const Solar = () => {
    const splineRef = useRef();

  useEffect(() => {
    const handleWheel = (event) => {
      if (event.deltaY > 0) {
        // Allow zooming out
        splineRef.current.style.pointerEvents = 'auto';
      } else {
        // Disable all other interactions
        splineRef.current.style.pointerEvents = 'none';
      }
    };

    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);
  return (
    <div className="relative w-full h-screen">
      {/* Outer Space Background */}
      <Canvas
        className="absolute inset-0 z-0" // Ensure Canvas is at the bottom
        camera={{ position: [0, 0, 18], fov: 50 }}
      >
        <color attach="background" args={['#030718']} /> {/* Dark outer space background */}
        <ambientLight intensity={0.8} />
        <Starfield />
        <OrbitControls enablePan={false} enableZoom={true} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
      </Canvas>

      {/* Spline Component */}
      <div
        ref={splineRef}
        className="absolute inset-0 z-10 animate-spin-slow pointer-events-none" // Ensure Spline is on top and rotates slowly
        style={{ clipPath: 'inset(0 60px 60px 0)' }}
      >
        <Spline
          scene="https://prod.spline.design/9lCLlZLnHCcxz4Lg/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default Solar;