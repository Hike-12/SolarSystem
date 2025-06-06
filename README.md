<div align="center">

# 🌌 Celestia - Interactive Solar System

<img src="solarsystem/public/logo.png" alt="Celestia Logo" width="120" height="120">

*An immersive, real-time 3D solar system simulation built with React Three Fiber*

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-Latest-green.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-purple.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


</div>

---

## ✨ Features

### 🪐 **Realistic Solar System**
- **8 Planets** with accurate orbital mechanics and relative sizes
- **Asteroid Belt** with dynamic particle system
- **Planetary Moons** including Earth's Moon with tidal locking
- **Realistic Orbits** with proper eccentricity and elliptical paths

### 🎨 **Stunning Visuals**
- **Custom Shaders** for realistic day/night cycles on planets
- **Saturn's Rings** with transparency and light interaction
- **Starfield Background** with layered galaxy textures
- **Dynamic Lighting** from the Sun with realistic shadows

### 🛠️ **Interactive Playground**
- **Real-time Controls** for every planet's orbit speed, size, and rotation
- **Time Scale Adjustment** from 0.2x to 10x simulation speed
- **Ambient Lighting** controls for different viewing experiences
- **Reset Functionality** to restore default astronomical values

### 📱 **Responsive Design**
- **Mobile Optimized** with touch-friendly controls
- **Progressive Loading** for smooth performance on all devices
- **Adaptive UI** that works on desktop, tablet, and mobile

### 🎵 **Immersive Experience**
- **Ambient Space Audio** with mute/unmute controls
- **Smooth Camera Transitions** when exploring planets
- **Interactive Planet Info** with real astronomical data
- **Toast Notifications** to guide user exploration

---

## 🚀 Demo

**Try it live:** [Celestia Solar System](https://solar-system-mu-amber.vercel.app)

### Key Interactions:
- 🖱️ **Click any planet** to view detailed information
- 🎛️ **Open Playground** to customize the entire solar system
- 👁️ **Toggle orbit lines** to visualize planetary paths
- 🔊 **Audio controls** for immersive space ambiance

---

## 🛠️ Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Hike-12/celestia-solar-system.git
cd celestia-solar-system

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 🗂️ Project Structure

```
celestia-solar-system/
├── public/
│   ├── textures/           # Planet and space textures
│   │   ├── earth-day.jpg
│   │   ├── earth-night.jpg
│   │   ├── jupiter.jpg
│   │   └── ...
│   ├── sounds/             # Audio files
│   └── logo.png
├── src/
│   ├── components/         # Planet components
│   │   ├── Sun.jsx
│   │   ├── Earth.jsx
│   │   ├── Jupiter.jsx
│   │   └── ...
│   ├── ui/                # UI components
│   │   ├── Playground.jsx
│   │   ├── PlanetInfo.jsx
│   │   └── ...
│   ├── context/           # React context
│   │   └── PlaygroundContext.jsx
│   ├── data/              # Planet data
│   │   └── planetData.js
│   └── main.jsx
└── package.json
```

---

## 🎮 Usage

### Basic Navigation
- **Mouse/Touch Drag**: Rotate view around the solar system
- **Scroll/Pinch**: Zoom in and out (min: 17 units, max: 500 units)
- **Planet Click**: View detailed planet information

### Playground Controls
1. **Open Playground**: Click the 🚀 rocket icon in top-right
2. **Adjust Parameters**: Use sliders to modify:
   - Global time scale (0.2x - 10x)
   - Individual planet orbit speeds
   - Planet sizes and distances
   - Rotation speeds
3. **Reset**: Restore all values to astronomical accuracy

### Planet Information
- Click any celestial body to see:
  - Physical characteristics
  - Orbital data
  - Fascinating facts
  - Real astronomical measurements

---

## 🎯 Technical Highlights

### Performance Optimizations
- **Lazy Loading**: Planets load progressively for smooth startup
- **Shader Materials**: Custom GLSL shaders for realistic rendering
- **Efficient Textures**: Optimized texture loading and caching
- **Frame Rate Optimization**: Smooth 60fps on modern devices

### Astronomical Accuracy
- **Relative Orbital Speeds**: Proportionally accurate planet speeds
- **Eccentricity**: Real orbital ellipses (Mercury: 0.2, Neptune: 0.009)
- **Axial Tilts**: Accurate planetary rotations (Uranus: 97.77°)
- **Size Ratios**: Scaled planetary sizes for visual clarity

### Modern Tech Stack
```json
{
  "frontend": "React 18 + Vite",
  "3d": "Three.js + React Three Fiber",
  "styling": "Tailwind CSS",
  "animations": "Framer Motion",
  "state": "React Context + Hooks"
}
```

---

## 🌟 Planet Details

| Planet | Orbit Speed | Special Features |
|--------|-------------|------------------|
| ☿ Mercury | 0.30 | Extreme temperature shader |
| ♀ Venus | 0.225 | Retrograde rotation |
| 🌍 Earth | 0.15 | Day/night cycle + Moon |
| ♂ Mars | 0.12 | Reddish terrain shader |
| ♃ Jupiter | 0.075 | Gas giant with cloud bands |
| ♄ Saturn | 0.06 | Spectacular ring system |
| ⛢ Uranus | 0.045 | 97° axial tilt |
| ♆ Neptune | 0.03 | Windy blue atmosphere |

---

## 🔧 Customization

### Adding New Planets
```jsx
// Create new planet component
const NewPlanet = ({ orbitRadius, onClick, timeSpeed }) => {
  // Your planet implementation
};

// Add to Solar.jsx
<NewPlanet 
  orbitRadius={100} 
  onClick={handlePlanetClick}
  timeSpeed={values.timeScale}
/>
```

### Custom Shaders
```glsl
// Custom fragment shader example
uniform sampler2D dayTexture;
uniform vec3 sunDirection;
varying vec3 vWorldNormal;

void main() {
  float intensity = max(dot(vWorldNormal, sunDirection), 0.0);
  vec3 color = texture2D(dayTexture, vUv).rgb * intensity;
  gl_FragColor = vec4(color, 1.0);
}
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Add proper JSDoc comments
- Test on multiple devices
- Maintain 60fps performance
- Use meaningful commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NASA** for planetary texture references
- **Three.js Community** for 3D graphics inspiration
- **React Three Fiber** for seamless React integration
- **ESA** for astronomical data accuracy

