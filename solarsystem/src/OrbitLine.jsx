import React from 'react';
import { Line } from '@react-three/drei';

const OrbitLine = ({ radius, color = '#444444', segments = 128 }) => {
  // Generate points for a circle
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
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