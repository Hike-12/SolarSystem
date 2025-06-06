import React, { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Sphere, useTexture, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { usePlayground } from './PlaygroundContext';

// Neptune shader material - similar to other gas giants but with deep blue color profile
const NeptuneShaderMaterial = {
  uniforms: {
    dayTexture: { value: null },
    sunDirection: { value: new THREE.Vector3(1, 0, 0) },
    nightColor: { value: new THREE.Color(0x00152A) }, // Deep blue for night side
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
      
      // Enhance the deep blue colors of Neptune
      day *= vec3(0.85, 0.95, 1.2);

      // Add ambient illumination to dark side
      vec3 ambient = day * 0.2;
      vec3 nightSide = mix(nightColor, ambient, 0.4);
      
      // Mix day and night
      vec3 color = mix(nightSide, day, blendFactor);

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

// Faint ring material for Neptune (invisible rings for realism)
const NeptuneRingShader = {
  uniforms: {
    sunDirection: { value: new THREE.Vector3(1, 0, 0) },
  },
  vertexShader: `
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      vWorldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 sunDirection;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      // Calculate intensity based on light direction
      float intensity = abs(dot(normalize(vWorldNormal), normalize(sunDirection)));
      
      // The rings cast shadows on themselves
      float shadeFactor = smoothstep(0.0, 0.4, intensity);
      
      // Dark bluish rings for Neptune
      vec3 ringColor = vec3(0.2, 0.3, 0.45);
      vec3 finalColor = ringColor * mix(0.3, 1.0, shadeFactor);
      
      // Very faint rings - Neptune's rings are nearly invisible
      gl_FragColor = vec4(finalColor, 0.2);
    }
  `
};

const Neptune = ({ orbitRadius = 88, onClick, timeSpeed = 1 }) => {
  const neptuneRef = useRef();
  const ringRef = useRef();
  const orbitRef = useRef();
  const { values } = usePlayground();

  // Load Neptune texture from public folder
  const dayTexture = useTexture('/textures/neptune.jpg');

  // Neptune's physical properties
  const ringInnerRadius = values.neptuneSize * 1.5;
  const ringOuterRadius = values.neptuneSize * 1.8;
  const rotationSpeed = 1.5; // Neptune rotates in about 16 hours
  const orbitSpeed = 0.011; // Neptune orbits very slowly - even slower than Uranus
  const eccentricity = 0.009; // Neptune's orbit eccentricity is quite low
  const axialTilt = 28.32 * Math.PI / 180; // Neptune's axial tilt in radians

  // Texture enhancement
  if (dayTexture) {
    dayTexture.encoding = THREE.sRGBEncoding;
    dayTexture.anisotropy = 16;
  }

  // Animation for rotation and orbit
  useFrame(({ clock }) => {
    if (neptuneRef.current && ringRef.current && orbitRef.current) {
      // Self-rotation
      neptuneRef.current.rotation.y += values.neptuneRotation * timeSpeed;
      
      // Orbit calculations - same pattern as other planets
      const t = clock.getElapsedTime() * timeSpeed;
      const theta = t * values.neptuneSpeed;
      const distance = orbitRadius * (1 - eccentricity * Math.cos(theta));
      const x = distance * Math.cos(theta);
      const z = distance * Math.sin(theta);
      
      // Update position in orbit
      orbitRef.current.position.set(x, 0, z);
      
      // Apply Neptune's axial tilt
      orbitRef.current.rotation.x = axialTilt;

      // Update sun direction for shading
      if (neptuneRef.current.material.uniforms) {
        const sunDirWorld = new THREE.Vector3(-x, 0, -z).normalize();
        neptuneRef.current.material.uniforms.sunDirection.value.copy(sunDirWorld);
        ringRef.current.material.uniforms.sunDirection.value.copy(sunDirWorld);
      }
    }
  });

  // Extend shader materials for JSX
  class NeptuneMaterial extends THREE.ShaderMaterial {
    constructor() {
      super({
        uniforms: THREE.UniformsUtils.clone(NeptuneShaderMaterial.uniforms),
        vertexShader: NeptuneShaderMaterial.vertexShader,
        fragmentShader: NeptuneShaderMaterial.fragmentShader,
      });
      this.uniforms.dayTexture.value = dayTexture;
    }
  }
  
  class NeptuneRingMaterial extends THREE.ShaderMaterial {
    constructor() {
      super({
        uniforms: THREE.UniformsUtils.clone(NeptuneRingShader.uniforms),
        vertexShader: NeptuneRingShader.vertexShader,
        fragmentShader: NeptuneRingShader.fragmentShader, 
        transparent: true,
        side: THREE.DoubleSide,
      });
    }
  }
  
  extend({ NeptuneMaterial, NeptuneRingMaterial });

  return (
    <group>
      <group ref={orbitRef} position={[orbitRadius, 0, 0]} rotation={[axialTilt, 0, 0]}>
        {/* Neptune planet body */}
        <Sphere ref={neptuneRef} args={[values.neptuneSize, 128, 64]}
        onClick={(e) => {
            e.stopPropagation();
            onClick("Neptune"); // This passes the planet name to the handler
          }}>
          <neptuneMaterial attach="material" />
        </Sphere>
        
        {/* Neptune's thin rings - very subtle */}
        <Ring 
          ref={ringRef}
          args={[ringInnerRadius, ringOuterRadius, 128]} 
          rotation={[Math.PI/2, 0, 0]}
        >
          <neptuneRingMaterial attach="material" />
        </Ring>
      </group>
    </group>
  );
};

export default Neptune;