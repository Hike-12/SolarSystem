import React, { useRef, useEffect, useState } from 'react';
import { Html } from '@react-three/drei';

const RocketLoader = ({ onFinish }) => {
  const videoRef = useRef(null);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const handleEnded = () => {
      setFadeOut(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 700); // fade duration
    };
    const video = videoRef.current;
    if (video) {
      video.addEventListener('ended', handleEnded);
      video.play();
    }
    return () => {
      if (video) video.removeEventListener('ended', handleEnded);
    };
  }, [onFinish]);

  return (
    <Html fullscreen>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at center, #030718 0%, #01050e 100%)',
          transition: 'opacity 0.7s',
          opacity: fadeOut ? 0 : 1,
          pointerEvents: fadeOut ? 'none' : 'auto',
          zIndex: 9999
        }}
      >
        <video
          ref={videoRef}
          src="/space.mp4"
          autoPlay
          muted
          playsInline
          style={{
            width: '100vw',
            height: '100vh',
            objectFit: 'cover'
          }}
        />
      </div>
    </Html>
  );
};

export default RocketLoader;