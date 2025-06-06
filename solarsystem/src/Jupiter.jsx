import React, { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { usePlayground } from './PlaygroundContext';

// Jupiter shader material - similar to other planets
const JupiterShaderMaterial = {
  uniforms: {
    dayTexture: { value: null },
    sunDirection: { value: new THREE.Vector3(1, 0, 0) },
    nightColor: { value: new THREE.Color(0x1a1005) }, // Warm dark color for night side
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

      // Softer transition for gas giant - transitions are less sharp on gas planets
      float blendFactor = smoothstep(0.1, 0.7, intensity);

      vec3 day = texture2D(dayTexture, vUv).rgb;
      
      // Slightly enhance the warm colors of Jupiter
      day *= vec3(1.1, 1.0, 0.9);

      // Add ambient illumination to dark side
      vec3 ambient = day * 0.3;
      vec3 nightSide = mix(nightColor, ambient, 0.6);
      
      // Mix day and night
      vec3 color = mix(nightSide, day, blendFactor);

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

const Jupiter = ({ orbitRadius = 25, onClick, timeSpeed = 1 }) => {
  const jupiterRef = useRef();
  const orbitRef = useRef();
  const { values } = usePlayground();

  // Load Jupiter texture from public folder
  const dayTexture = useTexture('/textures/jupiter.jpg');

  const rotationSpeed = 2.4; // Jupiter rotates faster than Earth (~9.9 hours)
  const orbitSpeed = 0.06; // Jupiter orbits slower than Mars
  const eccentricity = 0.049; // Jupiter's orbit eccentricity
  const axialTilt = 3.13 * Math.PI / 180; // Jupiter's axial tilt in radians

  // Texture enhancement
  if (dayTexture) {
    dayTexture.encoding = THREE.sRGBEncoding;
    dayTexture.anisotropy = 16;
    dayTexture.wrapS = dayTexture.wrapT = THREE.RepeatWrapping;
  }

  // Animation for rotation and orbit
  useFrame(({ clock }) => {
    if (jupiterRef.current && orbitRef.current) {
      // Self-rotation
      jupiterRef.current.rotation.y += values.jupiterRotation * timeSpeed;
      
      // Orbit calculations - same pattern as other planets
      const t = clock.getElapsedTime() * timeSpeed;
      const theta = t * values.jupiterSpeed;
      const distance = orbitRadius * (1 - eccentricity * Math.cos(theta));
      const x = distance * Math.cos(theta);
      const z = distance * Math.sin(theta);
      
      // Update position in orbit
      orbitRef.current.position.set(x, 0, z);
      
      // Apply Jupiter axial tilt
      orbitRef.current.rotation.x = axialTilt;

      // Update sun direction for shading
      if (jupiterRef.current.material.uniforms) {
        const sunDirWorld = new THREE.Vector3(-x, 0, -z).normalize();
        jupiterRef.current.material.uniforms.sunDirection.value.copy(sunDirWorld);
      }
    }
  });

  // Extend shader material for JSX
  class JupiterMaterial extends THREE.ShaderMaterial {
    constructor() {
      super({
        uniforms: THREE.UniformsUtils.clone(JupiterShaderMaterial.uniforms),
        vertexShader: JupiterShaderMaterial.vertexShader,
        fragmentShader: JupiterShaderMaterial.fragmentShader,
      });
      this.uniforms.dayTexture.value = dayTexture;
    }
  }
  
  extend({ JupiterMaterial });

  return (
    <group>
      <group ref={orbitRef} position={[orbitRadius, 0, 0]} rotation={[axialTilt, 0, 0]}>
        <Sphere ref={jupiterRef} args={[values.jupiterSize, 128, 64]}
        onClick={(e) => {
            e.stopPropagation();
            onClick("Jupiter"); // This passes the planet name to the handler
          }}>
          <jupiterMaterial attach="material" />
        </Sphere>
      </group>
    </group>
  );
};

export default Jupiter;