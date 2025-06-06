import React, { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { usePlayground } from './PlaygroundContext';

// Venus shader material - simplified to match Mercury's shadowing logic
const VenusShaderMaterial = {
  uniforms: {
    dayTexture: { value: null },
    sunDirection: { value: new THREE.Vector3(1, 0, 0) },
    nightColor: { value: new THREE.Color(0x000000) },
  },
  vertexShader: `
    varying vec3 vWorldNormal;
    varying vec2 vUv;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D dayTexture;
    uniform vec3 sunDirection;
    uniform vec3 nightColor;
    varying vec3 vWorldNormal;
    varying vec2 vUv;
    void main() {
      float intensity = max(dot(normalize(vWorldNormal), normalize(sunDirection)), 0.0);
      float blendFactor = smoothstep(0.0, 0.75, intensity);
      vec3 day = texture2D(dayTexture, vUv).rgb;
      day *= vec3(1.05, 1.02, 0.9);
      vec3 color = mix(nightColor, day, blendFactor);
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

const Venus = ({ orbitRadius = 8, onClick, timeSpeed = 1 }) => {
  const venusRef = useRef();
  const orbitRef = useRef();
  const { values } = usePlayground();

  const dayTexture = useTexture('/textures/venus.jpg');

  const eccentricity = 0.1;

  // Texture enhancement
  if (dayTexture) {
    dayTexture.encoding = THREE.sRGBEncoding;
    dayTexture.anisotropy = 16;
  }

  // Animation for rotation and orbit
  useFrame(({ clock }) => {
    if (venusRef.current && orbitRef.current) {
      venusRef.current.rotation.y += values.venusRotation * timeSpeed;

      const t = clock.getElapsedTime() * timeSpeed;
      const theta = t * values.venusSpeed;
      const distance = orbitRadius * (1 - eccentricity * Math.cos(theta));
      const x = distance * Math.cos(theta);
      const z = distance * Math.sin(theta);

      orbitRef.current.position.set(x, 0, z);

      if (venusRef.current.material.uniforms) {
        const sunDirWorld = new THREE.Vector3(-x, 0, -z).normalize();
        venusRef.current.material.uniforms.sunDirection.value.copy(sunDirWorld);
      }
    }
  });

  class VenusMaterial extends THREE.ShaderMaterial {
    constructor() {
      super({
        uniforms: THREE.UniformsUtils.clone(VenusShaderMaterial.uniforms),
        vertexShader: VenusShaderMaterial.vertexShader,
        fragmentShader: VenusShaderMaterial.fragmentShader,
      });
      this.uniforms.dayTexture.value = dayTexture;
    }
  }

  extend({ VenusMaterial });

  return (
    <group>
      <group ref={orbitRef} position={[orbitRadius, 0, 0]}>
        <Sphere ref={venusRef} args={[values.venusSize, 64, 32]}
        onClick={(e) => {
            e.stopPropagation();
            onClick("Venus");
          }}>
          <venusMaterial attach="material" />
        </Sphere>
      </group>
    </group>
  );
};

export default Venus;