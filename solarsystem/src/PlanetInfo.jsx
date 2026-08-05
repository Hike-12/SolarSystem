import React from 'react';
import { motion } from 'framer-motion';
import { planetData } from './planetData';
import { IconX as X } from '@tabler/icons-react';

const PlanetInfo = ({ planet, onClose }) => {
  if (!planet) return null;
  
  const data = planetData[planet];
  
  if (!data) return null;
  
  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 md:absolute md:bottom-5 md:left-5 md:right-auto 
                w-full md:w-80 lg:w-96 bg-black/60 backdrop-blur-xl rounded-t-lg md:rounded-lg 
                p-5 text-white shadow-2xl border border-white/10 z-50 max-h-[80vh] overflow-y-auto"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
        <h2 className="text-xl md:text-2xl font-light text-white tracking-wide">
          {data.name}
        </h2>
        <button 
          onClick={onClose} 
          className="text-white/70 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded hover:bg-white/10"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-white/50 text-sm">Diameter</span>
          <span className="font-medium text-white/90">{data.diameter.toLocaleString()} km</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/50 text-sm">Rotation</span>
          <span className="font-medium text-white/90">{data.rotation}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/50 text-sm">Distance</span>
          <span className="font-medium text-white/90">{data.distance.toLocaleString()} M km</span>
        </div>
      </div>
      
      <p className="text-xs md:text-sm leading-relaxed text-white/70 mb-4">{data.description}</p>
      
      <div className="bg-white/5 border border-white/10 rounded-md p-3.5 mt-2">
        <h4 className="text-white/90 text-sm md:text-base font-medium mb-1.5">Did You Know?</h4>
        <p className="text-xs md:text-sm text-white/60 leading-relaxed">{data.fact}</p>
      </div>
    </motion.div>
  );
};

export default PlanetInfo;