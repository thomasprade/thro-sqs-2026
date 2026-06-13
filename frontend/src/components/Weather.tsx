import type { Weather as WeatherData } from '@app/shared';
import { useEffect, useState } from 'react';
import { getWeather } from '../api';

const WEATHER_ICONS: { codes: number[]; icon: string }[] = [
  { codes: [0], icon: '☀️' },
  { codes: [1, 2, 3], icon: '⛅' },
  { codes: [45, 48], icon: '🌫️' },
  { codes: [51, 53, 55], icon: '🌦️' },
  { codes: [56, 57], icon: '🌧️' },
  { codes: [61, 63, 65], icon: '🌧️' },
  { codes: [66, 67], icon: '🌨️' },
  { codes: [71, 73, 75], icon: '❄️' },
  { codes: [77], icon: '🌨️' },
  { codes: [80, 81, 82], icon: '🌦️' },
  { codes: [85, 86], icon: '🌨️' },
  { codes: [95], icon: '⛈️' },
  { codes: [96, 99], icon: '⛈️' },
];

function getWeatherIcon(code: number): string {
  return WEATHER_ICONS.find((entry) => entry.codes.includes(code))?.icon ?? '🌡️';
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWeather()
      .then(setWeather)
      .catch(() => setError('Failed to load weather'));
  }, []);

  if (error) return <span>{error}</span>;
  if (!weather) return <span>Loading weather…</span>;

  return (
    <span>
      {getWeatherIcon(weather.weatherCode)} {weather.temperature}°C
    </span>
  );
}

/**
 * Code	Description
0	Clear sky
1, 2, 3	Mainly clear, partly cloudy, and overcast
45, 48	Fog and depositing rime fog
51, 53, 55	Drizzle: Light, moderate, and dense intensity
56, 57	Freezing Drizzle: Light and dense intensity
61, 63, 65	Rain: Slight, moderate and heavy intensity
66, 67	Freezing Rain: Light and heavy intensity
71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
77	Snow grains
80, 81, 82	Rain showers: Slight, moderate, and violent
85, 86	Snow showers slight and heavy
95 *	Thunderstorm: Slight or moderate
96, 99 *	Thunderstorm with slight and heavy hail
 */
