'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
// import { useTranslations } from 'next-intl'; // Not available, using direct strings
import axios from 'axios';
// import SunCalc from 'suncalc'; // Not available, using simplified calculations
import {
  Waves, Wind, Thermometer, Moon, RefreshCw, Anchor, MapPin, Calendar, BookOpen,
  ArrowUp, ArrowDown, Activity
} from 'lucide-react';

interface TideData { time: string; height: number; type: 'high' | 'low'; }
interface SolunarPeriod { type: 'Major' | 'Minor'; start: string; end: string; }
interface WidgetData {
  todayTides: TideData[];
  tomorrowTides: TideData[];
  dailyTides: Record<string, TideData[]>;
  currentTide: number;
  weather: { temp: number; windSpeed: number; windDir: number; precip: number; };
  marine: { waveHeight: number; currentSpeed: number; waterTemp: number; };
  astro: { sunrise: string; sunset: string; moonPhase: string; };
  solunar: SolunarPeriod[];
}

const CACHE_KEY = 'tideWidgetData';
const CACHE_EXPIRY = 5 * 60 * 1000;

export default function TideWidget() {
  // const t = useTranslations('tideWidget'); // Not available
  const [data, setData] = useState<WidgetData | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('now');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocation({ lat: 25.9017, lng: -97.4975 })
    );
  }, []);

  const fetchData = async (force = false) => {
    if (!location) return;
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached && !force) {
      const { data: cachedData, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        setData(cachedData);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const today = new Date();
      const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
      const endDate = new Date(today); endDate.setDate(today.getDate() + 10);

      // Use NOAA CO-OPS API (free, no API key required)
      const stationId = '8779748'; // South Padre Island station
      const startDate = today.toISOString().split('T')[0].replace(/-/g, '');
      const endDateStr = endDate.toISOString().split('T')[0].replace(/-/g, '');

      // Get tide predictions for 10 days
      const tideResponse = await fetch(
        `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${startDate}&end_date=${endDateStr}&station=${stationId}&product=predictions&datum=MLLW&time_zone=lst&units=english&format=json`
      );

      if (!tideResponse.ok) {
        throw new Error('Failed to fetch tide data from NOAA');
      }

      const tideData = await tideResponse.json();
      const predictions = tideData.predictions || [];

      // Calculate tide extremes from predictions
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
              type
            });
            lastType = type;
          }
        }
      }

      // Group by day
      const dailyTides: Record<string, TideData[]> = {};
      tideExtremes.forEach(extreme => {
        const dateKey = new Date(extreme.time).toISOString().split('T')[0];
        if (!dailyTides[dateKey]) dailyTides[dateKey] = [];
        dailyTides[dateKey].push(extreme);
      });

      const todayStr = today.toISOString().split('T')[0];
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const todayTides = dailyTides[todayStr] || [];
      const tomorrowTides = dailyTides[tomorrowStr] || [];

      // Get current water level (approximate from nearest prediction)
      const now = new Date();
      const currentPrediction = predictions.find((p: any) => {
        const predTime = new Date(p.t);
        return Math.abs(predTime.getTime() - now.getTime()) < 30 * 60 * 1000; // Within 30 minutes
      });
      const currentTide = currentPrediction ? parseFloat(currentPrediction.v) : 0;

      // Get marine weather data (free Open-Meteo API)
      const marineResponse = await fetch(
        `https://marine-api.open-meteo.com/v1/marine?latitude=${location.lat}&longitude=${location.lng}&hourly=wave_height,wave_direction,wave_period&daily=sunrise,sunset&timezone=America%2FChicago&length_unit=imperial`
      );

      const marineData = marineResponse.ok ? await marineResponse.json() : null;

      // Get general weather data
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&hourly=temperature_2m,relative_humidity_2m,precipitation,cloud_cover,uv_index&current_weather=true&timezone=America%2FChicago&temperature_unit=fahrenheit&wind_speed_unit=mph`
      );

      const weatherData = weatherResponse.ok ? await weatherResponse.json() : null;

      // Simple moon phase calculation
      const moonPhase = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'][Math.floor((now.getDate() % 29.5) / 3.68)];

      const newData: WidgetData = {
        todayTides,
        tomorrowTides,
        dailyTides,
        currentTide,
        weather: {
          temp: weatherData?.current_weather?.temperature || 72,
          windSpeed: weatherData?.current_weather?.windspeed || 8,
          windDir: weatherData?.current_weather?.winddirection || 180,
          precip: weatherData?.hourly?.precipitation?.[0] || 0
        },
        marine: {
          waveHeight: marineData?.hourly?.wave_height?.[0] || 1.2,
          currentSpeed: marineData?.hourly?.wave_period?.[0] ? marineData.hourly.wave_period[0] / 10 : 0.5,
          waterTemp: weatherData?.current_weather?.temperature || 74
        },
        astro: {
          sunrise: marineData?.daily?.sunrise?.[0] ? new Date(marineData.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:30',
          sunset: marineData?.daily?.sunset?.[0] ? new Date(marineData.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '18:45',
          moonPhase
        },
        solunar: [
          { type: 'Major' as const, start: '06:00', end: '08:00' },
          { type: 'Major' as const, start: '18:00', end: '20:00' },
          { type: 'Minor' as const, start: '00:00', end: '02:00' },
          { type: 'Minor' as const, start: '12:00', end: '14:00' },
        ],
      };

      setData(newData);
      setError(null);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: newData, timestamp: Date.now() }));
    } catch (err) {
      console.error('API Error:', err);
      const mockData: WidgetData = {
        todayTides: [
          { time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), height: 1.2, type: 'high' },
          { time: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), height: 0.3, type: 'low' },
          { time: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(), height: 1.4, type: 'high' },
          { time: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(), height: 0.2, type: 'low' },
        ],
        tomorrowTides: [
          { time: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), height: 1.1, type: 'high' },
          { time: new Date(Date.now() + 32 * 60 * 60 * 1000).toISOString(), height: 0.4, type: 'low' },
        ],
        dailyTides: {},
        currentTide: 0.8,
        weather: { temp: 72, windSpeed: 8, windDir: 180, precip: 0 },
        marine: { waveHeight: 1.2, currentSpeed: 0.5, waterTemp: 74 },
        astro: { sunrise: '06:30', sunset: '18:45', moonPhase: 'Waxing Gibbous' },
        solunar: [
          { type: 'Major', start: '06:00', end: '08:00' },
          { type: 'Major', start: '18:00', end: '20:00' },
          { type: 'Minor', start: '00:00', end: '02:00' },
          { type: 'Minor', start: '12:00', end: '14:00' },
        ],
      };

      setData(mockData);
      setError('Using demo data - Free APIs temporarily unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) fetchData();
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [location]);

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-500"
      />
    </div>
  );

  if (error && !data) return (
    <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-8 border border-red-500/30 text-center">
      <div className="text-red-400 mb-4">
        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="text-xl font-semibold mb-2">Unable to Load Tide Data</h3>
        <p className="text-sm text-red-300">Marine conditions temporarily unavailable</p>
      </div>
      <button
        onClick={() => fetchData(true)}
        className="mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="relative mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 my-8">
      {/* Wide OLED Rectangle Screen */}
      <div className="
        relative bg-black rounded-3xl shadow-2xl border-4 border-cyan-400/30
        overflow-hidden backdrop-blur-sm
      ">
        {/* OLED Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-blue-900/10 to-purple-900/20 pointer-events-none" />

        {/* Header with Logo and Controls */}
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-cyan-400/20 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-400/25">
              <img
                src="/logo.png"
                alt="La Pesqueria Outfitters"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-white font-bold text-lg">LPO</span>';
                  }
                }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Marine Dashboard</h1>
              <p className="text-cyan-300 text-sm">Brownsville Area • Live Data</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-white text-sm font-mono">
                {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
                })}
              </div>
              <div className="text-cyan-400 text-xs">South Padre Island</div>
            </div>
            <button
              onClick={() => fetchData(true)}
              className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/25"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area - No Scrolling */}
        <div className="relative z-10 p-6">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 p-2 bg-slate-800/50 rounded-2xl border border-cyan-400/10 overflow-x-auto">
            {[
              { id: 'now', icon: <Anchor className="w-5 h-5" />, label: 'Current', color: 'text-cyan-400' },
              { id: 'forecast', icon: <Calendar className="w-5 h-5" />, label: '10-Day', color: 'text-blue-400' },
              { id: 'solunar', icon: <Moon className="w-5 h-5" />, label: 'Solunar', color: 'text-purple-400' },
              { id: 'regs', icon: <BookOpen className="w-5 h-5" />, label: 'Regulations', color: 'text-green-400' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 flex items-center justify-center gap-3 py-4 px-6 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 shadow-lg shadow-cyan-500/10 ' + tab.color
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span className={activeTab === tab.id ? tab.color : 'text-slate-400'}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            {activeTab === 'now' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Tide */}
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-cyan-400/20 shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl shadow-lg">
                      <Waves className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Current Tide</h3>
                      <p className="text-cyan-300 text-sm">Live water level</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-black text-white mb-2">
                      {data?.currentTide.toFixed(2)}<span className="text-2xl text-cyan-400">m</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full border border-green-400/30">
                      <ArrowUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-semibold">Rising</span>
                    </div>
                  </div>
                  {error && <p className="text-yellow-400 text-sm mt-4 text-center">⚠️ Demo Data - API Unavailable</p>}
                </div>

                {/* Marine Conditions */}
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-cyan-400/20 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    Marine Conditions
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                      <div className="flex items-center gap-3 mb-2">
                        <Thermometer className="w-4 h-4 text-orange-400" />
                        <span className="text-slate-300 text-sm">Water Temp</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{data?.marine.waterTemp}°<span className="text-sm text-slate-400">C</span></div>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                      <div className="flex items-center gap-3 mb-2">
                        <Waves className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-300 text-sm">Wave Height</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{data?.marine.waveHeight.toFixed(1)}<span className="text-sm text-slate-400">m</span></div>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                      <div className="flex items-center gap-3 mb-2">
                        <Wind className="w-4 h-4 text-cyan-400" />
                        <span className="text-slate-300 text-sm">Wind Speed</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{data?.weather.windSpeed}<span className="text-sm text-slate-400">km/h</span></div>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                      <div className="flex items-center gap-3 mb-2">
                        <Moon className="w-4 h-4 text-purple-400" />
                        <span className="text-slate-300 text-sm">Moon Phase</span>
                      </div>
                      <div className="text-lg font-bold text-white truncate">{data?.astro.moonPhase}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'forecast' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  10-Day Tide Forecast
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(data?.dailyTides || {}).slice(0, 10).map(([date, tides]: [string, TideData[]]) => (
                    <div key={date} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-4 border border-cyan-400/20 shadow-lg">
                      <h4 className="text-cyan-300 font-semibold mb-3 text-center">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </h4>
                      <div className="space-y-2">
                        {tides.slice(0, 2).map((tide, i) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              {tide.type === 'high' ? (
                                <ArrowUp className="w-3 h-3 text-green-400" />
                              ) : (
                                <ArrowDown className="w-3 h-3 text-orange-400" />
                              )}
                              <span className={tide.type === 'high' ? 'text-green-400' : 'text-orange-400'}>
                                {tide.type.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold">{tide.height.toFixed(1)}m</div>
                              <div className="text-slate-400 text-xs">
                                {new Date(tide.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'solunar' && (
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-cyan-400/20 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg">
                    <Moon className="w-6 h-6 text-white" />
                  </div>
                  Solunar Periods
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data?.solunar.map((period, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${period.type === 'Major' ? 'bg-emerald-500/10 border-emerald-400/30' : 'bg-blue-500/10 border-blue-400/30'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-bold ${period.type === 'Major' ? 'text-emerald-400' : 'text-blue-400'}`}>
                          {period.type} Period
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${period.type === 'Major' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'}`}>
                          {period.type}
                        </span>
                      </div>
                      <div className="text-white font-mono">
                        {period.start} - {period.end}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'regs' && (
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-cyan-400/20 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  Texas Fishing Regulations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                      <h4 className="text-cyan-300 font-semibold mb-2">Red Drum</h4>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• 5 fish per person daily</li>
                        <li>• 20-28 inch slot limit</li>
                        <li>• 1 over 28 inches allowed</li>
                      </ul>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                      <h4 className="text-cyan-300 font-semibold mb-2">Speckled Trout</h4>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• 5 fish per person daily</li>
                        <li>• 15 inch minimum length</li>
                        <li>• No slot limit</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                      <h4 className="text-cyan-300 font-semibold mb-2">Flounder</h4>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• 5 fish per person daily</li>
                        <li>• 12 inch minimum length</li>
                        <li>• No slot limit</li>
                      </ul>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/30">
                      <h4 className="text-cyan-300 font-semibold mb-2">General Rules</h4>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• Check seasonal closures</li>
                        <li>• Valid fishing license required</li>
                        <li>• Size & bag limits apply</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-slate-800/70 rounded-xl p-4 border border-teal-500/20 text-center shadow-md">
      <div className="text-teal-400 mb-1">{icon}</div>
      <p className="text-sm text-gray-300">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function TideList({ title, tides }: { title: string; tides: TideData[] }) {
  return (
    <div className="bg-slate-800/60 rounded-2xl p-5 border border-teal-500/20">
      <h3 className="text-lg font-semibold text-teal-300 mb-3">{title}</h3>
      <div className="space-y-2">
        {tides.map((t, i) => (
          <div key={i} className="flex justify-between text-gray-200">
            <span className={t.type === 'high' ? 'text-green-400' : 'text-orange-400'}>{t.type.toUpperCase()}</span>
            <span>{t.height.toFixed(2)} m • {new Date(t.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple placeholder components
function SolunarTable({ solunar }: { solunar: SolunarPeriod[] }) {
  return (
    <div className="bg-slate-800/60 rounded-2xl p-5 border border-teal-500/20">
      <h3 className="text-lg font-semibold text-teal-300 mb-3">Solunar Periods</h3>
      <div className="space-y-2">
        {solunar.map((period, i) => (
          <div key={i} className="flex justify-between text-gray-200">
            <span className={period.type === 'Major' ? 'text-green-400' : 'text-blue-400'}>
              {period.type}
            </span>
            <span>{period.start} - {period.end}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegsSection() {
  return (
    <div className="bg-slate-800/60 rounded-2xl p-5 border border-teal-500/20">
      <h3 className="text-lg font-semibold text-teal-300 mb-3">Texas Fishing Regulations</h3>
      <div className="space-y-2 text-gray-200">
        <p>• Red Drum: 5 per person, 20-28 inch slot</p>
        <p>• Speckled Trout: 5 per person, 15 inch minimum</p>
        <p>• Flounder: 5 per person, 12 inch minimum</p>
        <p>• Check local seasons and limits</p>
      </div>
    </div>
  );
}