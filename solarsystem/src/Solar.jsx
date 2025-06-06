import { OrbitControls } from '@react-three/drei';
import React, { useState, Suspense, lazy, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useProgress, Html } from '@react-three/drei';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

// Data
import { planetData, cameraPositions } from './planetData';

// Context
import { PlaygroundProvider, usePlayground } from './PlaygroundContext';

// Only import essential components directly
import Sun from './Sun';
import Starfield from './Starfield';
import RocketLoader from './RocketLoader';
import PlanetInfo from './PlanetInfo';
import Moon from './Moon';
import Playground from './Playground';

// Lazy load the rest
const Mercury = lazy(() => import('./Mercury'));
const Venus = lazy(() => import('./Venus'));
const Earth = lazy(() => import('./Earth'));
const Mars = lazy(() => import('./Mars'));
const AsteroidBelt = lazy(() => import('./AsteroidBelt'));
const Jupiter = lazy(() => import('./Jupiter'));
const Saturn = lazy(() => import('./Saturn'));
const Uranus = lazy(() => import('./Uranus'));
const Neptune = lazy(() => import('./Neptune'));
const OrbitLine = lazy(() => import('./OrbitLine'));

// Camera Controls Component
const CameraController = ({ target, enabled }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    if (!enabled || !target) return;
    
    const targetPosition = cameraPositions[target] || cameraPositions.Overview;
    
    gsap.to(camera.position, {
      duration: 2,
      x: targetPosition[0],
      y: targetPosition[1],
      z: targetPosition[2],
      onUpdate: () => {
        if (target === 'Overview') {
          camera.lookAt(0, 0, 0);
        }
      },
      onComplete: () => {
        camera.lookAt(0, 0, 0);
      }
    });
  }, [target, camera, enabled]);
  
  return null;
};

// Audio Manager Component
const AudioManager = ({ muted }) => {
  const audioRef = useRef(null);
  
  useEffect(() => {
    // Create audio element
    const audio = new Audio('/sounds/space-ambient.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    
    // Add click handler to play audio (browser policy)
    const handleInteraction = () => {
      audio.play().catch(() => {
        // Autoplay was prevented, that's fine
      });
      document.removeEventListener('click', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction);
    
    return () => {
      audio.pause();
      document.removeEventListener('click', handleInteraction);
    };
  }, []);
  
  // Handle mute/unmute
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (muted) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay was prevented, that's fine
      });
    }
  }, [muted]);
  
  return null;
};

// Toast Notification Component
const Toast = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 left-4 right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 
                    bg-cyan-900/80 backdrop-blur-md text-white px-4 py-3 md:px-6 
                    rounded-lg shadow-lg z-50 flex items-center justify-between gap-2 max-w-md mx-auto md:mx-0"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-300 flex-shrink-0">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span className="text-sm md:text-base">{message}</span>
          </div>
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white ml-2 flex-shrink-0 transition-colors"
            aria-label="Close notification"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SolarContent = () => {
  // Base states
  const [showOrbitLines, setShowOrbitLines] = useState(true);
  const [loadStage, setLoadStage] = useState(0);
  
  // Feature states
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [cameraTarget, setCameraTarget] = useState(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showPlayground, setShowPlayground] = useState(false);
  
  // Get playground values
  const { values } = usePlayground();
  
  // Orbit controls ref to disable during camera transitions
  const orbitControlsRef = useRef();
  
  // Handle planet click
  const handlePlanetClick = (planet) => {
    setSelectedPlanet(planet);
  };
  
  // Close planet info panel
  const closePlanetInfo = () => {
    setSelectedPlanet(null);
  };
  
  // Fly to specific location
  const flyTo = (target) => {
    setCameraTarget(target);
    
    // If clicking on a planet that's already selected, close the info panel
    if (selectedPlanet === target) {
      setSelectedPlanet(null);
    } else {
      setSelectedPlanet(target);
    }
  };
  
  // Progressive loading of planets
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadStage < 5) setLoadStage(loadStage + 1);
    }, 600);
    return () => clearTimeout(timer);
  }, [loadStage]);
  
  // Show toast after loading is complete
  useEffect(() => {
    if (loadStage === 5) {
      // Wait a bit after loading completes before showing toast
      const timer = setTimeout(() => {
        setShowToast(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loadStage]);
  
  // Disable orbit controls during camera transitions
  useEffect(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = !cameraTarget;
    }
  }, [cameraTarget]);

  return (
    <div className="relative w-full h-screen">
      {/* Toast notification */}
      <Toast 
        message="Click on any planet to learn more about it! Try the playground to customize everything live! 🚀" 
        visible={showToast} 
        onClose={() => setShowToast(false)} 
      />
      
      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {/* Playground toggle button */}
        <button 
          onClick={() => setShowPlayground(!showPlayground)}
          className={`bg-slate-800/90 hover:bg-slate-700 text-white px-3 py-1.5 md:px-4 md:py-2 
                     text-xs md:text-sm rounded-md transition-colors backdrop-blur-sm
                     ${showPlayground ? 'bg-cyan-700/80' : ''}`}
        >
          <span className="hidden sm:inline">🚀 Playground</span>
          <span className="sm:hidden">⚙️</span>
        </button>
        
        {/* Orbit lines toggle button */}
        <button 
          onClick={() => setShowOrbitLines(!showOrbitLines)}
          className="bg-slate-800/90 hover:bg-slate-700 text-white 
                    px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-md transition-colors backdrop-blur-sm"
        >
          <span className="hidden sm:inline">{showOrbitLines ? 'Hide Orbits' : 'Show Orbits'}</span>
          <span className="sm:hidden">{showOrbitLines ? '🔴' : '⚪'}</span>
        </button>
      </div>
      
      {/* Audio control button */}
      <button 
        className={`absolute top-5 left-5 bg-slate-800/90 hover:bg-slate-700 w-10 h-10 rounded-full 
                   flex items-center justify-center text-white z-10 backdrop-blur-sm
                   ${audioMuted ? 'bg-red-700/80' : ''}`}
        onClick={() => setAudioMuted(!audioMuted)}
      >
        {audioMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
          </svg>
        )}
      </button>
      
      {/* Playground Panel */}
      <Playground isOpen={showPlayground} onClose={() => setShowPlayground(false)} />
      
      {/* Audio manager (out of sight) */}
      <AudioManager muted={audioMuted} />
      
      {/* Planet info panel */}
      <AnimatePresence>
        {selectedPlanet && (
          <PlanetInfo planet={selectedPlanet} onClose={closePlanetInfo} />
        )}
      </AnimatePresence>
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [200, 50, 120], fov: 50 }}
        className="absolute inset-0 z-0"
        shadows
        gl={{ 
          antialias: true,
          powerPreference: "high-performance" 
        }}
      >
        <color attach="background" args={['#030718']} />
        <ambientLight intensity={values.ambientLight} />
        
        {/* Camera controller */}
        <CameraController target={cameraTarget} enabled={!!cameraTarget} />
        
        {/* Essential components load first */}
        <Suspense fallback={<RocketLoader />}>
          <Starfield />
          <Sun 
            position={[0, 0, 0]} 
            onClick={handlePlanetClick}
            timeSpeed={values.timeScale}
          />
          
          {/* Inner planets load next */}
          {loadStage >= 1 && (
            <>
              <Suspense fallback={null}>
                {showOrbitLines && <OrbitLine radius={values.mercuryOrbit} color="#6A6A92" eccentricity={0.2}/>}
                <Mercury 
                  orbitRadius={values.mercuryOrbit}
                  onClick={handlePlanetClick}
                  timeSpeed={values.timeScale}
                />
                
                {showOrbitLines && <OrbitLine radius={values.venusOrbit} color="#E89D65" eccentricity={0.1}/>}
                <Venus 
                  orbitRadius={values.venusOrbit}
                  onClick={handlePlanetClick}
                  timeSpeed={values.timeScale}
                />
              </Suspense>
            </>
          )}
          
          {/* Earth and Mars */}
          {loadStage >= 2 && (
            <Suspense fallback={null}>
              {showOrbitLines && <OrbitLine radius={values.earthOrbit} color="#4A99E9" eccentricity={0.017}/>}
              <Earth 
                orbitRadius={values.earthOrbit}
                onClick={handlePlanetClick}
                timeSpeed={values.timeScale}
              />
              
              {showOrbitLines && <OrbitLine radius={values.marsOrbit} color="#E27B58" eccentricity={0.09}/>}
              <Mars 
                orbitRadius={values.marsOrbit}
                onClick={handlePlanetClick}
                timeSpeed={values.timeScale}
              />
            </Suspense>
          )}
          
          {/* Asteroid belt - load after Mars */}
          {loadStage >= 3 && (
            <Suspense fallback={null}>
              <AsteroidBelt 
                innerRadius={values.marsOrbit + 6} 
                outerRadius={values.jupiterOrbit - 10} 
                count={800}
              />
            </Suspense>
          )}
          
          {/* Outer planets */}
          {loadStage >= 4 && (
            <Suspense fallback={null}>
              {showOrbitLines && <OrbitLine radius={values.jupiterOrbit} color="#E8C275" eccentricity={0.049}/>}
              <Jupiter 
                orbitRadius={values.jupiterOrbit} 
                onClick={handlePlanetClick}
                timeSpeed={values.timeScale}
              />
              
              {showOrbitLines && <OrbitLine radius={values.saturnOrbit} color="#E8B465" eccentricity={0.057}/>}
              <Saturn 
                orbitRadius={values.saturnOrbit} 
                onClick={handlePlanetClick}
                timeSpeed={values.timeScale}
              />
            </Suspense>
          )}
          
          {/* Furthest planets */}
          {loadStage >= 5 && (
            <Suspense fallback={null}>
              {showOrbitLines && <OrbitLine radius={values.uranusOrbit} color="#4FC3C3" eccentricity={0.046}/>}
              <Uranus 
                orbitRadius={values.uranusOrbit} 
                onClick={handlePlanetClick}
                timeSpeed={values.timeScale}
              />
              
              {showOrbitLines && <OrbitLine radius={values.neptuneOrbit} color="#3066BE" eccentricity={0.009}/>}
              <Neptune 
                orbitRadius={values.neptuneOrbit} 
                onClick={handlePlanetClick}
                timeSpeed={values.timeScale}
              />
            </Suspense>
          )}
          
          <OrbitControls
            ref={orbitControlsRef}
            enablePan={true}
            enableZoom={true}
            minDistance={17}
            maxDistance={500}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

const Solar = () => {
  return (
    <PlaygroundProvider>
      <SolarContent />
    </PlaygroundProvider>
  );
};

export default Solar;