'use client';

import { useEffect, useState } from 'react';
// import { useTranslations } from 'next-intl'; // Not available, using direct strings
import axios from 'axios';
// import SunCalc from 'suncalc'; // Not available, using simplified calculations
import {
  Waves, Wind, Thermometer, Moon, RefreshCw, Anchor, MapPin, Calendar, BookOpen
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
      const start = today.toISOString().split('T')[0];
      const end = endDate.toISOString().split('T')[0];

      // Tide extremes for 10 days
      const extremesRes = await axios.get(
        `https://api.stormglass.io/v2/tide/extremes/point?lat=${location.lat}&lng=${location.lng}&start=${start}&end=${end}`,
        { headers: { Authorization: process.env.STORMGLASS_API_KEY! } }
      );
      const allExtremes = extremesRes.data.extremes || [];
      const dailyTides: Record<string, TideData[]> = {};
      allExtremes.forEach((e: any) => {
        const dateKey = new Date(e.time).toISOString().split('T')[0];
        if (!dailyTides[dateKey]) dailyTides[dateKey] = [];
        dailyTides[dateKey].push({ time: e.time, height: e.height, type: e.type });
        dailyTides[dateKey].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      });
      const todayTides = dailyTides[start] || [];
      const tomorrowTides = dailyTides[tomorrow.toISOString().split('T')[0]] || [];

      // Weather + marine
      const stormParams = [
        'airTemperature', 'windSpeed', 'windDirection', 'precipitation', 'waveHeight', 'wavePeriod', 'waveDirection',
        'seaLevel', 'sunrise', 'sunset', 'swellHeight', 'swellPeriod', 'swellDirection', 'windWaveHeight', 'windWavePeriod', 'windWaveDirection'
      ].join(',');
      const stormRes = await axios.get(
        `https://api.stormglass.io/v2/weather/point?lat=${location.lat}&lng=${location.lng}&params=${stormParams}`,
        { headers: { Authorization: process.env.STORMGLASS_API_KEY! } }
      );
      const stormHourly = stormRes.data.hours[0] || {};

      // Moon phase
      const moonRes = await fetch(`https://aa.usno.navy.mil/api/moon/phases/date?date=${start}&nump=1`);
      const moonData = await moonRes.json();
      const moonPhase = moonData.phasedata[0]?.phasename || 'Unknown';

      // Solunar - simplified without SunCalc
      const solunar: SolunarPeriod[] = [
        { type: 'Major' as const, start: '06:00', end: '08:00' },
        { type: 'Major' as const, start: '18:00', end: '20:00' },
        { type: 'Minor' as const, start: '00:00', end: '02:00' },
        { type: 'Minor' as const, start: '12:00', end: '14:00' },
      ];

      const newData: WidgetData = {
        todayTides,
        tomorrowTides,
        dailyTides,
        currentTide: stormHourly.seaLevel?.sg || 0,
        weather: { temp: stormHourly.airTemperature?.sg || 0, windSpeed: stormHourly.windSpeed?.sg || 0, windDir: stormHourly.windDirection?.sg || 0, precip: stormHourly.precipitation?.sg || 0 },
        marine: { waveHeight: stormHourly.waveHeight?.sg || 0, currentSpeed: stormHourly.currentSpeed?.sg || 0, waterTemp: stormHourly.waterTemperature?.sg || 0 },
        astro: { sunrise: new Date(stormHourly.sunrise * 1000).toLocaleTimeString(), sunset: new Date(stormHourly.sunset * 1000).toLocaleTimeString(), moonPhase },
        solunar,
      };

      setData(newData);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: newData, timestamp: Date.now() }));
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) fetchData();
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [location]);

  if (loading || error) return <div className="p-8 text-center text-gray-400">{loading ? 'Loading...' : error}</div>;

  return (
    <div className="relative mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 my-12">
      <div className="
        relative bg-gradient-to-br from-slate-900 to-blue-950 
        rounded-[3rem] shadow-2xl border-[12px] border-slate-800 border-b-slate-950 
        overflow-hidden transform perspective-[1400px] rotate-y-[5deg] rotate-x-[4deg] 
        scale-[0.96] transition-all duration-500 hover:rotate-y-[2deg] hover:rotate-x-[2deg] hover:scale-100
      ">
        {/* Waves */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-35 pointer-events-none">
          <div className="wave wave1 absolute bottom-0 left-0 w-[200%] h-[200px] bg-gradient-to-t from-teal-600/60 to-transparent animate-wave-slow"></div>
          <div className="wave wave2 absolute bottom-0 left-0 w-[200%] h-[180px] bg-gradient-to-t from-cyan-500/50 to-transparent animate-wave-medium"></div>
          <div className="wave wave3 absolute bottom-0 left-0 w-[200%] h-[160px] bg-gradient-to-t from-blue-400/40 to-transparent animate-wave-fast"></div>
        </div>

        {/* Animated Swimming Fish */}
        <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
          {/* Fish 1 - Slow, mid-depth */}
          <svg 
            className="fish absolute w-16 h-10 animate-swim-slow"
            style={{ top: '30%', left: '-10%' }}
            viewBox="0 0 100 60"
          >
            <path 
              d="M 10 30 Q 30 10 50 30 Q 70 50 90 30 L 85 35 Q 70 55 50 35 Q 30 15 10 30 Z"
              fill="#FFD700" stroke="#DAA520" strokeWidth="2"
            />
            <circle cx="20" cy="25" r="4" fill="black" />
            <polygon points="90,30 100,25 100,35" fill="#DAA520" />
          </svg>

          {/* Fish 2 - Faster, higher */}
          <svg 
            className="fish absolute w-20 h-12 animate-swim-medium"
            style={{ top: '20%', left: '-15%' }}
            viewBox="0 0 120 70"
          >
            <path 
              d="M 15 35 Q 40 15 65 35 Q 90 55 115 35 L 110 40 Q 90 60 65 40 Q 40 20 15 35 Z"
              fill="#FF6347" stroke="#CD5C5C" strokeWidth="3"
            />
            <circle cx="25" cy="30" r="5" fill="black" />
            <polygon points="115,35 125,30 125,40" fill="#CD5C5C" />
          </svg>

          {/* Fish 3 - Slow, lower, reverse direction */}
          <svg 
            className="fish absolute w-14 h-9 animate-swim-slow-reverse"
            style={{ top: '60%', left: '110%' }}
            viewBox="0 0 90 50"
          >
            <path 
              d="M 80 25 Q 60 5 40 25 Q 20 45 0 25 L 5 30 Q 20 50 40 30 Q 60 10 80 25 Z"
              fill="#87CEEB" stroke="#4682B4" strokeWidth="2"
            />
            <circle cx="70" cy="20" r="4" fill="black" />
            <polygon points="0,25  -10,20 -10,30" fill="#4682B4" />
          </svg>
        </div>

        {/* Status Bar */}
        <div className="absolute top-3 inset-x-0 flex justify-between items-center px-8 text-xs text-gray-400 z-20">
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="flex items-center gap-3">100% • 5G</span>
        </div>

        {/* Logo */}
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20">
          <img src="/logo.png" alt="Fishing Hub" className="w-36 sm:w-44 md:w-52 h-auto drop-shadow-2xl rounded-full bg-gradient-to-br from-blue-600/80 to-teal-600/80 p-3 border-4 border-teal-400/60 hover:scale-105 transition-transform" />
        </div>

        {/* Refresh */}
        <button onClick={() => fetchData(true)} className="absolute top-14 right-6 z-20 p-3 bg-teal-600/80 backdrop-blur-md text-white rounded-full hover:bg-teal-500 transition shadow-lg" title="Refresh Now">
          <RefreshCw className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="pt-32 pb-24 px-6 overflow-y-auto h-[620px] scrollbar-hide">
          {activeTab === 'now' && (
            <div className="space-y-6">
              <div className="text-center"><h2 className="text-3xl font-bold text-white mb-2">Current Conditions</h2><p className="text-teal-300">Brownsville Area • Updated {new Date().toLocaleTimeString()}</p></div>
              <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-teal-500/30 shadow-lg flex items-center justify-between">
                <div><p className="text-lg text-gray-300">Current Tide Level</p><p className="text-4xl font-bold text-white">{data?.currentTide.toFixed(2)} m</p></div>
                <div className="text-6xl text-green-400">↑</div> {/* Tide direction */}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <StatCard icon={<Thermometer />} label="Water Temp" value={`${data?.marine.waterTemp}°C`} />
                <StatCard icon={<Waves />} label="Wave Height" value={`${data?.marine.waveHeight.toFixed(1)} m`} />
                <StatCard icon={<Wind />} label="Wind" value={`${data?.weather.windSpeed || 0} km/h`} />
                <StatCard icon={<Moon />} label="Moon Phase" value={data?.astro.moonPhase || 'Unknown'} />
              </div>
              <TideList title="Today's Tides" tides={data?.todayTides || []} />
            </div>
          )}
          {activeTab === 'forecast' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center">10-Day Forecast</h2>
              {Object.entries(data?.dailyTides || {}).map(([date, tides]: [string, TideData[]]) => (
                <div key={date} className="bg-slate-800/60 rounded-2xl p-5 border border-teal-500/20">
                  <h3 className="text-lg font-semibold text-teal-300 mb-3">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</h3>
                  <div className="space-y-2">
                    {tides.map((t, i) => (
                      <div key={i} className="flex justify-between text-gray-200">
                        <span className={t.type === 'high' ? 'text-green-400' : 'text-orange-400'}>{t.type.toUpperCase()}</span>
                        <span>{t.height.toFixed(2)} m • {new Date(t.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'solunar' && <SolunarTable solunar={data?.solunar || []} />}
          {activeTab === 'regs' && <RegsSection />}
          {activeTab === 'spots' && <div className="text-center text-gray-400">Map & Spots Coming Soon</div>}
        </div>

        {/* Tab Bar */}
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-slate-950 to-transparent flex items-center justify-around border-t border-teal-900/50 z-20">
          {[
            { id: 'now', icon: <Anchor className="w-6 h-6" />, label: 'Now' },
            { id: 'forecast', icon: <Calendar className="w-6 h-6" />, label: 'Forecast' },
            { id: 'spots', icon: <MapPin className="w-6 h-6" />, label: 'Spots' },
            { id: 'solunar', icon: <Moon className="w-6 h-6" />, label: 'Solunar' },
            { id: 'regs', icon: <BookOpen className="w-6 h-6" />, label: 'Regs' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-1 p-2 transition ${activeTab === tab.id ? 'text-teal-400' : 'text-gray-400 hover:text-teal-300'}`}>
              {tab.icon}
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
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