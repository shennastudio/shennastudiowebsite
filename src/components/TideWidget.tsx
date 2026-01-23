'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Thermometer,
  Wind,
  Sun,
  Moon,
  ArrowUp,
  ArrowDown,
  Compass,
  Waves
} from 'lucide-react';

const STATIONS = {
  southPadre: '8779748',
  portMansfield: '8775796'
};

interface TideData {
  t: string;
  v: string;
  type: 'H' | 'L' | undefined;
}

interface WeatherData {
  waterTemp: number;
  airTemp: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
}

interface SunData {
  sunrise: string;
  sunset: string;
  moonPhase: string;
}

async function fetchTidePredictions(stationId: string): Promise<TideData[]> {
  try {
    const response = await fetch(
      `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=${stationId}&product=predictions&datum=MLLW&time_zone=lst&units=english&format=json`
    );
    const data = await response.json();
    return data.predictions || [];
  } catch (error) {
    console.error('Error fetching tide predictions:', error);
    return [];
  }
}

async function fetchCurrentConditions(stationId: string): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=${stationId}&product=water_level,air_temperature,water_temperature,wind,pressure&datum=MLLW&time_zone=lst&units=english&format=json`
    );
    const data = await response.json();

    return {
      waterTemp: parseFloat(data.water_temperature?.data?.[0]?.v) || 72,
      airTemp: parseFloat(data.air_temperature?.data?.[0]?.v) || 78,
      windSpeed: parseFloat(data.wind?.data?.[0]?.s) || 8,
      windDirection: parseFloat(data.wind?.data?.[0]?.d) || 180,
      pressure: parseFloat(data.pressure?.data?.[0]?.p) || 30.1,
    };
  } catch (error) {
    console.error('Error fetching conditions:', error);
    return null;
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

function formatTime(timeStr: string): string {
  if (!timeStr) return '--:--';
  return timeStr;
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-4 shadow-2xl border-4 border-slate-700"
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <h3 className="text-slate-200 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <Waves className="w-4 h-4 text-cyan-400" />
          {title}
        </h3>
        <div className="w-12 h-4 bg-slate-700 rounded-full" />
      </div>
      <div className="bg-gradient-to-b from-sky-900 to-blue-900 rounded-xl p-4 min-h-[280px]">
        {children}
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600" />
    </motion.div>
  );
}

function LocationCard({
  location,
  conditions,
  sunData
}: {
  location: string;
  conditions: WeatherData | null;
  sunData: SunData;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-bold text-lg">{location}</h4>
        <span className="text-cyan-400 text-xs bg-cyan-400/20 px-2 py-1 rounded-full">
          Live
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-500/20 rounded-lg p-3 text-center">
          <Droplets className="w-5 h-5 text-blue-300 mx-auto mb-1" />
          <p className="text-2xl font-black text-white">{conditions?.waterTemp || '--'}°</p>
          <p className="text-xs text-blue-200">Water Temp</p>
        </div>
        <div className="bg-orange-500/20 rounded-lg p-3 text-center">
          <Thermometer className="w-5 h-5 text-orange-300 mx-auto mb-1" />
          <p className="text-2xl font-black text-white">{conditions?.airTemp || '--'}°F</p>
          <p className="text-xs text-orange-200">Air Temp</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center">
          <Wind className="w-4 h-4 text-slate-300 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">{conditions?.windSpeed || '--'}</p>
          <p className="text-[10px] text-slate-400">knots</p>
        </div>
        <div className="text-center">
          <Compass className="w-4 h-4 text-slate-300 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">{getWindDirection(conditions?.windDirection || 180)}</p>
          <p className="text-[10px] text-slate-400">direction</p>
        </div>
        <div className="text-center">
          <ArrowUp className="w-4 h-4 text-slate-300 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">{conditions?.pressure?.toFixed(1) || '--'}</p>
          <p className="text-[10px] text-slate-400">inHg</p>
        </div>
      </div>

      <div className="flex justify-between text-xs text-slate-300 bg-black/20 rounded-lg p-2">
        <div className="flex items-center gap-1">
          <Sun className="w-3 h-3 text-yellow-400" />
          <span>{sunData.sunrise}</span>
        </div>
        <div className="flex items-center gap-1">
          <Moon className="w-3 h-3 text-slate-400" />
          <span>{sunData.sunset}</span>
        </div>
      </div>
    </div>
  );
}

function TidePredictionCard({
  title,
  predictions
}: {
  title: string;
  predictions: TideData[];
}) {
  const today = new Date();
  const upcoming = predictions
    .filter(p => new Date(p.t) >= today)
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
                {prediction.type === 'H' ? (
                  <ArrowUp className="w-3 h-3 text-green-400" />
                ) : prediction.type === 'L' ? (
                  <ArrowDown className="w-3 h-3 text-red-400" />
                ) : (
                  <div className="w-3 h-3" />
                )}
                <span className="text-slate-300">
                  {formatTime(prediction.t.split(' ')[1])}
                </span>
              </div>
              <span className="text-white font-bold">
                {parseFloat(prediction.v).toFixed(1)} ft
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

export function TideWidget() {
  const [southPadreConditions, setSouthPadreConditions] = useState<WeatherData | null>(null);
  const [portMansfieldConditions, setPortMansfieldConditions] = useState<WeatherData | null>(null);
  const [southPadreTides, setSouthPadreTides] = useState<TideData[]>([]);
  const [portMansfieldTides, setPortMansfieldTides] = useState<TideData[]>([]);
  const [loading, setLoading] = useState(true);

  const sunData = {
    ...getSunTimes(),
    moonPhase: getMoonPhase()
  };

  useEffect(() => {
    async function fetchAllData() {
      try {
        const [
          southPadreCond,
          portMansfieldCond,
          southPadreTidesData,
          portMansfieldTidesData
        ] = await Promise.all([
          fetchCurrentConditions(STATIONS.southPadre),
          fetchCurrentConditions(STATIONS.portMansfield),
          fetchTidePredictions(STATIONS.southPadre),
          fetchTidePredictions(STATIONS.portMansfield)
        ]);

        setSouthPadreConditions(southPadreCond);
        setPortMansfieldConditions(portMansfieldCond);
        setSouthPadreTides(southPadreTidesData);
        setPortMansfieldTides(portMansfieldTidesData);
      } catch (error) {
        console.error('Error fetching tide data:', error);
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
      <TabletFrame title="Gulf Coast Conditions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <LocationCard
              location="South Padre Island"
              conditions={southPadreConditions}
              sunData={sunData}
            />
            <LocationCard
              location="Port Mansfield"
              conditions={portMansfieldConditions}
              sunData={sunData}
            />
          </div>

          <div className="space-y-4">
            <TidePredictionCard
              title="South Padre Island"
              predictions={southPadreTides}
            />
            <TidePredictionCard
              title="Port Mansfield"
              predictions={portMansfieldTides}
            />

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-slate-300" />
                  <span className="text-slate-300 text-sm">Moon Phase</span>
                </div>
                <span className="text-white font-bold">{sunData.moonPhase}</span>
              </div>
            </div>
          </div>
        </div>
      </TabletFrame>
    </div>
  );
}
