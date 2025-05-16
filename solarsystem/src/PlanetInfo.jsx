import React from 'react';
import { motion } from 'framer-motion';
import { planetData } from '/src/planetData';

const PlanetInfo = ({ planet, onClose }) => {
  if (!planet) return null;
  
  const data = planetData[planet];
  
  if (!data) return null;
  
  return (
    <motion.div 
      className="absolute bottom-5 left-5 w-80 bg-slate-900/85 backdrop-blur-md rounded-xl p-4 text-white shadow-lg border border-white/10 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-3 border-b border-white/20 pb-2">
        <h2 className="text-2xl font-medium bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          {data.name}
        </h2>
        <button 
          onClick={onClose} 
          className="text-2xl text-white/70 hover:text-white transition-colors w-6 h-6 flex items-center justify-center"
        >
          ×
        </button>
      </div>
      
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex justify-between">
          <span className="text-blue-300 text-sm">Diameter:</span>
          <span className="font-medium">{data.diameter.toLocaleString()} km</span>
        </div>
        <div className="flex justify-between">
          <span className="text-blue-300 text-sm">Rotation Period:</span>
          <span className="font-medium">{data.rotation}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-blue-300 text-sm">Distance from Sun:</span>
          <span className="font-medium">{data.distance.toLocaleString()} million km</span>
        </div>
      </div>
      
      <p className="text-sm leading-relaxed text-white/90 mb-3">{data.description}</p>
      
      <div className="bg-cyan-900/30 rounded-lg p-2.5 mt-3">
        <h4 className="text-cyan-400 text-base font-medium mb-1">Did You Know?</h4>
        <p className="text-sm">{data.fact}</p>
      </div>
    </motion.div>
  );
};

export default PlanetInfo;