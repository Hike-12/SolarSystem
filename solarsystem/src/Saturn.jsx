import React, { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Sphere, useTexture, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { usePlayground } from './PlaygroundContext';

// Saturn shader material - similar to Jupiter
const SaturnShaderMaterial = {
  uniforms: {
    dayTexture: { value: null },
    sunDirection: { value: new THREE.Vector3(1, 0, 0) },
    nightColor: { value: new THREE.Color(0x1a140b) }, // Warm dark color for night side
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
      
      // Slightly enhance the warm colors of Saturn
      day *= vec3(1.15, 1.05, 0.85);

      // Add ambient illumination to dark side
      vec3 ambient = day * 0.25;
      vec3 nightSide = mix(nightColor, ambient, 0.5);
      
      // Mix day and night
      vec3 color = mix(nightSide, day, blendFactor);

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

// Ring shader material with transparency and shading
const SaturnRingMaterial = {
  uniforms: {
    ringTexture: { value: null },
    sunDirection: { value: new THREE.Vector3(1, 0, 0) },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      vWorldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D ringTexture;
    uniform vec3 sunDirection;
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      // Sample the ring texture
      vec4 ringColor = texture2D(ringTexture, vUv);
      
      // Calculate light intensity on rings - two-sided shading
      float intensity = abs(dot(normalize(vWorldNormal), normalize(sunDirection)));
      
      // The rings cast shadows on themselves
      float shadeFactor = smoothstep(0.0, 0.4, intensity);
      
      // Apply shading to the ring color
      vec3 finalColor = ringColor.rgb * mix(0.3, 1.0, shadeFactor);
      
      // Keep the alpha from the original texture for transparency
      gl_FragColor = vec4(finalColor, ringColor.a);
    }
  `
};

const Saturn = ({ orbitRadius = 64, onClick, timeSpeed = 1 }) => {
  const saturnRef = useRef();
  const ringRef = useRef();
  const orbitRef = useRef();
  const { values } = usePlayground();

  // Load Saturn and ring textures from public folder
  const dayTexture = useTexture('/textures/saturn.jpg');
  const ringTexture = useTexture('/textures/saturnring.jpg');

  // Saturn's physical properties relative to Earth (where Earth = 1.0)
  const size = 1.8; // Saturn is smaller than Jupiter in our visualization
  const rotationSpeed = 2.2; // Saturn rotates faster than Earth (~10.7 hours)
  const orbitSpeed = 0.032; // Saturn orbits slower than Jupiter
  const eccentricity = 0.057; // Saturn's orbit eccentricity
  const axialTilt = 26.73 * Math.PI / 180; // Saturn's axial tilt in radians (26.73 degrees)

  // Calculate ring sizes based on planet size
  const ringInnerRadius = values.saturnSize * 1.2;
  const ringOuterRadius = values.saturnSize * 2.5;

  // Texture enhancement
  if (dayTexture) {
    dayTexture.encoding = THREE.sRGBEncoding;
    dayTexture.anisotropy = 16;
  }

  if (ringTexture) {
    ringTexture.encoding = THREE.sRGBEncoding;
    ringTexture.anisotropy = 16;
  }

  // Animation for rotation and orbit
  useFrame(({ clock }) => {
    if (saturnRef.current && ringRef.current && orbitRef.current) {
      // Self-rotation
      saturnRef.current.rotation.y += values.saturnRotation * timeSpeed;
      
      // Orbit calculations - same pattern as other planets
      const t = clock.getElapsedTime() * timeSpeed;
      const theta = t * values.saturnSpeed;
      const distance = orbitRadius * (1 - eccentricity * Math.cos(theta));
      const x = distance * Math.cos(theta);
      const z = distance * Math.sin(theta);
      
      // Update position in orbit
      orbitRef.current.position.set(x, 0, z);
      
      // Apply Saturn's axial tilt
      orbitRef.current.rotation.x = axialTilt;

      // Update sun direction for shading
      if (saturnRef.current.material.uniforms) {
        const sunDirWorld = new THREE.Vector3(-x, 0, -z).normalize();
        saturnRef.current.material.uniforms.sunDirection.value.copy(sunDirWorld);
        ringRef.current.material.uniforms.sunDirection.value.copy(sunDirWorld);
      }
    }
  });

  // Extend shader materials for JSX
  class SaturnMaterial extends THREE.ShaderMaterial {
    constructor() {
      super({
        uniforms: THREE.UniformsUtils.clone(SaturnShaderMaterial.uniforms),
        vertexShader: SaturnShaderMaterial.vertexShader,
        fragmentShader: SaturnShaderMaterial.fragmentShader,
      });
      this.uniforms.dayTexture.value = dayTexture;
    }
  }
  
  class RingMaterial extends THREE.ShaderMaterial {
    constructor() {
      super({
        uniforms: THREE.UniformsUtils.clone(SaturnRingMaterial.uniforms),
        vertexShader: SaturnRingMaterial.vertexShader,
        fragmentShader: SaturnRingMaterial.fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
      });
      this.uniforms.ringTexture.value = ringTexture;
    }
  }
  
  extend({ SaturnMaterial, RingMaterial });

  return (
    <group>
      <group ref={orbitRef} position={[orbitRadius, 0, 0]} rotation={[axialTilt, 0, 0]}>
        {/* Saturn planet body */}
        <Sphere ref={saturnRef} args={[values.saturnSize, 128, 64]}
        onClick={(e) => {
            e.stopPropagation();
            onClick("Saturn"); // This passes the planet name to the handler
          }}>
          <saturnMaterial attach="material" />
        </Sphere>
        
        {/* Saturn rings */}
        <Ring 
          ref={ringRef}
          args={[ringInnerRadius, ringOuterRadius, 128]} 
          rotation={[Math.PI/2, 0, 0]}
        >
          <ringMaterial attach="material" />
        </Ring>
      </group>
    </group>
  );
};

export default Saturn;