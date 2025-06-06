import React, { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { usePlayground } from './PlaygroundContext';

// Mars shader material - similar to Mercury/Venus approach
const MarsShaderMaterial = {
  uniforms: {
    dayTexture: { value: null },
    sunDirection: { value: new THREE.Vector3(1, 0, 0) },
    nightColor: { value: new THREE.Color(0x1a1005) }, // Slightly reddish dark color for night side
  },
  vertexShader: `
    varying vec3 vWorldNormal;
    varying vec2 vUv;
    void main() {
      // Calculate world space normal - identical to other planets
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D dayTexture;
    uniform vec3 sunDirection; // Direction FROM surface TO sun (world space)
    uniform vec3 nightColor;
    varying vec3 vWorldNormal;
    varying vec2 vUv;
    void main() {
      // Calculate raw intensity
      float intensity = max(dot(normalize(vWorldNormal), normalize(sunDirection)), 0.0);

      // Use smoothstep for a softer transition (slightly sharper than Venus/Mercury)
      float blendFactor = smoothstep(0.0, 0.6, intensity);

      vec3 day = texture2D(dayTexture, vUv).rgb;
      
      // Slightly enhance the reddish color of Mars
      day *= vec3(1.05, 0.95, 0.9);

      // Mix day and night
      vec3 color = mix(nightColor, day, blendFactor);

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

const Mars = ({ orbitRadius = 15, onClick, timeSpeed = 1 }) => {
  const marsRef = useRef();
  const orbitRef = useRef();
  const { values } = usePlayground();

  // Load Mars texture from public folder
  const dayTexture = useTexture('/textures/mars.jpg');

  // Mars physical properties
  const rotationSpeed = 0.9; // Mars rotation is similar to Earth
  const orbitSpeed = 0.12; // Mars orbit is slower than Earth
  const eccentricity = 0.09; // Mars has notable eccentricity
  const axialTilt = 25.2 * Math.PI / 180; // Mars axial tilt in radians

  // Texture enhancement
  if (dayTexture) {
    dayTexture.encoding = THREE.sRGBEncoding;
    dayTexture.anisotropy = 16;
  }

  // Animation for rotation and orbit
  useFrame(({ clock }) => {
    if (marsRef.current && orbitRef.current) {
      // Self-rotation
      marsRef.current.rotation.y += values.marsRotation * timeSpeed;
      
      // Orbit calculations - same pattern as other planets
      const t = clock.getElapsedTime() * timeSpeed;
      const theta = t * values.marsSpeed;
      const distance = orbitRadius * (1 - eccentricity * Math.cos(theta));
      const x = distance * Math.cos(theta);
      const z = distance * Math.sin(theta);
      
      // Update position in orbit
      orbitRef.current.position.set(x, 0, z);
      
      // Apply Mars axial tilt
      orbitRef.current.rotation.x = axialTilt;

      // Update sun direction for shading
      if (marsRef.current.material.uniforms) {
        const sunDirWorld = new THREE.Vector3(-x, 0, -z).normalize();
        marsRef.current.material.uniforms.sunDirection.value.copy(sunDirWorld);
      }
    }
  });

  // Extend shader material for JSX
  class MarsMaterial extends THREE.ShaderMaterial {
    constructor() {
      super({
        uniforms: THREE.UniformsUtils.clone(MarsShaderMaterial.uniforms),
        vertexShader: MarsShaderMaterial.vertexShader,
        fragmentShader: MarsShaderMaterial.fragmentShader,
      });
      this.uniforms.dayTexture.value = dayTexture;
    }
  }
  
  extend({ MarsMaterial });

  return (
    <group>
      <group ref={orbitRef} position={[orbitRadius, 0, 0]} rotation={[axialTilt, 0, 0]}>
        <Sphere ref={marsRef} args={[values.marsSize, 64, 32]}
        onClick={(e) => {
            e.stopPropagation();
            onClick("Mars"); // This passes the planet name to the handler
          }}>
          <marsMaterial attach="material" />
        </Sphere>
      </group>
    </group>
  );
};

export default Mars;