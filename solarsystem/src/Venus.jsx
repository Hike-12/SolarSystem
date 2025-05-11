import React, { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Venus shader material - simplified to match Mercury's shadowing logic
const VenusShaderMaterial = {
  uniforms: {
    dayTexture: { value: null },
    sunDirection: { value: new THREE.Vector3(1, 0, 0) },
    nightColor: { value: new THREE.Color(0x000000) },
  },
  vertexShader: `
    varying vec3 vWorldNormal; // Same as Mercury
    varying vec2 vUv;
    void main() {
      // Calculate world space normal - identical to Mercury's approach
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
      // Calculate raw intensity - identical to Mercury
      float intensity = max(dot(normalize(vWorldNormal), normalize(sunDirection)), 0.0);

      // Use same smoothstep values as Mercury for consistent shadowing
      float blendFactor = smoothstep(0.0, 0.75, intensity);

      vec3 day = texture2D(dayTexture, vUv).rgb;
      
      // Venus has a slight yellowish tint due to sulfuric acid clouds
      day *= vec3(1.05, 1.02, 0.9);

      // Use blendFactor instead of raw intensity for mixing - same as Mercury
      vec3 color = mix(nightColor, day, blendFactor);

      // No transparency - fully opaque
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

// Atmosphere shader with NO TRANSPARENCY
const VenusAtmosphereShaderMaterial = {
  uniforms: {
    atmosphereTexture: { value: null },
    sunDirection: { value: new THREE.Vector3(1, 0, 0) },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    
    void main() {
      vUv = uv;
      vWorldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D atmosphereTexture;
    uniform vec3 sunDirection;
    
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    
    void main() {
      // Atmosphere effect without transparency
      float intensity = 1.0 - max(dot(normalize(vWorldNormal), normalize(vec3(0.0, 0.0, 1.0))), 0.0);
      float sunDot = max(dot(normalize(vWorldNormal), normalize(sunDirection)), 0.0);
      float sunFactor = smoothstep(0.0, 0.6, sunDot);
      
      vec3 baseColor = texture2D(atmosphereTexture, vUv).rgb;
      vec3 finalColor = baseColor * (0.6 + 0.4 * sunFactor);
      
      // 100% opaque - no transparency
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

const Venus = ({ orbitRadius = 8 }) => {
  const venusRef = useRef();
  const atmosphereRef = useRef();
  const orbitRef = useRef();

  // Load Venus textures from public folder
  const dayTexture = useTexture('/textures/venus.jpg');
  const atmosphereTexture = useTexture('/textures/venus-atmosphere.jpg');

  // Venus's physical properties
  const size = 0.95; // Venus is slightly smaller than Earth
  const atmosphereSize = size * 1.03; // Atmosphere is slightly larger
  const rotationSpeed = -0.1; // Venus has retrograde rotation
  const orbitSpeed = 0.2;
  const eccentricity = 0.1;

  // Texture enhancement
  if (dayTexture) {
    dayTexture.encoding = THREE.sRGBEncoding;
    dayTexture.anisotropy = 16;
  }

  // Animation for rotation and orbit
  useFrame(({ clock }) => {
    if (venusRef.current && atmosphereRef.current && orbitRef.current) {
      // Self-rotation
      venusRef.current.rotation.y += rotationSpeed * 0.002;
      
      // Atmosphere rotation (slightly different)
      atmosphereRef.current.rotation.y += rotationSpeed * 0.001;
      
      // Orbit calculations - same as Mercury
      const t = clock.getElapsedTime();
      const theta = t * orbitSpeed;
      const distance = orbitRadius * (1 - eccentricity * Math.cos(theta));
      const x = distance * Math.cos(theta);
      const z = distance * Math.sin(theta);
      
      // Update position in orbit
      orbitRef.current.position.set(x, 0, z);

      // Same sun direction calculation as Mercury
      if (venusRef.current.material.uniforms) {
        const sunDirWorld = new THREE.Vector3(-x, 0, -z).normalize();
        venusRef.current.material.uniforms.sunDirection.value.copy(sunDirWorld);
        atmosphereRef.current.material.uniforms.sunDirection.value.copy(sunDirWorld);
      }
    }
  });

  // Extend shader materials for JSX
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
  
  class VenusAtmosphereMaterial extends THREE.ShaderMaterial {
    constructor() {
      super({
        uniforms: THREE.UniformsUtils.clone(VenusAtmosphereShaderMaterial.uniforms),
        vertexShader: VenusAtmosphereShaderMaterial.vertexShader,
        fragmentShader: VenusAtmosphereShaderMaterial.fragmentShader,
        // NO transparency settings!
      });
      this.uniforms.atmosphereTexture.value = atmosphereTexture;
    }
  }
  
  extend({ VenusMaterial, VenusAtmosphereMaterial });

  return (
    <group>
      <group ref={orbitRef} position={[orbitRadius, 0, 0]}>
        {/* Venus surface */}
        <Sphere ref={venusRef} args={[size, 64, 32]}>
          <venusMaterial attach="material" />
        </Sphere>
        
        {/* Venus atmosphere - now rendered as an outer shell */}
        <Sphere ref={atmosphereRef} args={[size * 1.03, 32, 32]}>
          <venusAtmosphereMaterial attach="material" />
        </Sphere>
      </group>
    </group>
  );
};

export default Venus;