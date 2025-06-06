import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayground } from './PlaygroundContext';
import { 
  ChevronDown, 
  X, 
  RotateCcw, 
  Rocket, 
  Globe, 
  Sun, 
  Mountain,
  Wind
} from 'lucide-react';

const Slider = ({ label, value, min, max, step, onChange, unit = '' }) => (
  <div className="mb-3">
    <div className="flex justify-between items-center mb-1">
      <label className="text-xs text-gray-300">{label}</label>
      <span className="text-xs text-cyan-400 font-mono">
        {typeof value === 'number' ? value.toFixed(step < 0.01 ? 3 : 2) : value}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
    />
  </div>
);

const Section = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-gray-700 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-800 transition-colors"
      >
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Playground = ({ isOpen, onClose }) => {
  const { values, updateValue, resetToDefaults } = usePlayground();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={onClose}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full sm:w-80 lg:w-96 bg-gray-900 shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Rocket size={20} />
                  Playground
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={resetToDefaults}
                    className="px-3 py-1 text-xs bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors flex items-center gap-1"
                  >
                    <RotateCcw size={12} />
                    Reset
                  </button>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-800 rounded transition-colors"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Global Settings */}
                <Section title={<><Globe size={16} className="inline mr-2" />Global Settings</>} defaultOpen={true}>
                  <Slider
                    label="Time Scale"
                    value={values.timeScale}
                    min={0.2}
                    max={10}
                    step={0.2}
                    onChange={(val) => updateValue('timeScale', val)}
                    unit="x"
                  />
                  <Slider
                    label="Ambient Light"
                    value={values.ambientLight}
                    min={0}
                    max={2}
                    step={0.1}
                    onChange={(val) => updateValue('ambientLight', val)}
                  />
                </Section>

                {/* Sun */}
                <Section title={<><Sun size={16} className="inline mr-2" />Sun</>}>
                  <Slider
                    label="Size"
                    value={values.sunSize}
                    min={1}
                    max={10}
                    step={0.1}
                    onChange={(val) => updateValue('sunSize', val)}
                  />
                  <Slider
                    label="Rotation Speed"
                    value={values.sunRotationSpeed}
                    min={0}
                    max={0.05}
                    step={0.001}
                    onChange={(val) => updateValue('sunRotationSpeed', val)}
                  />
                </Section>

                {/* Inner Planets */}
                <Section title={<><Mountain size={16} className="inline mr-2" />Inner Planets</>}>
                  <div className="space-y-4">
                    {/* Mercury */}
                    <div className="bg-gray-800 p-3 rounded">
                      <h4 className="text-sm font-medium text-orange-400 mb-2">☿ Mercury</h4>
                      <Slider
                        label="Orbit Distance"
                        value={values.mercuryOrbit}
                        min={5}
                        max={15}
                        step={0.5}
                        onChange={(val) => updateValue('mercuryOrbit', val)}
                        unit=" AU"
                      />
                      <Slider
                        label="Size"
                        value={values.mercurySize}
                        min={0.1}
                        max={2}
                        step={0.01}
                        onChange={(val) => updateValue('mercurySize', val)}
                      />
                      <Slider
                        label="Orbit Speed"
                        value={values.mercurySpeed}
                        min={0}
                        max={0.5}
                        step={0.001}
                        onChange={(val) => updateValue('mercurySpeed', val)}
                      />
                      <Slider
                        label="Rotation Speed"
                        value={values.mercuryRotation}
                        min={0}
                        max={0.02}
                        step={0.001}
                        onChange={(val) => updateValue('mercuryRotation', val)}
                      />
                    </div>

                    {/* Venus */}
                    <div className="bg-gray-800 p-3 rounded">
                      <h4 className="text-sm font-medium text-yellow-400 mb-2">♀ Venus</h4>
                      <Slider
                        label="Orbit Distance"
                        value={values.venusOrbit}
                        min={8}
                        max={20}
                        step={0.5}
                        onChange={(val) => updateValue('venusOrbit', val)}
                        unit=" AU"
                      />
                      <Slider
                        label="Size"
                        value={values.venusSize}
                        min={0.1}
                        max={2}
                        step={0.01}
                        onChange={(val) => updateValue('venusSize', val)}
                      />
                      <Slider
                        label="Orbit Speed"
                        value={values.venusSpeed}
                        min={0}
                        max={0.4}
                        step={0.001}
                        onChange={(val) => updateValue('venusSpeed', val)}
                      />
                      <Slider
                        label="Rotation Speed"
                        value={values.venusRotation}
                        min={-0.01}
                        max={0.01}
                        step={0.001}
                        onChange={(val) => updateValue('venusRotation', val)}
                      />
                    </div>

                    {/* Earth */}
                    <div className="bg-gray-800 p-3 rounded">
                      <h4 className="text-sm font-medium text-blue-400 mb-2">🌍 Earth</h4>
                      <Slider
                        label="Orbit Distance"
                        value={values.earthOrbit}
                        min={12}
                        max={25}
                        step={0.5}
                        onChange={(val) => updateValue('earthOrbit', val)}
                        unit=" AU"
                      />
                      <Slider
                        label="Size"
                        value={values.earthSize}
                        min={0.1}
                        max={3}
                        step={0.01}
                        onChange={(val) => updateValue('earthSize', val)}
                      />
                      <Slider
                        label="Orbit Speed"
                        value={values.earthSpeed}
                        min={0}
                        max={0.3}
                        step={0.001}
                        onChange={(val) => updateValue('earthSpeed', val)}
                      />
                      <Slider
                        label="Rotation Speed"
                        value={values.earthRotation}
                        min={0}
                        max={0.05}
                        step={0.001}
                        onChange={(val) => updateValue('earthRotation', val)}
                      />
                    </div>

                    {/* Mars */}
                    <div className="bg-gray-800 p-3 rounded">
                      <h4 className="text-sm font-medium text-red-400 mb-2">♂ Mars</h4>
                      <Slider
                        label="Orbit Distance"
                        value={values.marsOrbit}
                        min={20}
                        max={35}
                        step={0.5}
                        onChange={(val) => updateValue('marsOrbit', val)}
                        unit=" AU"
                      />
                      <Slider
                        label="Size"
                        value={values.marsSize}
                        min={0.1}
                        max={2}
                        step={0.01}
                        onChange={(val) => updateValue('marsSize', val)}
                      />
                      <Slider
                        label="Orbit Speed"
                        value={values.marsSpeed}
                        min={0}
                        max={0.25}
                        step={0.001}
                        onChange={(val) => updateValue('marsSpeed', val)}
                      />
                      <Slider
                        label="Rotation Speed"
                        value={values.marsRotation}
                        min={0}
                        max={0.02}
                        step={0.001}
                        onChange={(val) => updateValue('marsRotation', val)}
                      />
                    </div>
                  </div>
                </Section>

                {/* Outer Planets */}
                <Section title={<><Wind size={16} className="inline mr-2" />Gas Giants</>}>
                  <div className="space-y-4">
                    {/* Jupiter */}
                    <div className="bg-gray-800 p-3 rounded">
                      <h4 className="text-sm font-medium text-orange-300 mb-2">♃ Jupiter</h4>
                      <Slider
                        label="Orbit Distance"
                        value={values.jupiterOrbit}
                        min={40}
                        max={70}
                        step={1}
                        onChange={(val) => updateValue('jupiterOrbit', val)}
                        unit=" AU"
                      />
                      <Slider
                        label="Size"
                        value={values.jupiterSize}
                        min={1}
                        max={15}
                        step={0.1}
                        onChange={(val) => updateValue('jupiterSize', val)}
                      />
                      <Slider
                        label="Orbit Speed"
                        value={values.jupiterSpeed}
                        min={0}
                        max={0.15}
                        step={0.001}
                        onChange={(val) => updateValue('jupiterSpeed', val)}
                      />
                      <Slider
                        label="Rotation Speed"
                        value={values.jupiterRotation}
                        min={0}
                        max={0.05}
                        step={0.001}
                        onChange={(val) => updateValue('jupiterRotation', val)}
                      />
                    </div>

                    {/* Saturn */}
                    <div className="bg-gray-800 p-3 rounded">
                      <h4 className="text-sm font-medium text-yellow-300 mb-2">♄ Saturn</h4>
                      <Slider
                        label="Orbit Distance"
                        value={values.saturnOrbit}
                        min={50}
                        max={80}
                        step={1}
                        onChange={(val) => updateValue('saturnOrbit', val)}
                        unit=" AU"
                      />
                      <Slider
                        label="Size"
                        value={values.saturnSize}
                        min={1}
                        max={12}
                        step={0.1}
                        onChange={(val) => updateValue('saturnSize', val)}
                      />
                      <Slider
                        label="Orbit Speed"
                        value={values.saturnSpeed}
                        min={0}
                        max={0.12}
                        step={0.001}
                        onChange={(val) => updateValue('saturnSpeed', val)}
                      />
                      <Slider
                        label="Rotation Speed"
                        value={values.saturnRotation}
                        min={0}
                        max={0.05}
                        step={0.001}
                        onChange={(val) => updateValue('saturnRotation', val)}
                      />
                    </div>

                    {/* Uranus */}
                    <div className="bg-gray-800 p-3 rounded">
                      <h4 className="text-sm font-medium text-cyan-300 mb-2">⛢ Uranus</h4>
                      <Slider
                        label="Orbit Distance"
                        value={values.uranusOrbit}
                        min={60}
                        max={90}
                        step={1}
                        onChange={(val) => updateValue('uranusOrbit', val)}
                        unit=" AU"
                      />
                      <Slider
                        label="Size"
                        value={values.uranusSize}
                        min={1}
                        max={8}
                        step={0.1}
                        onChange={(val) => updateValue('uranusSize', val)}
                      />
                      <Slider
                        label="Orbit Speed"
                        value={values.uranusSpeed}
                        min={0}
                        max={0.1}
                        step={0.001}
                        onChange={(val) => updateValue('uranusSpeed', val)}
                      />
                      <Slider
                        label="Rotation Speed"
                        value={values.uranusRotation}
                        min={0}
                        max={0.03}
                        step={0.001}
                        onChange={(val) => updateValue('uranusRotation', val)}
                      />
                    </div>

                    {/* Neptune */}
                    <div className="bg-gray-800 p-3 rounded">
                      <h4 className="text-sm font-medium text-blue-300 mb-2">♆ Neptune</h4>
                      <Slider
                        label="Orbit Distance"
                        value={values.neptuneOrbit}
                        min={70}
                        max={100}
                        step={1}
                        onChange={(val) => updateValue('neptuneOrbit', val)}
                        unit=" AU"
                      />
                      <Slider
                        label="Size"
                        value={values.neptuneSize}
                        min={1}
                        max={8}
                        step={0.1}
                        onChange={(val) => updateValue('neptuneSize', val)}
                      />
                      <Slider
                        label="Orbit Speed"
                        value={values.neptuneSpeed}
                        min={0}
                        max={0.08}
                        step={0.001}
                        onChange={(val) => updateValue('neptuneSpeed', val)}
                      />
                      <Slider
                        label="Rotation Speed"
                        value={values.neptuneRotation}
                        min={0}
                        max={0.03}
                        step={0.001}
                        onChange={(val) => updateValue('neptuneRotation', val)}
                      />
                    </div>
                  </div>
                </Section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Custom CSS for sliders */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #22d3ee;
          cursor: pointer;
          border: 2px solid #0f172a;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #22d3ee;
          cursor: pointer;
          border: 2px solid #0f172a;
        }
      `}</style>
    </>
  );
};

export default Playground;
