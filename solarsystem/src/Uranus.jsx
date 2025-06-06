import React, { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Sphere, useTexture, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { usePlayground } from './PlaygroundContext';

// Uranus shader material - similar to other gas giants but with unique color profile
const UranusShaderMaterial = {
  uniforms: {
    dayTexture: { value: null },
    sunDirection: { value: new THREE.Vector3(1, 0, 0) },
    nightColor: { value: new THREE.Color(0x001122) }, // Dark blue-green for night side
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
      float blendFactor = smoothstep(0.1, 0.6, intensity);

      vec3 day = texture2D(dayTexture, vUv).rgb;
      
      // Enhance the blue-green colors of Uranus
      day *= vec3(0.9, 1.0, 1.1);

      // Add ambient illumination to dark side
      vec3 ambient = day * 0.2;
      vec3 nightSide = mix(nightColor, ambient, 0.4);
      
      // Mix day and night
      vec3 color = mix(nightSide, day, blendFactor);

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

const Uranus = ({ orbitRadius = 76, onClick, timeSpeed = 1 }) => {
  const uranusRef = useRef();
  const orbitRef = useRef();
  const { values } = usePlayground();

  // Load Uranus texture from public folder
  const dayTexture = useTexture('/textures/uranus.jpg');

  // Uranus's physical properties
  const size = 1.6; // Uranus is about 4x Earth's size, but scaled down for visualization
  const ringInnerRadius = size * 1.4;
  const ringOuterRadius = size * 2.0;
  const rotationSpeed = 1.4; // Uranus rotates in about 17 hours
  const orbitSpeed = 0.018; // Uranus orbits very slowly
  const eccentricity = 0.046; // Uranus's orbit eccentricity
  const axialTilt = 97.77 * Math.PI / 180; // Uranus's extreme axial tilt in radians (97.77 degrees)

  // Texture enhancement
  if (dayTexture) {
    dayTexture.encoding = THREE.sRGBEncoding;
    dayTexture.anisotropy = 16;
  }

  // Animation for rotation and orbit
  useFrame(({ clock }) => {
    if (uranusRef.current && orbitRef.current) {
      // Self-rotation (Uranus rotates "sideways")
      uranusRef.current.rotation.y += values.uranusRotation * timeSpeed;
      
      // Orbit calculations - same pattern as other planets
      const t = clock.getElapsedTime() * timeSpeed;
      const theta = t * values.uranusSpeed;
      const distance = orbitRadius * (1 - eccentricity * Math.cos(theta));
      const x = distance * Math.cos(theta);
      const z = distance * Math.sin(theta);
      
      // Update position in orbit
      orbitRef.current.position.set(x, 0, z);
      
      // Apply Uranus's unique axial tilt (almost perpendicular to orbit)
      orbitRef.current.rotation.x = axialTilt;

      // Update sun direction for shading
      if (uranusRef.current.material.uniforms) {
        const sunDirWorld = new THREE.Vector3(-x, 0, -z).normalize();
        uranusRef.current.material.uniforms.sunDirection.value.copy(sunDirWorld);
      }
    }
  });

  // Extend shader materials for JSX
  class UranusMaterial extends THREE.ShaderMaterial {
    constructor() {
      super({
        uniforms: THREE.UniformsUtils.clone(UranusShaderMaterial.uniforms),
        vertexShader: UranusShaderMaterial.vertexShader,
        fragmentShader: UranusShaderMaterial.fragmentShader,
      });
      this.uniforms.dayTexture.value = dayTexture;
    }
  }
  
  extend({ UranusMaterial });

  return (
    <group>
      <group ref={orbitRef} position={[orbitRadius, 0, 0]} rotation={[axialTilt, 0, 0]}>
        {/* Uranus planet body */}
        <Sphere ref={uranusRef} args={[values.uranusSize, 128, 64]}
        onClick={(e) => {
            e.stopPropagation();
            onClick("Uranus"); // This passes the planet name to the handler
          }}>
          <uranusMaterial attach="material" />
        </Sphere>
      </group>
    </group>
  );
};

export default Uranus;