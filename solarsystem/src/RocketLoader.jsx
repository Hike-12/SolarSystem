// RocketLoader.jsx
import React from 'react';
import { motion } from "framer-motion";
import { useProgress, Html } from '@react-three/drei';

const RocketLoader = () => {
  const { progress } = useProgress();
  const progressPercent = progress.toFixed(0);
  
  return (
    <Html fullscreen>
      <div className="loading-container">
        <div className="stars-background" />
        
        <div className="rocket-scene">
          {/* Launch platform */}
          <motion.div className="launch-platform" />
          
          {/* Rocket body */}
          <motion.div 
            className="rocket"
            initial={{ y: 0 }}
            animate={{ 
              y: progress > 95 ? -500 : Math.max(-100, -progress * 2),
              rotate: progress > 80 ? [-1, 1, -1, 0] : 0
            }}
            transition={{ 
              y: { duration: 1.5, ease: "easeOut" },
              rotate: { duration: 0.2, repeat: progress > 80 ? 3 : 0 }
            }}
          >
            {/* Rocket body */}
            <motion.div className="rocket-body" />
            
            {/* Rocket head */}
            <motion.div className="rocket-head" />
            
            {/* Left fin */}
            <motion.div className="rocket-fin rocket-fin-left" />
            
            {/* Right fin */}
            <motion.div className="rocket-fin rocket-fin-right" />
            
            {/* Window */}
            <motion.div className="rocket-window" />
          </motion.div>
          
          {/* Flame animation */}
          <motion.div 
            className="rocket-flames"
            initial={{ scaleY: 0.5, opacity: 0.7 }}
            animate={{ 
              scaleY: [0.5, 1.5, 0.8, 1.2, 0.5],
              opacity: [0.7, 0.9, 0.8, 1, 0.7],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.5,
              ease: "easeInOut"
            }}
            style={{ 
              y: progress > 95 ? -490 : Math.max(-90, -progress * 2)
            }}
          />
          
          {/* Smoke particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="smoke-particle"
              initial={{ 
                x: (i % 2 === 0 ? -10 : 10) + Math.random() * 20 - 10,
                y: 0,
                scale: 0.5,
                opacity: 1
              }}
              animate={{ 
                x: (i % 2 === 0 ? -40 : 40) + Math.random() * 40 - 20,
                y: 80 + Math.random() * 40,
                scale: 2 + Math.random() * 2,
                opacity: 0
              }}
              transition={{ 
                repeat: Infinity,
                duration: 2 + Math.random() * 2,
                delay: i * 0.2,
                ease: "easeOut"
              }}
              style={{ 
                left: `${50 + (Math.random() * 10 - 5)}%`,
                display: progress > 95 ? 'none' : 'block'
              }}
            />
          ))}
        </div>

        {/* Progress text */}
        <div className="loading-progress">
          <h2>Launching Solar System...</h2>
          <div className="progress-bar">
            <motion.div 
              className="progress-fill"
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p>{progressPercent}%</p>
        </div>
      </div>
      
      <style>{`
        .loading-container {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          background: radial-gradient(circle at center, #030718 0%, #01050e 100%);
          overflow: hidden;
          position: relative;
        }
        
        .stars-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px);
          background-size: 50px 50px;
          background-position: 0 0;
          overflow: hidden;
          opacity: 0.4;
        }
        
        .rocket-scene {
          position: relative;
          height: 300px;
          width: 100px;
          margin-bottom: 30px;
        }
        
        .launch-platform {
          position: absolute;
          bottom: 0;
          left: 25px;
          right: 25px;
          height: 5px;
          background-color: #555;
          border-radius: 2px;
        }
        
        .rocket {
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 100px;
        }
        
        .rocket-body {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 70%;
          background: linear-gradient(90deg, #d3d3d3, white, #d3d3d3);
          border-radius: 5px 5px 0 0;
        }
        
        .rocket-head {
          position: absolute;
          top: -10px;
          left: 0;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #ff4e50, #f9d423);
          border-radius: 50% 50% 0 0;
          clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
        }
        
        .rocket-fin {
          position: absolute;
          bottom: 0;
          width: 15px;
          height: 25px;
          background-color: #ff4e50;
        }
        
        .rocket-fin-left {
          left: -15px;
          border-radius: 5px 0 0 0;
          clip-path: polygon(100% 0%, 100% 100%, 0% 100%);
        }
        
        .rocket-fin-right {
          right: -15px;
          border-radius: 0 5px 0 0;
          clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
        }
        
        .rocket-window {
          position: absolute;
          top: 35px;
          left: 50%;
          transform: translateX(-50%);
          width: 15px;
          height: 15px;
          background-color: #66c6ff;
          border-radius: 50%;
          border: 2px solid white;
        }
        
        .rocket-flames {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 40px;
          background: linear-gradient(to top, transparent, #ff9500, #ff5e3a);
          border-radius: 0 0 5px 5px;
          z-index: -1;
          transform-origin: top;
        }
        
        .smoke-particle {
          position: absolute;
          bottom: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: rgba(200, 200, 200, 0.6);
        }
        
        .loading-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 30px;
        }
        
        .progress-bar {
          width: 250px;
          height: 10px;
          background: #222;
          border-radius: 5px;
          overflow: hidden;
          margin: 15px 0;
          box-shadow: 0 0 10px rgba(255,255,255,0.2);
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4fc3c3, #3066BE);
          border-radius: 5px;
        }
        
        h2 {
          margin: 0;
          font-weight: 500;
          text-shadow: 0 0 10px rgba(79, 195, 195, 0.5);
        }
        
        p {
          font-size: 18px;
          margin: 5px 0;
        }
      `}</style>
    </Html>
  );
};

export default RocketLoader;