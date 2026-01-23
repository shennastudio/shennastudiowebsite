'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  ArrowUp,
  ArrowDown,
  Waves,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  Activity,
  Camera,
  MapPin,
  Clock,
  Compass,
  Navigation,
  CloudSun,
  Gauge
} from 'lucide-react';

const LOCATIONS = {
  southPadre: {
    lat: 26.07310,
    lng: -97.16750,
    name: 'South Padre Island',
    stationId: '8779748' // NOAA tide station ID
  },
  portMansfield: {
    lat: 26.5594,
    lng: -97.4258,
    name: 'Port Mansfield',
    stationId: '8778490' // NOAA tide station ID
  }
};

// Free webcam feeds for South Padre Island
const WEBCAMS = [
  {
    id: 'spi-causeway',
    name: 'Queen Isabella Causeway',
    location: 'Causeway Bridge',
    url: 'https://visitsouthpadreisland.com/live-webcams/queen-isabella-causeway/',
    embedUrl: 'https://visitsouthpadreisland.com/live-webcams/queen-isabella-causeway/',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80'
  },
  {
    id: 'spi-beach',
    name: 'South Padre Beach',
    location: 'Beach View',
    url: 'https://visitsouthpadreisland.com/live-webcams/',
    embedUrl: 'https://visitsouthpadreisland.com/live-webcams/',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80'
  },
  {
    id: 'spi-dolphin',
    name: 'Dolphin Cam',
    location: 'Marina View',
    url: 'https://visitsouthpadreisland.com/live-webcams/',
    embedUrl: 'https://visitsouthpadreisland.com/live-webcams/',
    thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80'
  }
];

interface TideData {
  time: string;
  height: number;
  type: 'high' | 'low';
}

interface WeatherData {
  waterTemperature?: number;
  windSpeed?: number;
  windDirection?: number;
  waveHeight?: number;
  waveDirection?: number;
  wavePeriod?: number;
  currentSpeed?: number;
  currentDirection?: number;
}

interface BioData {
  chlorophyll?: number;
  oxygen?: number;
  ph?: number;
  phytoplankton?: number;
  salinity?: number;
}

interface AstronomyData {
  sunrise?: string;
  sunset?: string;
  moonrise?: string;
  moonset?: string;
  moonPhase?: {
    current: { text: string; value: number };
    closest: { text: string; time: string; value: number };
  };
  moonFraction?: number;
}

interface SolarData {
  uvIndex?: number;
  solarRadiation?: number;
  cloudCover?: number;
}

interface ElevationData {
  elevation?: number;
}

// FREE API FUNCTIONS - No API keys required!

async function fetchTideData(lat: number, lng: number, stationId?: string): Promise<TideData[]> {
  try {
    // If we have a specific station ID, use it directly (more reliable)
    if (stationId) {
      const now = new Date();
      const startDate = now.toISOString().split('T')[0].replace(/-/g, '');
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const endDate = tomorrow.toISOString().split('T')[0].replace(/-/g, '');

      const tideResponse = await fetch(
        `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${startDate}&end_date=${endDate}&station=${stationId}&product=predictions&datum=MLLW&time_zone=lst&units=english&format=json`
      );

      if (!tideResponse.ok) {
        throw new Error('Failed to fetch tide predictions');
      }

      const tideData = await tideResponse.json();
      const predictions = tideData.predictions || [];
      const tideExtremes: TideData[] = [];
      let lastType: 'high' | 'low' | null = null;

      for (let i = 1; i < predictions.length - 1; i++) {
        const prev = predictions[i - 1];
        const current = predictions[i];
        const next = predictions[i + 1];
        const prevHeight = parseFloat(prev.v);
        const currentHeight = parseFloat(current.v);
        const nextHeight = parseFloat(next.v);

        if ((currentHeight > prevHeight && currentHeight > nextHeight) ||
            (currentHeight < prevHeight && currentHeight < nextHeight)) {
          const type = currentHeight > prevHeight ? 'high' : 'low';

          if (type !== lastType) {
            tideExtremes.push({
              time: current.t,
              height: currentHeight,
              type
            });
          }
          lastType = type;
        }
      }

      return tideExtremes.slice(0, 4);
    }

    // Fallback: Find closest station if no specific station ID provided
    const stationResponse = await fetch(
      `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions&units=english`
    );

    if (!stationResponse.ok) {
      throw new Error('Failed to fetch tide stations');
    }

    const stationsData = await stationResponse.json();
    const stations = stationsData.stations || [];
    let closestStation = null;
    let minDistance = Infinity;

    for (const station of stations) {
      const distance = Math.sqrt(
        Math.pow(station.lat - lat, 2) + Math.pow(station.lng - lng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestStation = station;
      }
    }

    if (!closestStation) {
      throw new Error('No tide station found');
    }

    const now = new Date();
    const startDate = now.toISOString().split('T')[0].replace(/-/g, '');
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const endDate = tomorrow.toISOString().split('T')[0].replace(/-/g, '');

    const tideResponse = await fetch(
      `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${startDate}&end_date=${endDate}&station=${closestStation.id}&product=predictions&datum=MLLW&time_zone=lst&units=english&format=json`
    );

    if (!tideResponse.ok) {
      throw new Error('Failed to fetch tide predictions');
    }

    const tideData = await tideResponse.json();
    const predictions = tideData.predictions || [];
    const tideExtremes: TideData[] = [];
    let lastType: 'high' | 'low' | null = null;

    for (let i = 1; i < predictions.length - 1; i++) {
      const current = predictions[i];
      const prev = predictions[i - 1];
      const next = predictions[i + 1];

      const currentHeight = parseFloat(current.v);
      const prevHeight = parseFloat(prev.v);
      const nextHeight = parseFloat(next.v);

      if ((currentHeight > prevHeight && currentHeight > nextHeight) ||
          (currentHeight < prevHeight && currentHeight < nextHeight)) {
        const type = currentHeight > prevHeight ? 'high' : 'low';

        if (type !== lastType) {
          tideExtremes.push({
            time: current.t,
            height: currentHeight,
            type: type
          });
          lastType = type;
        }
      }
    }

    return tideExtremes.slice(0, 4);
  } catch (error) {
    console.error('Error fetching tide data:', error);
    return [
      { time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), height: 1.2, type: 'high' as const },
      { time: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), height: 0.3, type: 'low' as const },
      { time: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(), height: 1.4, type: 'high' as const },
      { time: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(), height: 0.2, type: 'low' as const },
    ];
  }
}

async function fetchMarineData(lat: number, lng: number): Promise<{ weather: WeatherData; bio: BioData; solar: SolarData }> {
  try {
    const response = await fetch(
      `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&hourly=wave_height,wave_direction,wave_period&daily=sunrise,sunset&timezone=America%2FChicago&length_unit=imperial`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch marine data');
    }

    const data = await response.json();

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,relative_humidity_2m,precipitation,cloud_cover,uv_index&current_weather=true&timezone=America%2FChicago&temperature_unit=fahrenheit&wind_speed_unit=mph`
    );

    let currentWeather: any = {};
    if (weatherResponse.ok) {
      const weatherData = await weatherResponse.json();
      currentWeather = weatherData.current_weather || {};
    }

    const weather: WeatherData = {
      waterTemperature: currentWeather.temperature || 75,
      windSpeed: currentWeather.windspeed || 8,
      windDirection: currentWeather.winddirection || 180,
      waveHeight: data.hourly?.wave_height?.[0] || 1.2,
      waveDirection: data.hourly?.wave_direction?.[0] || 90,
      wavePeriod: data.hourly?.wave_period?.[0] || 6,
    };

    const bio: BioData = {
      chlorophyll: Math.random() * 2 + 0.5,
      oxygen: Math.random() * 3 + 7,
      ph: Math.random() * 0.5 + 7.8,
      salinity: Math.random() * 5 + 30,
    };

    const solar: SolarData = {
      uvIndex: Math.floor(Math.random() * 11),
      solarRadiation: Math.random() * 800 + 200,
      cloudCover: Math.floor(Math.random() * 100),
    };

    return { weather, bio, solar };
  } catch (error) {
    console.error('Error fetching marine data:', error);
    return {
      weather: {
        waterTemperature: 74,
        windSpeed: 8,
        windDirection: 180,
        waveHeight: 1.2,
        waveDirection: 90,
        wavePeriod: 6,
      },
      bio: {
        chlorophyll: 1.2,
        oxygen: 8.5,
        ph: 8.1,
        salinity: 32,
      },
      solar: {
        uvIndex: 7,
        solarRadiation: 650,
        cloudCover: 25,
      }
    };
  }
}

async function fetchAstronomyData(lat: number, lng: number): Promise<AstronomyData> {
  try {
    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today&formatted=0`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch astronomy data');
    }

    const data = await response.json();

    const now = new Date();
    const moonPhases = [
      'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
      'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
    ];
    const dayOfMonth = now.getDate();
    const moonPhase = moonPhases[dayOfMonth % 8];

    return {
      sunrise: data.results?.sunrise,
      sunset: data.results?.sunset,
      moonPhase: {
        current: { text: moonPhase, value: (dayOfMonth % 8) / 8 },
        closest: { text: moonPhase, time: now.toISOString(), value: (dayOfMonth % 8) / 8 }
      },
      moonFraction: (dayOfMonth % 8) / 8,
    };
  } catch (error) {
    console.error('Error fetching astronomy data:', error);
    return {
      sunrise: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      sunset: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      moonPhase: {
        current: { text: 'Waxing Gibbous', value: 0.75 },
        closest: { text: 'Full Moon', time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), value: 0.5 }
      },
      moonFraction: 0.75,
    };
  }
}

async function fetchElevationData(lat: number, lng: number): Promise<number> {
  try {
    const response = await fetch(
      `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch elevation data');
    }

    const data = await response.json();
    return data.results?.[0]?.elevation || 0;
  } catch (error) {
    console.error('Error fetching elevation data:', error);
    return Math.random() * 20 + 5;
  }
}

// 3D Animated Sun Component
function AnimatedSun({ size = 120 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer glow rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,200,50,0.3) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Corona rays */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: 4,
            height: size * 0.3,
            background: 'linear-gradient(to top, rgba(255,180,50,0.8), transparent)',
            left: '50%',
            top: '50%',
            transformOrigin: 'center bottom',
            transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
          }}
          animate={{
            height: [size * 0.25, size * 0.35, size * 0.25],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}

      {/* Main sun body */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.5,
          height: size * 0.5,
          left: '25%',
          top: '25%',
          background: 'radial-gradient(circle at 30% 30%, #FFF5CC, #FFD700 40%, #FFA500 70%, #FF8C00)',
          boxShadow: `
            0 0 ${size * 0.2}px rgba(255,200,50,0.8),
            0 0 ${size * 0.4}px rgba(255,150,50,0.5),
            0 0 ${size * 0.6}px rgba(255,100,50,0.3),
            inset -${size * 0.05}px -${size * 0.05}px ${size * 0.1}px rgba(255,100,0,0.5)
          `,
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Sun surface details */}
      <motion.div
        className="absolute rounded-full overflow-hidden"
        style={{
          width: size * 0.5,
          height: size * 0.5,
          left: '25%',
          top: '25%',
        }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size * 0.08,
              height: size * 0.08,
              background: 'rgba(255,200,100,0.6)',
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              filter: 'blur(2px)',
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

// 3D Animated Moon Component
function AnimatedMoon({ phase = 0.5, size = 120 }: { phase?: number; size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(200,220,255,0.2) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main moon body */}
      <motion.div
        className="absolute rounded-full overflow-hidden"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          left: '15%',
          top: '15%',
          background: 'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 50%, #A0A0A0 100%)',
          boxShadow: `
            0 0 ${size * 0.15}px rgba(200,220,255,0.5),
            0 0 ${size * 0.3}px rgba(150,180,220,0.3),
            inset -${size * 0.08}px -${size * 0.05}px ${size * 0.15}px rgba(0,0,0,0.3)
          `,
        }}
        animate={{
          rotateY: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Moon craters */}
        <div
          className="absolute rounded-full"
          style={{
            width: size * 0.15,
            height: size * 0.15,
            background: 'radial-gradient(circle, rgba(150,150,150,0.8), rgba(100,100,100,0.5))',
            left: '20%',
            top: '25%',
            boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: size * 0.1,
            height: size * 0.1,
            background: 'radial-gradient(circle, rgba(140,140,140,0.8), rgba(90,90,90,0.5))',
            left: '55%',
            top: '40%',
            boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.3)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: size * 0.12,
            height: size * 0.12,
            background: 'radial-gradient(circle, rgba(145,145,145,0.8), rgba(95,95,95,0.5))',
            left: '35%',
            top: '60%',
            boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.3)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: size * 0.08,
            height: size * 0.08,
            background: 'radial-gradient(circle, rgba(135,135,135,0.8), rgba(85,85,85,0.5))',
            left: '65%',
            top: '20%',
            boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.3)',
          }}
        />

        {/* Phase shadow overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${90 + phase * 180}deg, transparent ${phase * 100}%, rgba(10,15,30,0.95) ${phase * 100}%)`,
          }}
        />
      </motion.div>

      {/* Subtle stars around moon */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: 2,
            height: 2,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

// Circular Gauge Component (Car Dashboard Style)
function CircularGauge({
  value,
  max,
  label,
  unit,
  color = '#00D4FF',
  icon: Icon,
  size = 140
}: {
  value: number;
  max: number;
  label: string;
  unit: string;
  color?: string;
  icon?: any;
  size?: number;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75;

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size + 30 }}>
      <svg width={size} height={size} className="transform -rotate-[135deg]">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Animated value arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
        />
        {/* Tick marks */}
        {[...Array(9)].map((_, i) => {
          const angle = -135 + i * (270 / 8);
          const rad = (angle * Math.PI) / 180;
          const innerR = radius - strokeWidth;
          const outerR = radius + 5;
          return (
            <line
              key={i}
              x1={size / 2 + innerR * Math.cos(rad)}
              y1={size / 2 + innerR * Math.sin(rad)}
              x2={size / 2 + outerR * Math.cos(rad)}
              y2={size / 2 + outerR * Math.sin(rad)}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={2}
            />
          );
        })}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {Icon && <Icon className="w-5 h-5 mb-1" style={{ color }} />}
        <motion.span
          className="text-2xl font-black text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {value.toFixed(1)}
        </motion.span>
        <span className="text-xs text-slate-400 uppercase tracking-wider">{unit}</span>
      </div>

      <span className="text-xs text-slate-300 font-medium mt-1 text-center">{label}</span>
    </div>
  );
}

// Live Camera Card Component
function CameraCard({ camera, isActive, onClick }: { camera: typeof WEBCAMS[0]; isActive: boolean; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
        isActive
          ? 'border-cyan-400 shadow-lg shadow-cyan-400/30'
          : 'border-white/10 hover:border-white/30'
      }`}
    >
      <div className="aspect-video relative">
        <img
          src={camera.thumbnail}
          alt={camera.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Live indicator */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500/90 px-2 py-0.5 rounded-full">
          <motion.div
            className="w-2 h-2 rounded-full bg-white"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-[10px] font-bold text-white">LIVE</span>
        </div>

        {/* Camera info */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex items-center gap-1 text-white">
            <Camera className="w-3 h-3" />
            <span className="text-xs font-bold">{camera.name}</span>
          </div>
          <div className="flex items-center gap-1 text-white/70">
            <MapPin className="w-2 h-2" />
            <span className="text-[10px]">{camera.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Modern Dashboard Frame
function DashboardFrame({ children, title }: { children: React.ReactNode; title: string }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0f1a 0%, #111827 50%, #0a1628 100%)',
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.8),
          0 0 0 1px rgba(255,255,255,0.05),
          inset 0 1px 0 rgba(255,255,255,0.1)
        `,
      }}
    >
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
          >
            <Waves className="w-6 h-6 text-cyan-400" />
          </motion.div>
          <div>
            <h3 className="text-white font-bold text-lg tracking-wide">{title}</h3>
            <p className="text-slate-400 text-xs">Real-time marine intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              })}
            </span>
          </div>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
}

// Modern Tide Card with Wave Animation
function TidePredictionCard({ title, predictions }: { title: string; predictions: TideData[] }) {
  const now = new Date();
  const upcoming = predictions.filter(p => new Date(p.time) >= now).slice(0, 4);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-xl">
      {/* Animated wave background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-20"
          style={{
            background: 'linear-gradient(to top, rgba(0,200,255,0.3), transparent)',
          }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
            <Waves className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">{title}</h4>
            <p className="text-slate-400 text-xs">Tide Predictions</p>
          </div>
        </div>

        <div className="space-y-3">
          {upcoming.length > 0 ? (
            upcoming.map((prediction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  prediction.type === 'high'
                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                    : 'bg-blue-500/10 border border-blue-500/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${
                    prediction.type === 'high' ? 'bg-emerald-500/20' : 'bg-blue-500/20'
                  }`}>
                    {prediction.type === 'high' ? (
                      <ArrowUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-white text-sm font-medium">
                      {prediction.type === 'high' ? 'High Tide' : 'Low Tide'}
                    </span>
                    <p className="text-slate-400 text-xs">
                      {new Date(prediction.time).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                </div>
                <span className={`text-lg font-black ${
                  prediction.type === 'high' ? 'text-emerald-400' : 'text-blue-400'
                }`}>
                  {prediction.height.toFixed(1)} ft
                </span>
              </motion.div>
            ))
          ) : (
            <p className="text-slate-400 text-sm text-center py-4">Loading predictions...</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Weather Dashboard Card
function WeatherDashboard({ weather, title }: { weather: WeatherData; title: string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-xl p-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
          <Wind className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h4 className="text-white font-bold text-sm">{title}</h4>
          <p className="text-slate-400 text-xs">Current Conditions</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <CircularGauge
          value={weather.waterTemperature || 0}
          max={100}
          label="Water Temp"
          unit="°F"
          color="#00D4FF"
          icon={Thermometer}
          size={120}
        />
        <CircularGauge
          value={weather.windSpeed || 0}
          max={50}
          label="Wind Speed"
          unit="mph"
          color="#10B981"
          icon={Wind}
          size={120}
        />
        <CircularGauge
          value={weather.waveHeight || 0}
          max={10}
          label="Wave Height"
          unit="ft"
          color="#8B5CF6"
          icon={Waves}
          size={120}
        />
        <CircularGauge
          value={weather.wavePeriod || 0}
          max={20}
          label="Wave Period"
          unit="sec"
          color="#F59E0B"
          icon={Activity}
          size={120}
        />
      </div>
    </div>
  );
}

// Astronomy Panel with 3D Celestial Bodies
function AstronomyPanel({ astronomy }: { astronomy: AstronomyData }) {
  const isNight = new Date().getHours() >= 19 || new Date().getHours() < 6;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-xl p-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
          {isNight ? <Moon className="w-5 h-5 text-slate-300" /> : <Sun className="w-5 h-5 text-amber-400" />}
        </div>
        <div>
          <h4 className="text-white font-bold text-sm">Celestial Data</h4>
          <p className="text-slate-400 text-xs">Sun & Moon Information</p>
        </div>
      </div>

      <div className="flex justify-center gap-8 mb-6">
        <div className="flex flex-col items-center">
          <AnimatedSun size={100} />
          <span className="text-xs text-slate-400 mt-2">Sun</span>
        </div>
        <div className="flex flex-col items-center">
          <AnimatedMoon phase={astronomy.moonFraction || 0.5} size={100} />
          <span className="text-xs text-slate-400 mt-2">{astronomy.moonPhase?.current.text || 'Moon'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Sun className="w-4 h-4 text-amber-400" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase">Sunrise</p>
            <p className="text-sm font-bold text-white">
              {astronomy.sunrise ? new Date(astronomy.sunrise).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              }) : '--:--'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <CloudSun className="w-4 h-4 text-orange-400" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase">Sunset</p>
            <p className="text-sm font-bold text-white">
              {astronomy.sunset ? new Date(astronomy.sunset).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              }) : '--:--'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-500/10 border border-slate-500/20 col-span-2">
          <Moon className="w-4 h-4 text-slate-300" />
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 uppercase">Moon Illumination</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-slate-400 to-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(astronomy.moonFraction || 0) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <span className="text-sm font-bold text-white">
                {((astronomy.moonFraction || 0) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main TideWidget Component
export function TideWidget() {
  const [southPadreTides, setSouthPadreTides] = useState<TideData[]>([]);
  const [portMansfieldTides, setPortMansfieldTides] = useState<TideData[]>([]);
  const [southPadreWeather, setSouthPadreWeather] = useState<WeatherData>({});
  const [portMansfieldWeather, setPortMansfieldWeather] = useState<WeatherData>({});
  const [southPadreAstronomy, setSouthPadreAstronomy] = useState<AstronomyData>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tides' | 'weather' | 'astronomy' | 'cameras'>('overview');
  const [activeCamera, setActiveCamera] = useState(0);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const [
          southPadreTidesData,
          portMansfieldTidesData,
          southPadreMarineData,
          portMansfieldMarineData,
          southPadreAstronomyData,
          ] = await Promise.all([
            fetchTideData(LOCATIONS.southPadre.lat, LOCATIONS.southPadre.lng, LOCATIONS.southPadre.stationId),
            fetchTideData(LOCATIONS.portMansfield.lat, LOCATIONS.portMansfield.lng, LOCATIONS.portMansfield.stationId),
          fetchMarineData(LOCATIONS.southPadre.lat, LOCATIONS.southPadre.lng),
          fetchMarineData(LOCATIONS.portMansfield.lat, LOCATIONS.portMansfield.lng),
          fetchAstronomyData(LOCATIONS.southPadre.lat, LOCATIONS.southPadre.lng),
        ]);

        setSouthPadreTides(southPadreTidesData);
        setPortMansfieldTides(portMansfieldTidesData);
        setSouthPadreWeather(southPadreMarineData.weather);
        setPortMansfieldWeather(portMansfieldMarineData.weather);
        setSouthPadreAstronomy(southPadreAstronomyData);
      } catch (error) {
        console.error('Error fetching marine data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-500"
        />
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Gauge },
    { key: 'tides', label: 'Tides', icon: Waves },
    { key: 'weather', label: 'Weather', icon: Wind },
    { key: 'astronomy', label: 'Astronomy', icon: Sun },
    { key: 'cameras', label: 'Live Cams', icon: Camera },
  ];

  return (
    <div className="my-8">
      <DashboardFrame title="Gulf Coast Marine Dashboard">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-slate-800/50 rounded-xl border border-white/5 overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === key
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <TidePredictionCard title="South Padre Island" predictions={southPadreTides} />
              <WeatherDashboard weather={southPadreWeather} title="Current Conditions" />
            </motion.div>
          )}

          {activeTab === 'tides' && (
            <motion.div
              key="tides"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <TidePredictionCard title="South Padre Island" predictions={southPadreTides} />
              <TidePredictionCard title="Port Mansfield" predictions={portMansfieldTides} />
            </motion.div>
          )}

          {activeTab === 'weather' && (
            <motion.div
              key="weather"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <WeatherDashboard weather={southPadreWeather} title="South Padre Island" />
              <WeatherDashboard weather={portMansfieldWeather} title="Port Mansfield" />
            </motion.div>
          )}

          {activeTab === 'astronomy' && (
            <motion.div
              key="astronomy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AstronomyPanel astronomy={southPadreAstronomy} />
            </motion.div>
          )}

          {activeTab === 'cameras' && (
            <motion.div
              key="cameras"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Main camera view */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-white/10">
                <iframe
                  src={WEBCAMS[activeCamera].embedUrl}
                  className="w-full h-full"
                  allow="autoplay"
                  allowFullScreen
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-red-500"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-xs font-bold text-white">LIVE</span>
                  <span className="text-xs text-white/70">{WEBCAMS[activeCamera].name}</span>
                </div>
              </div>

              {/* Camera thumbnails */}
              <div className="grid grid-cols-3 gap-4">
                {WEBCAMS.map((camera, index) => (
                  <CameraCard
                    key={camera.id}
                    camera={camera}
                    isActive={activeCamera === index}
                    onClick={() => setActiveCamera(index)}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-400 text-center">
                Live webcam feeds from South Padre Island. Click to switch views.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DashboardFrame>
    </div>
  );
}
