import React from 'react';
import { Line } from '@react-three/drei';

const OrbitLine = ({ radius, color = '#444444', segments = 128, eccentricity = 0.2 }) => {
  // Generate points for an elliptical orbit to match Mercury's path
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const distance = radius * (1 - eccentricity * Math.cos(theta));
    const x = distance * Math.cos(theta);
    const z = distance * Math.sin(theta);
    points.push([x, 0, z]);
  }

  return (
    <Line
      points={points}
      color={color}
      lineWidth={0.5}
      opacity={0.5}
      transparent
    />
  );
};

export default OrbitLine;