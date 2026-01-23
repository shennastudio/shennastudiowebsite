'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  waveHeight: number;
  windSpeed: number;
  windDirection: number;
  temperature: number;
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

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
      setMarineData({
        waveHeight: 1.2,
        windSpeed: 12,
        windDirection: 180,
        temperature: 24,
      });

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
      setMarineData({
        waveHeight: 1.2,
        windSpeed: 12,
        windDirection: 180,
        temperature: 24,
      });
      setError('Using demo data - Free APIs temporarily unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTideData();
  }, []);

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

  const solunarData: SolunarPeriod[] = useMemo(() => [
    { type: 'Major', start: '06:00', end: '08:00', activity: 85 },
    { type: 'Major', start: '18:00', end: '20:00', activity: 90 },
    { type: 'Minor', start: '00:00', end: '02:00', activity: 45 },
    { type: 'Minor', start: '12:00', end: '14:00', activity: 50 },
  ], []);

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
            Fishing Conditions – Brownsville, TX
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
            onClick={fetchTideData}
            sx={{
              color: '#00D4FF',
              '&:hover': { backgroundColor: 'rgba(0,212,255,0.1)' }
            }}
          >
            ↻
          </IconButton>
        </Box>
      </Box>

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
          <Tab>Regs</Tab>
        </TabList>

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
                      <Typography sx={{ color: 'white' }}>{marineData?.waveHeight.toFixed(1)}m</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Wind Speed</Typography>
                      <Typography sx={{ color: 'white' }}>{marineData?.windSpeed} km/h</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Water Temp</Typography>
                      <Typography sx={{ color: 'white' }}>{marineData?.temperature}°C</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={1}>
          <Card sx={{ bgcolor: 'rgba(0,31,63,0.3)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <CardContent>
              <Typography level="h4" sx={{ color: '#00D4FF', mb: 3 }}>
                10-Day Tide Forecast
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {tideData.slice(0, 5).map((tide, index) => (
                  <Card key={index} sx={{ minWidth: 150, bgcolor: 'rgba(0,31,63,0.3)', border: '1px solid rgba(0,212,255,0.2)' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography level="body-sm" sx={{ color: '#20B2AA', mb: 1 }}>
                        {new Date(tide.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </Typography>
                      {tide.high && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography level="body-sm" sx={{ color: '#00D4FF' }}>High</Typography>
                          <Typography level="body-sm" sx={{ color: 'white' }}>
                            {tide.high.height.toFixed(1)}m • {new Date(tide.high.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                      )}
                      {tide.low && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography level="body-sm" sx={{ color: '#20B2AA' }}>Low</Typography>
                          <Typography level="body-sm" sx={{ color: 'white' }}>
                            {tide.low.height.toFixed(1)}m • {new Date(tide.low.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={2}>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <Card sx={{ bgcolor: 'rgba(0,31,63,0.3)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <CardContent>
                  <Typography level="h4" sx={{ color: '#00D4FF', mb: 3 }}>
                    Wave & Weather Conditions
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
                    <Box sx={{ p: 3, bgcolor: 'rgba(0,31,63,0.3)', borderRadius: 2, border: '1px solid rgba(0,212,255,0.2)' }}>
                      <Typography sx={{ color: '#00D4FF', mb: 1 }}>Wave Height</Typography>
                      <Typography sx={{ color: 'white', fontSize: '1.5rem' }}>{marineData?.waveHeight.toFixed(1)} m</Typography>
                    </Box>
                    <Box sx={{ p: 3, bgcolor: 'rgba(0,31,63,0.3)', borderRadius: 2, border: '1px solid rgba(0,212,255,0.2)' }}>
                      <Typography sx={{ color: '#00D4FF', mb: 1 }}>Wind Speed</Typography>
                      <Typography sx={{ color: 'white', fontSize: '1.5rem' }}>{marineData?.windSpeed} km/h</Typography>
                    </Box>
                    <Box sx={{ p: 3, bgcolor: 'rgba(0,31,63,0.3)', borderRadius: 2, border: '1px solid rgba(0,212,255,0.2)' }}>
                      <Typography sx={{ color: '#00D4FF', mb: 1 }}>Water Temperature</Typography>
                      <Typography sx={{ color: 'white', fontSize: '1.5rem' }}>{marineData?.temperature}°C</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

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

        <TabPanel value={4}>
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