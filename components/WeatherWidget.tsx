import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, Wind, Thermometer, Droplets, Loader2 } from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  code: number;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      // Coordinates for Koheda, Telangana (Approx 17.30, 78.62)
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=17.30&longitude=78.62&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m'
      );
      const data = await response.json();
      
      if (data.current) {
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          isDay: data.current.is_day === 1,
          code: data.current.weather_code,
          condition: getWeatherDescription(data.current.weather_code)
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(true);
      setLoading(false);
    }
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return 'Clear Sky';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 55) return 'Drizzle';
    if (code <= 65) return 'Rainy';
    if (code <= 82) return 'Rain Showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Cloudy';
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-8 h-8 text-gold" />;
    if (code <= 3) return <Cloud className="w-8 h-8 text-blue-300" />;
    if (code <= 65 || (code >= 80 && code <= 82)) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (code >= 95) return <CloudLightning className="w-8 h-8 text-purple-400" />;
    return <Cloud className="w-8 h-8 text-gray-400" />;
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Update every 10 mins
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl flex items-center justify-center min-w-[180px] h-[100px]">
        <Loader2 className="w-5 h-5 animate-spin text-white/50" />
      </div>
    );
  }

  if (error || !weather) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-[2rem] text-white animate-in fade-in duration-500 flex flex-col gap-3 min-w-[220px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-black tracking-widest text-white/60 mb-1">Koheda Weather</p>
          <h4 className="font-serif italic text-lg">{weather.condition}</h4>
        </div>
        {getWeatherIcon(weather.code)}
      </div>
      
      <div className="flex items-end gap-3">
        <span className="text-4xl font-bold font-sans tracking-tighter">{weather.temp}°C</span>
        <div className="flex flex-col text-[10px] uppercase font-bold text-white/70 mb-1">
          <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> {weather.humidity}%</span>
          <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> {weather.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;