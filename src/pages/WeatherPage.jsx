
import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  AlertTriangle,
  RefreshCw,
  Search,
  MapPin,
  Eye,
} from 'lucide-react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { weatherService } from '../services/mockServices';
import { WEATHER_TREND_DATA } from '../data/demoData';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const WEATHER_ICONS = {
  Sunny: '☀️',
  'Hot & Sunny': '🌤️',
  'Partly Cloudy': '⛅',
  Cloudy: '🌥️',
  Rainy: '🌧️',
  'Heavy Rain': '⛈️',
  Foggy: '🌫️',
};

const QUICK_LOCATIONS = [
  'Ghaziabad',
  'Delhi',
  'Lucknow',
  'Noida',
  'Pune',
  'Amritsar',
];

const SEVERITY_STYLES = {
  danger:
    'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400',
  warning:
    'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-400',
  info:
    'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400',
};

export const WeatherPage = () => {
  const [location, setLocation] = useState('Ghaziabad');
  const [searchInput, setSearchInput] = useState('Ghaziabad');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeather = async (loc) => {
    if (!loc?.trim()) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await weatherService.getWeather(loc.trim());

      if (!res?.data) {
        throw new Error('Weather data was not received. Please try again.');
      }

      setWeather(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err.message ||
          'Unable to fetch weather. Please check your internet connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(location);
  }, [location]);

  const handleSearch = () => {
    const city = searchInput.trim();

    if (!city) {
      setError('Please enter a city name.');
      return;
    }

    setLocation(city);
    // Search again even if the same city is entered.
    if (city.toLowerCase() === location.toLowerCase()) {
      fetchWeather(city);
    }
  };

  const handleRefresh = () => {
    fetchWeather(location);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <CloudSun className="text-blue-500" size={26} />
            Weather Forecast & Alerts
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Live weather data and general farming precautions
          </p>
        </div>

        <span className="flex-shrink-0 text-sm font-medium text-green-700 dark:text-green-400">
          Live Weather API
        </span>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MapPin
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder="Enter any city name..."
              className="input pl-9"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn-primary px-6"
          >
            <Search size={16} />
            Search
          </button>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="btn-secondary px-4"
            title="Refresh weather"
          >
            <RefreshCw
              size={16}
              className={loading ? 'animate-spin' : ''}
            />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs text-gray-400">Quick select:</span>

          {QUICK_LOCATIONS.map((city) => (
            <button
              key={city}
              onClick={() => {
                setSearchInput(city);
                setLocation(city);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                location.toLowerCase() === city.toLowerCase()
                  ? 'bg-primary-700 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/20'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {lastUpdated && (
          <p className="text-xs text-gray-400 mt-2">
            Last fetched: {lastUpdated.toLocaleTimeString('en-IN')}
          </p>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="card p-12">
          <LoadingSpinner size="lg" text="Fetching live weather data..." />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="card p-5 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3 text-red-600 dark:text-red-400">
            <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />

            <div>
              <p className="font-semibold">Unable to load weather</p>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-xs mt-2">
                Check your internet connection and city spelling, then try
                again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Weather data */}
      {!loading && !error && weather && (
        <>
          {/* Current conditions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-5 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={14} className="text-primary-600" />

                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {weather.city}
                  {weather.state ? `, ${weather.state}` : ''}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-5xl font-bold text-gray-900 dark:text-gray-100">
                    {weather.temperature}°
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    {weather.condition}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Feels like {weather.feelsLike}°C
                  </p>
                </div>

                <span className="text-5xl">
                  {WEATHER_ICONS[weather.condition] || '🌤️'}
                </span>
              </div>
            </div>

            {[
              {
                icon: Droplets,
                label: 'Humidity',
                value: `${weather.humidity}%`,
                sub: 'Relative humidity',
                color: 'text-blue-500',
                bg: 'bg-blue-50 dark:bg-blue-900/20',
              },
              {
                icon: Wind,
                label: 'Wind Speed',
                value: `${weather.windSpeed} km/h`,
                sub: 'Current wind',
                color: 'text-teal-500',
                bg: 'bg-teal-50 dark:bg-teal-900/20',
              },
              {
                icon: Eye,
                label: 'Visibility',
                value: `${weather.visibility} km`,
                sub: `UV Index: ${weather.uvIndex}`,
                color: 'text-purple-500',
                bg: 'bg-purple-50 dark:bg-purple-900/20',
              },
            ].map(({ icon: Icon, label, value, sub, color, bg }) => (
              <div key={label} className="card p-5">
                <div
                  className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}
                >
                  <Icon size={20} className={color} />
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {label}
                </p>

                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {value}
                </p>

                <p className="text-xs text-gray-400 mt-1">{sub}</p>
              </div>
            ))}
          </div>

          {/* 7-day forecast */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              7-Day Forecast
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {(weather.forecast || []).map((day, index) => (
                <div
                  key={`${day.day}-${index}`}
                  className={`flex flex-col items-center p-3 rounded-2xl text-center ${
                    index === 0
                      ? 'bg-primary-700 text-white shadow-md'
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <p
                    className={`text-xs font-semibold ${
                      index === 0
                        ? 'text-primary-100'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {day.day}
                  </p>

                  <span className="text-2xl my-2">
                    {WEATHER_ICONS[day.condition] || '⛅'}
                  </span>

                  <p
                    className={`text-sm font-bold ${
                      index === 0
                        ? 'text-white'
                        : 'text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {day.high}° / {day.low}°
                  </p>

                  <p
                    className={`text-xs mt-1 ${
                      index === 0 ? 'text-primary-200' : 'text-blue-500'
                    }`}
                  >
                    💧 {day.rain}% rain chance
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Weather alerts and farming precautions */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                Weather Alerts
              </h2>

              {(weather.alerts || []).length === 0 ? (
                <p className="text-sm text-green-600 dark:text-green-400">
                  No rule-based alerts triggered by the available forecast.
                </p>
              ) : (
                <div className="space-y-3">
                  {weather.alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`border rounded-xl p-3 ${
                        SEVERITY_STYLES[alert.severity] ||
                        SEVERITY_STYLES.info
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          size={15}
                          className="flex-shrink-0 mt-0.5"
                        />
                        <p className="text-sm">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-400 mt-3">
                Automatically generated alerts, not official weather warnings.
              </p>
            </div>

            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Farming Precautions
              </h2>

              <ul className="space-y-2">
                {(weather.farmingPrecautions || []).map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span className="text-primary-600 font-bold flex-shrink-0">
                      •
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Historical-style chart: still demo data */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Seasonal Weather Trends
            </h2>

            <p className="text-xs text-gray-400 mb-4">
              Illustrative monthly temperature and rainfall pattern — demo
              data, not live historical observations.
            </p>

            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={WEATHER_TREND_DATA}>
                <defs>
                  <linearGradient
                    id="tempGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#f59e0b"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#f59e0b"
                      stopOpacity={0}
                    />
                  </linearGradient>

                  <linearGradient
                    id="rainGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#3b82f6"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#3b82f6"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />

                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="temp"
                  name="Temperature (°C)"
                  stroke="#f59e0b"
                  fill="url(#tempGrad)"
                  strokeWidth={2}
                />

                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="rainfall"
                  name="Rainfall (mm)"
                  stroke="#3b82f6"
                  fill="url(#rainGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherPage;
