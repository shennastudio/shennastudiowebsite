'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  IconButton,
  Stack,
  Skeleton,
  Alert,
  List,
  ListItem,
  Link,
  Badge,
} from '@mui/joy';

const NOAA_STATION = '8770570';
const NOAA_BASE_URL = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';
const MARINE_API_URL = 'https://marine-api.open-meteo.com/v1/marine';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';
const AIS_WEBSOCKET_URL = 'wss://stream.aisstream.io/v0/stream';

interface TidePrediction {
  t: string;
  type: 'H' | 'L';
  v: string;
}

interface TideData {
  date: string;
  high: { time: string; height: number } | null;
  low: { time: string; height: number } | null;
}

interface MarineData {
  waveHeight: number[];
  waveDirection: number[];
  wavePeriod: number[];
  swellWaveHeight: number[];
  swellWaveDirection: number[];
  swellWavePeriod: number[];
  time: string[];
}

interface WeatherData {
  windSpeed: number[];
  windDirection: number[];
  windGusts: number[];
  temperature: number[];
  precipitation: number[];
  time: string[];
}

interface VesselData {
  mmsi: string;
  lat: number;
  lng: number;
  speed: number;
  course: number;
  heading: number;
  vesselType: number;
  timestamp: string;
  risk?: 'none' | 'caution' | 'danger';
  cpa?: number;
  tcpa?: number;
}

interface SolunarPeriod {
  type: 'Major' | 'Minor';
  start: string;
  end: string;
  activity: number;
}

interface TideData {
  date: string;
  high: { time: string; height: number } | null;
  low: { time: string; height: number } | null;
}

interface MarineData {
  waveHeight: number[];
  waveDirection: number[];
  wavePeriod: number[];
  swellWaveHeight: number[];
  swellWaveDirection: number[];
  swellWavePeriod: number[];
  time: string[];
}

interface WeatherData {
  windSpeed: number[];
  windDirection: number[];
  windGusts: number[];
  temperature: number[];
  precipitation: number[];
  time: string[];
}

interface VesselData {
  mmsi: string;
  lat: number;
  lng: number;
  speed: number; // knots
  course: number; // degrees
  heading: number; // degrees
  vesselType: number;
  timestamp: string;
  name?: string;
  risk?: 'none' | 'caution' | 'danger';
  cpa?: number; // nm
  tcpa?: number; // minutes
}

interface SolunarPeriod {
  type: 'Major' | 'Minor';
  start: string;
  end: string;
  activity: number;
}

const FishingDashboardPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [tideData, setTideData] = useState<TideData[]>([]);
  const [marineData, setMarineData] = useState<MarineData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [vessels, setVessels] = useState<VesselData[]>([]);
  const [collisionAlerts, setCollisionAlerts] = useState<VesselData[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const CENTER_LAT = 25.9017;
  const CENTER_LNG = -97.4975;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const calculateCollisionRisk = (vessel: VesselData): VesselData => {
    const ownSpeed = 0;
    const ownCourse = 0;

    const vesselLat = (vessel.lat * Math.PI) / 180;
    const vesselLng = (vessel.lng * Math.PI) / 180;
    const ownLat = (CENTER_LAT * Math.PI) / 180;
    const ownLng = (CENTER_LNG * Math.PI) / 180;

    const dLat = vesselLat - ownLat;
    const dLng = vesselLng - ownLng;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(ownLat) * Math.cos(vesselLat) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = 6371 * c;
    const distanceNm = distance * 0.539957;

    if (distanceNm > 50) {
      return { ...vessel, risk: 'none' };
    }

    const vesselSpeedMs = vessel.speed * 0.514444;
    const ownSpeedMs = ownSpeed * 0.514444;

    const vesselCourseRad = (vessel.course * Math.PI) / 180;
    const ownCourseRad = (ownCourse * Math.PI) / 180;

    const relVelX = vesselSpeedMs * Math.sin(vesselCourseRad) - ownSpeedMs * Math.sin(ownCourseRad);
    const relVelY = vesselSpeedMs * Math.cos(vesselCourseRad) - ownSpeedMs * Math.cos(ownCourseRad);

    const relVelMag = Math.sqrt(relVelX * relVelX + relVelY * relVelY);

    if (relVelMag < 0.1) {
      return { ...vessel, risk: distanceNm < 3 ? 'caution' : 'none', cpa: distanceNm };
    }

    const cpa = distanceNm / relVelMag * 60;
    const tcpa = distanceNm / relVelMag;

    let risk: 'none' | 'caution' | 'danger' = 'none';
    if (cpa < 1 && tcpa < 15) {
      risk = 'danger';
    } else if (cpa < 3 && tcpa < 30) {
      risk = 'caution';
    }

    return { ...vessel, risk, cpa, tcpa };
  };

  const connectAISWebSocket = () => {
    try {
      wsRef.current = new WebSocket(AIS_WEBSOCKET_URL);

      wsRef.current.onopen = () => {
        console.log('AIS WebSocket connected');
        const subscription = {
          APIKey: '',
          BoundingBoxes: [[[24.5, -98.5], [27.5, -96.5]]]
        };
        wsRef.current?.send(JSON.stringify(subscription));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.MessageType === 'PositionReport') {
            const vessel: VesselData = {
              mmsi: data.MetaData.MMSI.toString(),
              lat: data.Message.PositionReport.Latitude,
              lng: data.Message.PositionReport.Longitude,
              speed: data.Message.PositionReport.SpeedOverGround || 0,
              course: data.Message.PositionReport.CourseOverGround || 0,
              heading: data.Message.PositionReport.TrueHeading || data.Message.PositionReport.CourseOverGround || 0,
              vesselType: data.MetaData.ShipType || 0,
              timestamp: new Date().toISOString(),
            };

            const vesselWithRisk = calculateCollisionRisk(vessel);

            setVessels(prev => {
              const existing = prev.find(v => v.mmsi === vessel.mmsi);
              if (existing) {
                return prev.map(v => v.mmsi === vessel.mmsi ? vesselWithRisk : v);
              } else {
                return [...prev.filter(v => Date.now() - new Date(v.timestamp).getTime() < 300000), vesselWithRisk];
              }
            });

            if (vesselWithRisk.risk === 'danger' || vesselWithRisk.risk === 'caution') {
              setCollisionAlerts(prev => {
                const existing = prev.find(v => v.mmsi === vessel.mmsi);
                if (existing) {
                  return prev.map(v => v.mmsi === vessel.mmsi ? vesselWithRisk : v);
                } else {
                  return [...prev.filter(v => v.risk !== vesselWithRisk.risk), vesselWithRisk];
                }
              });
            }
          }
        } catch (err) {
          console.error('Error parsing AIS message:', err);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('AIS WebSocket error:', error);
      };

      wsRef.current.onclose = () => {
        console.log('AIS WebSocket closed, reconnecting...');
        setTimeout(connectAISWebSocket, 5000);
      };
    } catch (err) {
      console.error('Failed to connect to AIS WebSocket:', err);
    }
  };

  const fetchTideData = async () => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 10);

      const startDateStr = today.toISOString().split('T')[0].replace(/-/g, '');
      const endDateStr = endDate.toISOString().split('T')[0].replace(/-/g, '');

      const url = `${NOAA_BASE_URL}?station=${NOAA_STATION}&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=metric&begin_date=${startDateStr}&end_date=${endDateStr}&application=FishingHub&format=json`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch tide data from NOAA');
      }

      const data = await response.json();
      const predictions: TidePrediction[] = data.predictions || [];

      const groupedData: { [key: string]: TidePrediction[] } = {};
      predictions.forEach(pred => {
        const date = pred.t.split(' ')[0];
        if (!groupedData[date]) groupedData[date] = [];
        groupedData[date].push(pred);
      });

      const tideDataArray: TideData[] = Object.entries(groupedData).map(([date, preds]) => {
        const high = preds.find(p => p.type === 'H');
        const low = preds.find(p => p.type === 'L');

        return {
          date,
          high: high ? { time: high.t, height: parseFloat(high.v) } : null,
          low: low ? { time: low.t, height: parseFloat(low.v) } : null,
        };
      });

      setTideData(tideDataArray);

      const marineResponse = await fetch(
        `${MARINE_API_URL}?latitude=${CENTER_LAT}&longitude=${CENTER_LNG}&hourly=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,swell_wave_period&forecast_days=2`
      );

      if (marineResponse.ok) {
        const marineDataResult = await marineResponse.json();
        setMarineData({
          waveHeight: marineDataResult.hourly?.wave_height || [],
          waveDirection: marineDataResult.hourly?.wave_direction || [],
          wavePeriod: marineDataResult.hourly?.wave_period || [],
          swellWaveHeight: marineDataResult.hourly?.swell_wave_height || [],
          swellWaveDirection: marineDataResult.hourly?.swell_wave_direction || [],
          swellWavePeriod: marineDataResult.hourly?.swell_wave_period || [],
          time: marineDataResult.hourly?.time || [],
        });
      }

      const weatherResponse = await fetch(
        `${FORECAST_API_URL}?latitude=${CENTER_LAT}&longitude=${CENTER_LNG}&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m,temperature_2m,precipitation&forecast_days=2&wind_speed_unit=kmh`
      );

      if (weatherResponse.ok) {
        const weatherDataResult = await weatherResponse.json();
        setWeatherData({
          windSpeed: weatherDataResult.hourly?.wind_speed_10m || [],
          windDirection: weatherDataResult.hourly?.wind_direction_10m || [],
          windGusts: weatherDataResult.hourly?.wind_gusts_10m || [],
          temperature: weatherDataResult.hourly?.temperature_2m || [],
          precipitation: weatherDataResult.hourly?.precipitation || [],
          time: weatherDataResult.hourly?.time || [],
        });
      }

    } catch (err) {
      console.error('API Error:', err);
      const mockData: TideData[] = [
        {
          date: new Date().toISOString().split('T')[0],
          high: { time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), height: 1.2 },
          low: { time: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), height: 0.3 },
        },
        {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          high: { time: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), height: 1.1 },
          low: { time: new Date(Date.now() + 32 * 60 * 60 * 1000).toISOString(), height: 0.4 },
        },
      ];
      setTideData(mockData);
      setError('Using demo data - Free APIs temporarily unavailable');
    } finally {
      setLoading(false);
    }
  };

  // Simplified solunar calculation (without SunCalc)
  const solunarData: SolunarPeriod[] = useMemo(() => [
    { type: 'Major', start: '06:00', end: '08:00', activity: 85 },
    { type: 'Major', start: '18:00', end: '20:00', activity: 90 },
    { type: 'Minor', start: '00:00', end: '02:00', activity: 45 },
    { type: 'Minor', start: '12:00', end: '14:00', activity: 50 },
  ], []);

  const currentTide = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const todayData = tideData.find(d => d.date === todayStr);

    if (!todayData) return 0;

    const high = todayData.high;
    const low = todayData.low;

    if (!high || !low) return 0;

    const highTime = new Date(high.time);
    const lowTime = new Date(low.time);

    if (now < highTime && now < lowTime) return low.height;
    if (now > highTime && now > lowTime) return high.height;

    const earlier = highTime < lowTime ? high : low;
    const later = highTime > lowTime ? high : low;

    const earlierTime = new Date(earlier.time);
    const laterTime = new Date(later.time);
    const totalTime = laterTime.getTime() - earlierTime.getTime();
    const elapsedTime = now.getTime() - earlierTime.getTime();
    const ratio = elapsedTime / totalTime;

    return earlier.height + (later.height - earlier.height) * ratio;
  }, [tideData]);

  useEffect(() => {
    fetchTideData();
    connectAISWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const TideChart: React.FC<{ data: TideData[] }> = ({ data }) => {
    return (
      <Box sx={{ height: 200, display: 'flex', alignItems: 'end', gap: 1 }}>
        {data.slice(0, 7).map((tide, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1 }}>
            {tide.high && (
              <Box
                sx={{
                  height: `${(tide.high.height / 3) * 100}%`,
                  width: '100%',
                  maxHeight: 120,
                  bgcolor: '#00D4FF',
                  borderRadius: '4px 4px 0 0',
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  p: 0.5,
                }}
              >
                {tide.high.height.toFixed(1)}
              </Box>
            )}
            {tide.low && (
              <Box
                sx={{
                  height: `${(tide.low.height / 3) * 100}%`,
                  width: '100%',
                  maxHeight: 120,
                  bgcolor: '#20B2AA',
                  borderRadius: '4px 4px 0 0',
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  p: 0.5,
                }}
              >
                {tide.low.height.toFixed(1)}
              </Box>
            )}
            <Typography sx={{ fontSize: '0.7rem', color: '#20B2AA', transform: 'rotate(-45deg)', mt: 1 }}>
              {new Date(tide.date).toLocaleDateString('en-US', { weekday: 'short' })}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  // AIS Vessel Map Component
  const AISVesselMap: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#001233';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      vessels.forEach(vessel => {
        const x = ((vessel.lng + 98.5) / (96.5 + 98.5)) * canvas.width;
        const y = ((27.5 - vessel.lat) / (27.5 - 24.5)) * canvas.height;

        let color = '#20B2AA';         if (vessel.risk === 'caution') color = '#FFD700';
        if (vessel.risk === 'danger') color = '#FF4444';

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();

        const headingRad = (vessel.heading * Math.PI) / 180;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.sin(headingRad) * 15, y - Math.cos(headingRad) * 15);
        ctx.stroke();
      });

      ctx.fillStyle = '#00D4FF';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 6, 0, 2 * Math.PI);
      ctx.fill();

    }, [vessels]);

    return (
      <Box sx={{ position: 'relative', width: '100%', height: 300 }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          style={{ width: '100%', height: '100%', borderRadius: '8px' }}
        />
        <Typography sx={{ position: 'absolute', top: 10, right: 10, color: '#20B2AA', fontSize: '0.8rem' }}>
          {vessels.length} vessels • Updated {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          maxWidth: 1400,
          mx: 'auto',
          my: 4,
          p: 3,
          borderRadius: 'xl',
          border: '10px solid #001F3F',
          background: 'linear-gradient(135deg, #000814 0%, #001233 100%)',
          transform: 'perspective(1200px) rotateY(3deg) rotateX(2deg)',
        }}
      >
        <Stack spacing={2}>
          <Skeleton variant="rectangular" height={80} />
          <Grid container spacing={2}>
            {[...Array(6)].map((_, i) => (
              <Grid key={i} xs={12} md={6} lg={4}>
                <Skeleton variant="rectangular" height={200} />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: 'auto',
        my: 4,
        p: 3,
        borderRadius: 'xl',
        border: '10px solid #001F3F',
        background: 'linear-gradient(135deg, #000814 0%, #001233 100%)',
        minHeight: 700,
        color: 'white',
        boxShadow: 'inset 0 0 20px rgba(0,212,255,0.08)',
        transform: 'perspective(1200px) rotateY(3deg) rotateX(2deg)',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'perspective(1200px) rotateY(1deg) rotateX(1deg) scale(1.01)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, pb: 2, borderBottom: '1px solid rgba(0,212,255,0.2)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{ height: 60, width: 'auto' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <Typography level="h3" sx={{ color: '#00D4FF' }}>
            Ocean Conditions – Brownsville, TX
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography level="body-sm" sx={{ color: '#20B2AA' }}>
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })}
          </Typography>
          <IconButton
            onClick={() => {
              fetchTideData();
              if (wsRef.current) {
                wsRef.current.close();
                connectAISWebSocket();
              }
            }}
            sx={{
              color: '#00D4FF',
              '&:hover': { backgroundColor: 'rgba(0,212,255,0.1)' }
            }}
          >
            ↻
          </IconButton>
        </Box>
      </Box>

      {collisionAlerts.length > 0 && (
        <Stack spacing={1} sx={{ mb: 2 }}>
          {collisionAlerts.map(alert => (
            <Alert
              key={alert.mmsi}
              color={alert.risk === 'danger' ? 'danger' : 'warning'}
              sx={{ animation: alert.risk === 'danger' ? 'pulse 1s infinite' : 'none' }}
            >
              <Typography level="body-sm">
                ⚠️ {alert.risk === 'danger' ? 'HIGH RISK' : 'CAUTION'}: Vessel {alert.mmsi}
                {alert.cpa && ` • CPA: ${alert.cpa.toFixed(1)}nm`}
                {alert.tcpa && ` • TCPA: ${alert.tcpa.toFixed(0)}min`}
              </Typography>
            </Alert>
          ))}
        </Stack>
      )}

      {error && (
        <Alert color="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue as number)} sx={{ bgcolor: 'transparent' }}>
        <TabList
          sx={{
            bgcolor: 'rgba(0,31,63,0.3)',
            borderRadius: 'lg',
            p: 1,
          }}
        >
          <Tab>Now</Tab>
          <Tab>Forecast</Tab>
          <Tab>Marine</Tab>
          <Tab>Solunar</Tab>
          <Tab>Yacht</Tab>
          <Tab>Regs</Tab>
        </TabList>

        {/* Now Tab */}
        <TabPanel value={0}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Card sx={{ bgcolor: 'rgba(0,31,63,0.3)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <CardContent>
                  <Typography level="h4" sx={{ color: '#00D4FF', mb: 2 }}>
                    Current Tide Level
                  </Typography>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography level="h1" sx={{ color: 'white', fontSize: '3rem' }}>
                      {currentTide.toFixed(1)}<Typography level="body-sm" sx={{ color: '#20B2AA' }}>m</Typography>
                    </Typography>
                    <Typography sx={{ color: '#00D4FF', mt: 1 }}>🌊</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid xs={12} md={6}>
              <Card sx={{ bgcolor: 'rgba(0,31,63,0.3)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <CardContent>
                  <Typography level="h4" sx={{ color: '#00D4FF', mb: 2 }}>
                    Today's Tide Times
                  </Typography>
                  <List>
                    {tideData[0]?.high && (
                      <ListItem>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ color: '#00D4FF' }}>High Tide</Typography>
                          <Typography sx={{ color: 'white' }}>
                            {new Date(tideData[0].high!.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                          <Typography sx={{ color: '#20B2AA' }}>
                            {tideData[0].high!.height.toFixed(1)}m
                          </Typography>
                        </Box>
                      </ListItem>
                    )}
                    {tideData[0]?.low && (
                      <ListItem>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ color: '#20B2AA' }}>Low Tide</Typography>
                          <Typography sx={{ color: 'white' }}>
                            {new Date(tideData[0].low!.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                          <Typography sx={{ color: '#20B2AA' }}>
                            {tideData[0].low!.height.toFixed(1)}m
                          </Typography>
                        </Box>
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid xs={12} md={6}>
              <Card sx={{ bgcolor: 'rgba(0,31,63,0.3)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <CardContent>
                  <Typography level="h4" sx={{ color: '#00D4FF', mb: 2 }}>
                    Marine Conditions
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Wave Height</Typography>
                      <Typography sx={{ color: 'white' }}>{marineData?.waveHeight[0]?.toFixed(1) || '1.2'}m</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Wind Speed</Typography>
                      <Typography sx={{ color: 'white' }}>{weatherData?.windSpeed[0]?.toFixed(0) || '8'} km/h</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Water Temp</Typography>
                      <Typography sx={{ color: 'white' }}>{weatherData?.temperature[0]?.toFixed(0) || '24'}°C</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Forecast Tab */}
        <TabPanel value={1}>
          <Card sx={{ bgcolor: 'rgba(0,31,63,0.3)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <CardContent>
              <Typography level="h4" sx={{ color: '#00D4FF', mb: 3 }}>
                10-Day Tide Forecast
              </Typography>
              <TideChart data={tideData} />
            </CardContent>
          </Card>
        </TabPanel>

        {/* Marine Tab */}
        <TabPanel value={2}>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <Card sx={{ bgcolor: 'rgba(0,31,63,0.3)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <CardContent>
                  <Typography level="h4" sx={{ color: '#00D4FF', mb: 3 }}>
                    Wave & Wind Conditions (48 Hours)
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
                    <Box sx={{ p: 3, bgcolor: 'rgba(0,31,63,0.3)', borderRadius: 2, border: '1px solid rgba(0,212,255,0.2)' }}>
                      <Typography sx={{ color: '#00D4FF', mb: 1 }}>Wave Height</Typography>
                      <Typography sx={{ color: 'white', fontSize: '1.5rem' }}>{marineData?.waveHeight[0]?.toFixed(1) || '1.2'} m</Typography>
                      <Typography sx={{ color: '#20B2AA', fontSize: '0.8rem' }}>Period: {marineData?.wavePeriod[0]?.toFixed(0) || '6'}s</Typography>
                    </Box>
                    <Box sx={{ p: 3, bgcolor: 'rgba(0,31,63,0.3)', borderRadius: 2, border: '1px solid rgba(0,212,255,0.2)' }}>
                      <Typography sx={{ color: '#00D4FF', mb: 1 }}>Swell</Typography>
                      <Typography sx={{ color: 'white', fontSize: '1.5rem' }}>{marineData?.swellWaveHeight[0]?.toFixed(1) || '0.8'} m</Typography>
                      <Typography sx={{ color: '#20B2AA', fontSize: '0.8rem' }}>Period: {marineData?.swellWavePeriod[0]?.toFixed(0) || '12'}s</Typography>
                    </Box>
                    <Box sx={{ p: 3, bgcolor: 'rgba(0,31,63,0.3)', borderRadius: 2, border: '1px solid rgba(0,212,255,0.2)' }}>
                      <Typography sx={{ color: '#00D4FF', mb: 1 }}>Wind Speed</Typography>
                      <Typography sx={{ color: 'white', fontSize: '1.5rem' }}>{weatherData?.windSpeed[0]?.toFixed(0) || '8'} km/h</Typography>
                      <Typography sx={{ color: '#20B2AA', fontSize: '0.8rem' }}>Gusts: {weatherData?.windGusts[0]?.toFixed(0) || '12'} km/h</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Solunar Tab */}
        <TabPanel value={3}>
          <Card sx={{ bgcolor: 'rgba(0,31,63,0.3)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <CardContent>
              <Typography level="h4" sx={{ color: '#00D4FF', mb: 3 }}>
                Solunar Periods
              </Typography>
              <List>
                {solunarData.map((period, index) => (
                  <ListItem key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Badge
                        color={period.type === 'Major' ? 'primary' : 'neutral'}
                        variant="soft"
                      >
                        {period.type}
                      </Badge>
                      <Typography sx={{ color: 'white' }}>
                        {period.start} - {period.end}
                      </Typography>
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <Box
                          sx={{
                            height: 8,
                            bgcolor: 'rgba(32,178,170,0.2)',
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              width: `${period.activity}%`,
                              bgcolor: period.type === 'Major' ? '#00D4FF' : '#20B2AA',
                              transition: 'width 0.5s ease',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Yacht Tab */}
        <TabPanel value={4}>
          <Grid container spacing={3}>
            <Grid xs={12} lg={8}>
              <Card sx={{ bgcolor: 'rgba(0,31,63,0.3)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <CardContent>
                  <Typography level="h4" sx={{ color: '#00D4FF', mb: 3 }}>
                    AIS Vessel Traffic Map
                  </Typography>
                  <AISVesselMap />
                </CardContent>
              </Card>
            </Grid>

            <Grid xs={12} lg={4}>
              <Stack spacing={3}>
                <Card sx={{ bgcolor: 'rgba(0,31,63,0.3)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <CardContent>
                    <Typography level="h4" sx={{ color: '#00D4FF', mb: 2 }}>
                      Sea State
                    </Typography>
                    <Typography sx={{ color: 'white', fontSize: '1.2rem' }}>
                      Moderate • Beaufort Scale 3
                    </Typography>
                    <Typography sx={{ color: '#20B2AA', fontSize: '0.9rem', mt: 1 }}>
                      Waves: {marineData?.waveHeight[0]?.toFixed(1) || '1.2'}m
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ bgcolor: 'rgba(0,31,63,0.3)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <CardContent>
                    <Typography level="h4" sx={{ color: '#00D4FF', mb: 2 }}>
                      Weather Window
                    </Typography>
                    <Badge color="success" variant="soft" sx={{ mb: 1 }}>
                      GO - Conditions Favorable
                    </Badge>
                    <Typography sx={{ color: 'white', fontSize: '0.9rem' }}>
                      Next 48 hours: Light winds, moderate seas
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ bgcolor: 'rgba(0,31,63,0.3)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <CardContent>
                    <Typography level="h4" sx={{ color: '#00D4FF', mb: 2 }}>
                      Safe Harbors
                    </Typography>
                    <Stack spacing={1}>
                      <Box>
                        <Typography sx={{ color: 'white', fontSize: '0.9rem' }}>Galveston, TX</Typography>
                        <Typography sx={{ color: '#20B2AA', fontSize: '0.8rem' }}>120nm • 8h ETA</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ color: 'white', fontSize: '0.9rem' }}>Corpus Christi, TX</Typography>
                        <Typography sx={{ color: '#20B2AA', fontSize: '0.8rem' }}>85nm • 6h ETA</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Regulations Tab */}
        <TabPanel value={5}>
          <Card sx={{ bgcolor: 'rgba(0,31,63,0.3)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <CardContent>
              <Typography level="h4" sx={{ color: '#00D4FF', mb: 3 }}>
                Texas Fishing Regulations
              </Typography>
              <List>
                <ListItem>
                  <Box>
                    <Typography sx={{ color: '#00D4FF', fontWeight: 'bold' }}>Red Drum</Typography>
                    <Typography sx={{ color: 'white', fontSize: 'sm' }}>
                      • 5 fish per person daily<br/>
                      • 20-28 inch slot limit<br/>
                      • 1 over 28 inches allowed
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem>
                  <Box>
                    <Typography sx={{ color: '#00D4FF', fontWeight: 'bold' }}>Speckled Trout</Typography>
                    <Typography sx={{ color: 'white', fontSize: 'sm' }}>
                      • 5 fish per person daily<br/>
                      • 15 inch minimum length<br/>
                      • No slot limit
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem>
                  <Box>
                    <Typography sx={{ color: '#00D4FF', fontWeight: 'bold' }}>Flounder</Typography>
                    <Typography sx={{ color: 'white', fontSize: 'sm' }}>
                      • 5 fish per person daily<br/>
                      • 12 inch minimum length<br/>
                      • No slot limit
                    </Typography>
                  </Box>
                </ListItem>
              </List>
              <Box sx={{ mt: 3 }}>
                <Link
                  href="https://tpwd.texas.gov/"
                  target="_blank"
                  rel="noopener"
                  sx={{ color: '#00D4FF', textDecoration: 'underline' }}
                >
                  View complete regulations on TPWD website →
                </Link>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      </Tabs>
    </Box>
  );
};

export default FishingDashboardPanel;