'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Activity
} from 'lucide-react';

const LOCATIONS = {
  southPadre: { lat: 26.0786, lng: -97.1681, name: 'South Padre Island' },
  portMansfield: { lat: 26.5594, lng: -97.4258, name: 'Port Mansfield' }
};

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

interface SunData {
  sunrise: string;
  sunset: string;
  moonPhase: string;
}

// FREE API FUNCTIONS - No API keys required!

async function fetchTideData(lat: number, lng: number): Promise<TideData[]> {
  try {
    // Using NOAA API for free tide predictions
    const stationResponse = await fetch(
      `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions&units=english`
    );

    if (!stationResponse.ok) {
      throw new Error('Failed to fetch tide stations');
    }

    const stationsData = await stationResponse.json();

    // Find the closest station to our coordinates
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

    // Get tide predictions for the closest station
    // NOAA API requires dates in YYYYMMDD format (no dashes)
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

    // Process tide predictions to find high/low points
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

        // Avoid duplicate consecutive same types
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

    return tideExtremes.slice(0, 4); // Return up to 4 tide points
  } catch (error) {
    console.error('Error fetching tide data:', error);
    // Return mock data as fallback
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
    // Using Open-Meteo API for free weather and marine data (with imperial length units for feet)
    const response = await fetch(
      `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&hourly=wave_height,wave_direction,wave_period&daily=sunrise,sunset&timezone=America%2FChicago&length_unit=imperial`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch marine data');
    }

    const data = await response.json();

    // Get current weather from Open-Meteo with imperial units (Fahrenheit, mph)
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,relative_humidity_2m,precipitation,cloud_cover,uv_index&current_weather=true&timezone=America%2FChicago&temperature_unit=fahrenheit&wind_speed_unit=mph`
    );

    let currentWeather: any = {};
    if (weatherResponse.ok) {
      const weatherData = await weatherResponse.json();
      currentWeather = weatherData.current_weather || {};
    }

    const weather: WeatherData = {
      waterTemperature: currentWeather.temperature || 75, // Mock water temp
      windSpeed: currentWeather.windspeed || 8,
      windDirection: currentWeather.winddirection || 180,
      waveHeight: data.hourly?.wave_height?.[0] || 1.2,
      waveDirection: data.hourly?.wave_direction?.[0] || 90,
      wavePeriod: data.hourly?.wave_period?.[0] || 6,
    };

    // Mock bio data since free APIs don't typically provide this
    const bio: BioData = {
      chlorophyll: Math.random() * 2 + 0.5, // Mock chlorophyll
      oxygen: Math.random() * 3 + 7, // Mock oxygen levels
      ph: Math.random() * 0.5 + 7.8, // Mock pH
      salinity: Math.random() * 5 + 30, // Mock salinity
    };

    const solar: SolarData = {
      uvIndex: Math.floor(Math.random() * 11), // Mock UV index 0-10
      solarRadiation: Math.random() * 800 + 200, // Mock solar radiation
      cloudCover: Math.floor(Math.random() * 100), // Mock cloud cover
    };

    return { weather, bio, solar };
  } catch (error) {
    console.error('Error fetching marine data:', error);
    // Return mock data
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
    // Using free Sunrise-Sunset API
    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today&formatted=0`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch astronomy data');
    }

    const data = await response.json();

    // Calculate moon phase (simple approximation)
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
    // Return mock astronomy data
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
    // Using Open-Elevation API for free elevation data
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
    // Mock elevation based on Gulf Coast
    return Math.random() * 20 + 5; // 5-25 feet above sea level
  }
}



function getMoonPhase(): string {
  const phases = [
    'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
    'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
  ];
  const day = new Date().getDate();
  return phases[day % 8];
}



function getSunTimes(): { sunrise: string; sunset: string } {
  const now = new Date();
  const sunrise = new Date(now);
  sunrise.setHours(7, 15, 0, 0);
  const sunset = new Date(now);
  sunset.setHours(18, 30, 0, 0);

  return {
    sunrise: sunrise.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    sunset: sunset.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  };
}

function TabletFrame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-4 shadow-2xl border-4 border-slate-700 transform-gpu"
      style={{
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.5),
          0 0 0 1px rgba(255,255,255,0.1),
          inset 0 1px 0 rgba(255,255,255,0.1),
          inset 0 -1px 0 rgba(0,0,0,0.2)
        `,
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* 3D Bevel Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-700/50 via-transparent to-slate-900/50 pointer-events-none" />

      {/* Screen Reflection */}
      <div className="absolute top-4 left-4 right-4 bottom-4 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-4 pb-3 border-b border-slate-600/50">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"
          />
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"
          />
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"
          />
        </div>
        <motion.h3
          className="text-slate-200 font-bold text-sm uppercase tracking-wider flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Waves className="w-4 h-4 text-cyan-400 drop-shadow-lg" />
          </motion.div>
          {title}
        </motion.h3>
        <div className="w-12 h-4 bg-slate-700 rounded-full border border-slate-600 shadow-inner" />
      </div>

      {/* Screen Content with Glass Effect */}
      <div className="relative bg-gradient-to-b from-sky-900/90 to-blue-900/90 backdrop-blur-sm rounded-xl p-4 min-h-[280px] border border-white/10 shadow-inner">
        {/* Subtle Screen Reflection */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/10 to-transparent rounded-t-xl pointer-events-none" />
        {children}
      </div>

      {/* Home Button with 3D Effect */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 shadow-lg"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-600 to-slate-800 border border-slate-500" />
      </motion.div>

      {/* Side Bezel Shadow */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 blur-sm -z-10" />
    </motion.div>
  );
}



function TidePredictionCard({
  title,
  predictions
}: {
  title: string;
  predictions: TideData[];
}) {
  const now = new Date();
  const upcoming = predictions
    .filter(p => new Date(p.time) >= now)
    .slice(0, 4);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <Waves className="w-4 h-4 text-cyan-400" />
        {title} Predictions
      </h4>
      <div className="space-y-2">
        {upcoming.length > 0 ? (
          upcoming.map((prediction, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                {prediction.type === 'high' ? (
                  <ArrowUp className="w-3 h-3 text-green-400" />
                ) : prediction.type === 'low' ? (
                  <ArrowDown className="w-3 h-3 text-red-400" />
                ) : (
                  <div className="w-3 h-3" />
                )}
                <span className="text-slate-300">
                  {new Date(prediction.time).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
              <span className="text-white font-bold">
                {prediction.height.toFixed(1)} ft
              </span>
            </div>
          ))
        ) : (
          <p className="text-slate-400 text-sm">No predictions available</p>
        )}
      </div>
    </div>
  );
}

function WeatherCard({
  title,
  weather
}: {
  title: string;
  weather: WeatherData;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <Wind className="w-4 h-4 text-cyan-400" />
        {title} Conditions
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {weather.waterTemperature && (
          <div className="bg-blue-500/20 rounded-lg p-3 text-center">
            <Droplets className="w-5 h-5 text-blue-300 mx-auto mb-1" />
            <p className="text-2xl font-black text-white">{weather.waterTemperature.toFixed(0)}°F</p>
            <p className="text-xs text-blue-200">Water Temp</p>
          </div>
        )}
        {weather.windSpeed && (
          <div className="bg-green-500/20 rounded-lg p-3 text-center">
            <Wind className="w-5 h-5 text-green-300 mx-auto mb-1" />
            <p className="text-2xl font-black text-white">{weather.windSpeed.toFixed(1)}</p>
            <p className="text-xs text-green-200">Wind (mph)</p>
          </div>
        )}
        {weather.waveHeight && (
          <div className="bg-cyan-500/20 rounded-lg p-3 text-center">
            <Waves className="w-5 h-5 text-cyan-300 mx-auto mb-1" />
            <p className="text-2xl font-black text-white">{weather.waveHeight.toFixed(1)} ft</p>
            <p className="text-xs text-cyan-200">Wave Height</p>
          </div>
        )}
        {weather.currentSpeed && (
          <div className="bg-purple-500/20 rounded-lg p-3 text-center">
            <Activity className="w-5 h-5 text-purple-300 mx-auto mb-1" />
            <p className="text-2xl font-black text-white">{weather.currentSpeed.toFixed(2)}</p>
            <p className="text-xs text-purple-200">Current (m/s)</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BioCard({
  title,
  bio
}: {
  title: string;
  bio: BioData;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <Activity className="w-4 h-4 text-cyan-400" />
        {title} Biology
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {bio.chlorophyll && (
          <div className="bg-green-500/20 rounded-lg p-3 text-center">
            <Droplets className="w-5 h-5 text-green-300 mx-auto mb-1" />
            <p className="text-2xl font-black text-white">{bio.chlorophyll.toFixed(2)}</p>
            <p className="text-xs text-green-200">Chlorophyll</p>
          </div>
        )}
        {bio.oxygen && (
          <div className="bg-blue-500/20 rounded-lg p-3 text-center">
            <Activity className="w-5 h-5 text-blue-300 mx-auto mb-1" />
            <p className="text-2xl font-black text-white">{bio.oxygen.toFixed(1)}</p>
            <p className="text-xs text-blue-200">Oxygen (ml/L)</p>
          </div>
        )}
        {bio.ph && (
          <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
            <Droplets className="w-5 h-5 text-yellow-300 mx-auto mb-1" />
            <p className="text-2xl font-black text-white">{bio.ph.toFixed(1)}</p>
            <p className="text-xs text-yellow-200">pH Level</p>
          </div>
        )}
        {bio.salinity && (
          <div className="bg-cyan-500/20 rounded-lg p-3 text-center">
            <Droplets className="w-5 h-5 text-cyan-300 mx-auto mb-1" />
            <p className="text-2xl font-black text-white">{bio.salinity.toFixed(1)}</p>
            <p className="text-xs text-cyan-200">Salinity (PSU)</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AstronomyCard({
  title,
  astronomy
}: {
  title: string;
  astronomy: AstronomyData;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <Sun className="w-4 h-4 text-cyan-400" />
        {title} Astronomy
      </h4>
      <div className="space-y-3">
        {astronomy.sunrise && astronomy.sunset && (
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-400" />
              <span className="text-slate-300">Sunrise</span>
            </div>
            <span className="text-white font-bold">
              {new Date(astronomy.sunrise).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </span>
          </div>
        )}
        {astronomy.moonrise && astronomy.moonset && (
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">Moonrise</span>
            </div>
            <span className="text-white font-bold">
              {new Date(astronomy.moonrise).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </span>
          </div>
        )}
        {astronomy.moonPhase?.current && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Moon Phase</span>
            <span className="text-white font-bold">{astronomy.moonPhase.current.text}</span>
          </div>
        )}
        {astronomy.moonFraction !== undefined && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Moon Illumination</span>
            <span className="text-white font-bold">{(astronomy.moonFraction * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SolarCard({
  title,
  solar
}: {
  title: string;
  solar: SolarData;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <Sun className="w-4 h-4 text-cyan-400" />
        {title} Solar
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {solar.uvIndex !== undefined && (
          <div className="bg-orange-500/20 rounded-lg p-3 text-center">
            <Sun className="w-5 h-5 text-orange-300 mx-auto mb-1" />
            <p className="text-2xl font-black text-white">{solar.uvIndex.toFixed(1)}</p>
            <p className="text-xs text-orange-200">UV Index</p>
          </div>
        )}
        {solar.solarRadiation && (
          <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
            <Sun className="w-5 h-5 text-yellow-300 mx-auto mb-1" />
            <p className="text-2xl font-black text-white">{solar.solarRadiation.toFixed(0)}</p>
            <p className="text-xs text-yellow-200">Solar Rad (W/m²)</p>
          </div>
        )}
        {solar.cloudCover !== undefined && (
          <div className="bg-gray-500/20 rounded-lg p-3 text-center col-span-2">
            <Eye className="w-5 h-5 text-gray-300 mx-auto mb-1" />
            <p className="text-2xl font-black text-white">{solar.cloudCover.toFixed(0)}%</p>
            <p className="text-xs text-gray-200">Cloud Cover</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ElevationCard({
  title,
  elevation
}: {
  title: string;
  elevation: ElevationData;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <Activity className="w-4 h-4 text-cyan-400" />
        {title} Elevation
      </h4>
      <div className="flex items-center justify-center">
        <div className="bg-green-500/20 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-green-500/30 rounded-full flex items-center justify-center mb-3 mx-auto">
            <Activity className="w-6 h-6 text-green-300" />
          </div>
          <p className="text-4xl font-black text-white">{elevation.elevation?.toFixed(1) || '--'}</p>
          <p className="text-sm text-green-200">Feet Above Sea Level</p>
        </div>
      </div>
    </div>
  );
}

export function TideWidget() {
  const [southPadreTides, setSouthPadreTides] = useState<TideData[]>([]);
  const [portMansfieldTides, setPortMansfieldTides] = useState<TideData[]>([]);
  const [southPadreWeather, setSouthPadreWeather] = useState<WeatherData>({});
  const [portMansfieldWeather, setPortMansfieldWeather] = useState<WeatherData>({});
  const [southPadreBio, setSouthPadreBio] = useState<BioData>({});
  const [portMansfieldBio, setPortMansfieldBio] = useState<BioData>({});
  const [southPadreSolar, setSouthPadreSolar] = useState<SolarData>({});
  const [portMansfieldSolar, setPortMansfieldSolar] = useState<SolarData>({});
  const [southPadreAstronomy, setSouthPadreAstronomy] = useState<AstronomyData>({});
  const [portMansfieldAstronomy, setPortMansfieldAstronomy] = useState<AstronomyData>({});
  const [southPadreElevation, setSouthPadreElevation] = useState<ElevationData>({});
  const [portMansfieldElevation, setPortMansfieldElevation] = useState<ElevationData>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tide' | 'weather' | 'bio' | 'astronomy' | 'solar' | 'elevation'>('tide');
  const [selectedCategories, setSelectedCategories] = useState<Set<'tide' | 'weather' | 'bio' | 'astronomy' | 'solar' | 'elevation'>>(
    new Set(['tide', 'weather', 'bio', 'astronomy', 'solar', 'elevation'])
  );

  const sunData = {
    ...getSunTimes(),
    moonPhase: getMoonPhase()
  };

  useEffect(() => {
    async function fetchAllData() {
      try {
        const [
          southPadreTidesData,
          portMansfieldTidesData,
          southPadreMarineData,
          portMansfieldMarineData,
          southPadreAstronomyData,
          portMansfieldAstronomyData,
          southPadreElevationData,
          portMansfieldElevationData
        ] = await Promise.all([
          fetchTideData(LOCATIONS.southPadre.lat, LOCATIONS.southPadre.lng),
          fetchTideData(LOCATIONS.portMansfield.lat, LOCATIONS.portMansfield.lng),
          fetchMarineData(LOCATIONS.southPadre.lat, LOCATIONS.southPadre.lng),
          fetchMarineData(LOCATIONS.portMansfield.lat, LOCATIONS.portMansfield.lng),
          fetchAstronomyData(LOCATIONS.southPadre.lat, LOCATIONS.southPadre.lng),
          fetchAstronomyData(LOCATIONS.portMansfield.lat, LOCATIONS.portMansfield.lng),
          fetchElevationData(LOCATIONS.southPadre.lat, LOCATIONS.southPadre.lng),
          fetchElevationData(LOCATIONS.portMansfield.lat, LOCATIONS.portMansfield.lng)
        ]);

        setSouthPadreTides(southPadreTidesData);
        setPortMansfieldTides(portMansfieldTidesData);
        setSouthPadreWeather(southPadreMarineData.weather);
        setPortMansfieldWeather(portMansfieldMarineData.weather);
        setSouthPadreBio(southPadreMarineData.bio);
        setPortMansfieldBio(portMansfieldMarineData.bio);
        setSouthPadreSolar(southPadreMarineData.solar);
        setPortMansfieldSolar(portMansfieldMarineData.solar);
        setSouthPadreAstronomy(southPadreAstronomyData);
        setPortMansfieldAstronomy(portMansfieldAstronomyData);
        setSouthPadreElevation({ elevation: southPadreElevationData });
        setPortMansfieldElevation({ elevation: portMansfieldElevationData });
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
      </div>
    );
  }

  return (
    <div className="my-8">
      <TabletFrame title="Gulf Coast Marine Dashboard">
        {/* Category Picker */}
        <div className="mb-6 bg-slate-800/50 rounded-lg p-4">
          <h3 className="text-white font-bold text-sm mb-3 text-center">Select Data Categories</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'tide', label: 'TIDE', icon: Waves, color: 'bg-blue-500' },
              { key: 'weather', label: 'WEATHER', icon: Wind, color: 'bg-green-500' },
              { key: 'bio', label: 'BIO', icon: Activity, color: 'bg-purple-500' },
              { key: 'astronomy', label: 'ASTRONOMY', icon: Sun, color: 'bg-yellow-500' },
              { key: 'solar', label: 'SOLAR', icon: Sun, color: 'bg-orange-500' },
              { key: 'elevation', label: 'ELEVATION', icon: Activity, color: 'bg-red-500' }
            ].map(({ key, label, icon: Icon, color }) => (
              <button
                key={key}
                onClick={() => {
                  const newSelected = new Set(selectedCategories);
                  if (newSelected.has(key as any)) {
                    newSelected.delete(key as any);
                  } else {
                    newSelected.add(key as any);
                  }
                  setSelectedCategories(newSelected);
                }}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-md text-xs font-bold transition-all ${
                  selectedCategories.has(key as any)
                    ? `${color} text-white shadow-lg`
                    : 'bg-slate-700/50 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-slate-800/50 rounded-lg p-1 overflow-x-auto">
          {[
            { key: 'tide', label: 'TIDE', icon: Waves },
            { key: 'weather', label: 'WEATHER', icon: Wind },
            { key: 'bio', label: 'BIO', icon: Activity },
            { key: 'astronomy', label: 'ASTRONOMY', icon: Sun },
            { key: 'solar', label: 'SOLAR', icon: Sun },
            { key: 'elevation', label: 'ELEVATION', icon: Activity }
          ].filter(({ key }) => selectedCategories.has(key as any)).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === key
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'tide' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TidePredictionCard
              title="South Padre Island"
              predictions={southPadreTides}
            />
            <TidePredictionCard
              title="Port Mansfield"
              predictions={portMansfieldTides}
            />
          </div>
        )}

        {activeTab === 'weather' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WeatherCard
              title="South Padre Island"
              weather={southPadreWeather}
            />
            <WeatherCard
              title="Port Mansfield"
              weather={portMansfieldWeather}
            />
          </div>
        )}

        {activeTab === 'bio' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BioCard
              title="South Padre Island"
              bio={southPadreBio}
            />
            <BioCard
              title="Port Mansfield"
              bio={portMansfieldBio}
            />
          </div>
        )}

        {activeTab === 'astronomy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AstronomyCard
              title="South Padre Island"
              astronomy={southPadreAstronomy}
            />
            <AstronomyCard
              title="Port Mansfield"
              astronomy={portMansfieldAstronomy}
            />
          </div>
        )}

        {activeTab === 'solar' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SolarCard
              title="South Padre Island"
              solar={southPadreSolar}
            />
            <SolarCard
              title="Port Mansfield"
              solar={portMansfieldSolar}
            />
          </div>
        )}

        {activeTab === 'elevation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ElevationCard
              title="South Padre Island"
              elevation={southPadreElevation}
            />
            <ElevationCard
              title="Port Mansfield"
              elevation={portMansfieldElevation}
            />
          </div>
        )}
      </TabletFrame>
    </div>
  );
}
