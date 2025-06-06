import React, { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { usePlayground } from './PlaygroundContext';

// Mercury shader material
const MercuryShaderMaterial = {
  uniforms: {
    dayTexture: { value: null },
    sunDirection: { value: new THREE.Vector3(1, 0, 0) }, // Direction FROM surface TO sun (world space)
    nightColor: { value: new THREE.Color(0x000000) },
  },
  vertexShader: `
    varying vec3 vWorldNormal; // Changed from vNormal (view space)
    varying vec2 vUv;
    void main() {
      // Calculate world space normal
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal); // Correct way to get world normal

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

    // --- Add smoothstep for a softer transition ---
    // Blend from intensity 0.0 to 0.1 (adjust 0.1 for wider/narrower terminator)
    float blendFactor = smoothstep(0.0, 0.75, intensity);
    // --- End of change ---

    vec3 day = texture2D(dayTexture, vUv).rgb;

    // Use blendFactor instead of raw intensity for mixing
    vec3 color = mix(nightColor, day, blendFactor);

    float alpha = mix(0.9, 1.0, blendFactor);
    gl_FragColor = vec4(color, alpha);
  }
`
};

const Mercury = ({ orbitRadius = 5, onClick, timeSpeed = 1 }) => {
  const mercuryRef = useRef();
  const orbitRef = useRef();
  const { values } = usePlayground();

  const dayTexture = useTexture('/textures/mercury.jpg');

  const rotationSpeed = 0.5;
  const orbitSpeed = 0.3;
  const eccentricity = 0.2;

  useFrame(({ clock }) => {
    if (mercuryRef.current && orbitRef.current) {
      mercuryRef.current.rotation.y += values.mercuryRotation * timeSpeed;

      const t = clock.getElapsedTime() * timeSpeed;
      const theta = t * values.mercurySpeed;
      const distance = orbitRadius * (1 - eccentricity * Math.cos(theta));
      const x = distance * Math.cos(theta);
      const z = distance * Math.sin(theta);

      orbitRef.current.position.set(x, 0, z);

      if (mercuryRef.current.material.uniforms) {
        const sunDirWorld = new THREE.Vector3(-x, 0, -z).normalize();
        mercuryRef.current.material.uniforms.sunDirection.value.copy(sunDirWorld);
      }
    }
  });

  // Extend the shader material for use in JSX
  class MercuryMaterial extends THREE.ShaderMaterial {
    constructor() {
      super({
        uniforms: THREE.UniformsUtils.clone(MercuryShaderMaterial.uniforms),
        vertexShader: MercuryShaderMaterial.vertexShader,
        fragmentShader: MercuryShaderMaterial.fragmentShader,
      });
      dayTexture.encoding = THREE.sRGBEncoding;
      this.uniforms.dayTexture.value = dayTexture;
    }
  }
  extend({ MercuryMaterial });

  return (
    <group>
      <group ref={orbitRef} position={[orbitRadius, 0, 0]}>
        <Sphere ref={mercuryRef} args={[values.mercurySize, 64, 32]}
        onClick={(e) => {
            e.stopPropagation();
            onClick("Mercury");
          }}>
          <mercuryMaterial attach="material" key={MercuryMaterial.key} />
        </Sphere>
      </group>
    </group>
  );
};

export default Mercury;

