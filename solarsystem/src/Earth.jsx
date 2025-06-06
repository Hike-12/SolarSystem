import React, { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import Moon from './Moon';
import { usePlayground } from './PlaygroundContext';

// Earth shader material with simplified shadowing like Mercury/Venus
const EarthShaderMaterial = {
  uniforms: {
    dayTexture: { value: null },
    nightTexture: { value: null },
    sunDirection: { value: new THREE.Vector3(1, 0, 0) },
  },
  vertexShader: `
    varying vec3 vWorldNormal; 
    varying vec2 vUv;
    void main() {
      // Calculate world space normal - identical to Mercury/Venus approach
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;
    uniform vec3 sunDirection; // Direction FROM surface TO sun (world space)
    
    varying vec3 vWorldNormal;
    varying vec2 vUv;
    
    void main() {
      // Calculate raw intensity - identical to Mercury/Venus
      float intensity = max(dot(normalize(vWorldNormal), normalize(sunDirection)), 0.0);
      
      // Use the same smoothstep values as Mercury/Venus but sharper transition
      float blendFactor = smoothstep(0.0, 0.3, intensity); // Sharper transition (0.3 vs 0.75)
      
      vec3 dayColor = texture2D(dayTexture, vUv).rgb;
      vec3 nightColor = texture2D(nightTexture, vUv).rgb * 2.0; // Boost city lights
      
      // Mix day and night based on sun direction
      vec3 color = mix(nightColor, dayColor, blendFactor);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

const Earth = ({ orbitRadius = 12, onClick, timeSpeed = 1 }) => {
  const earthRef = useRef();
  const orbitRef = useRef();
  const { values } = usePlayground();

  // Only keep the essential textures: day and night
  const dayTexture = useTexture('/textures/earth-day.jpg');
  const nightTexture = useTexture('/textures/earth-night.jpg');

  // Earth's physical properties
  const rotationSpeed = 1.0;
  const orbitSpeed = 0.15;
  const eccentricity = 0.017; // Earth's orbit is nearly circular
  const axialTilt = 23.5 * Math.PI / 180; // Earth's axial tilt in radians

  // Texture enhancements
  if (dayTexture) {
    dayTexture.encoding = THREE.sRGBEncoding;
    dayTexture.anisotropy = 16;
  }
  
  if (nightTexture) {
    nightTexture.encoding = THREE.sRGBEncoding;
    nightTexture.anisotropy = 16;
  }

  // Animation for rotation and orbit
  useFrame(({ clock }) => {
    if (earthRef.current && orbitRef.current) {
      // Self-rotation
      earthRef.current.rotation.y += values.earthRotation * timeSpeed;
      
      // Orbit calculations - same as Mercury/Venus
      const t = clock.getElapsedTime() * timeSpeed;
      const theta = t * values.earthSpeed;
      const distance = orbitRadius * (1 - eccentricity * Math.cos(theta));
      const x = distance * Math.cos(theta);
      const z = distance * Math.sin(theta);
      
      // Update position in orbit
      orbitRef.current.position.set(x, 0, z);

      // Apply Earth's axial tilt
      orbitRef.current.rotation.x = axialTilt;

      // Same sun direction calculation as Mercury/Venus
      if (earthRef.current.material.uniforms) {
        const sunDirWorld = new THREE.Vector3(-x, 0, -z).normalize();
        earthRef.current.material.uniforms.sunDirection.value.copy(sunDirWorld);
      }
    }
  });

  // Extend shader materials for JSX
  class EarthMaterial extends THREE.ShaderMaterial {
    constructor() {
      super({
        uniforms: THREE.UniformsUtils.clone(EarthShaderMaterial.uniforms),
        vertexShader: EarthShaderMaterial.vertexShader,
        fragmentShader: EarthShaderMaterial.fragmentShader,
      });
      this.uniforms.dayTexture.value = dayTexture;
      this.uniforms.nightTexture.value = nightTexture;
    }
  }
  
  extend({ EarthMaterial });

  return (
    <group>
      <group ref={orbitRef} position={[orbitRadius, 0, 0]} rotation={[axialTilt, 0, 0]}>
        {/* Earth */}
        <Sphere ref={earthRef} args={[values.earthSize, 64, 32]}
        onClick={(e) => {
            e.stopPropagation();
            onClick("Earth"); // This passes the planet name to the handler
          }}>
          <earthMaterial attach="material" />
        </Sphere>

        {/* Add Moon component here */}
        <Moon 
          orbitRadius={2.5} 
          size={0.27} 
          timeSpeed={timeSpeed} 
        />
      </group>
    </group>
  );
};

export default Earth;