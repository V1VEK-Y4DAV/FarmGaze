import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudFog, 
  Wind, 
  Droplets,
  Thermometer,
  Sunrise,
  Sunset
} from "lucide-react";

// Indian states data with their capital cities and coordinates
const INDIAN_STATES = [
  { name: "Andhra Pradesh", capital: "Hyderabad", lat: 17.3850, lon: 78.4867 },
  { name: "Arunachal Pradesh", capital: "Itanagar", lat: 27.0844, lon: 93.6053 },
  { name: "Assam", capital: "Dispur", lat: 26.1433, lon: 91.7898 },
  { name: "Bihar", capital: "Patna", lat: 25.5941, lon: 85.1376 },
  { name: "Chhattisgarh", capital: "Raipur", lat: 21.2514, lon: 81.6296 },
  { name: "Goa", capital: "Panaji", lat: 15.4909, lon: 73.8278 },
  { name: "Gujarat", capital: "Gandhinagar", lat: 23.2156, lon: 72.6369 },
  { name: "Haryana", capital: "Chandigarh", lat: 30.7333, lon: 76.7794 },
  { name: "Himachal Pradesh", capital: "Shimla", lat: 31.1048, lon: 77.1734 },
  { name: "Jharkhand", capital: "Ranchi", lat: 23.3441, lon: 85.3096 },
  { name: "Karnataka", capital: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { name: "Kerala", capital: "Thiruvananthapuram", lat: 8.5241, lon: 76.9366 },
  { name: "Madhya Pradesh", capital: "Bhopal", lat: 23.2599, lon: 77.4126 },
  { name: "Maharashtra", capital: "Mumbai", lat: 19.0760, lon: 72.8777 },
  { name: "Manipur", capital: "Imphal", lat: 24.8170, lon: 93.9368 },
  { name: "Meghalaya", capital: "Shillong", lat: 25.5788, lon: 91.8933 },
  { name: "Mizoram", capital: "Aizawl", lat: 23.7271, lon: 92.7176 },
  { name: "Nagaland", capital: "Kohima", lat: 25.6751, lon: 94.1086 },
  { name: "Odisha", capital: "Bhubaneswar", lat: 20.2961, lon: 85.8245 },
  { name: "Punjab", capital: "Chandigarh", lat: 30.7333, lon: 76.7794 },
  { name: "Rajasthan", capital: "Jaipur", lat: 26.9124, lon: 75.7873 },
  { name: "Sikkim", capital: "Gangtok", lat: 27.3314, lon: 88.6138 },
  { name: "Tamil Nadu", capital: "Chennai", lat: 13.0827, lon: 80.2707 },
  { name: "Telangana", capital: "Hyderabad", lat: 17.3850, lon: 78.4867 },
  { name: "Tripura", capital: "Agartala", lat: 23.8315, lon: 91.2868 },
  { name: "Uttar Pradesh", capital: "Lucknow", lat: 26.8467, lon: 80.9462 },
  { name: "Uttarakhand", capital: "Dehradun", lat: 30.3165, lon: 78.0322 },
  { name: "West Bengal", capital: "Kolkata", lat: 22.5726, lon: 88.3639 }
];

interface WeatherData {
  date: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  pressure: number;
  visibility: number;
  maxTemp: number;
  minTemp: number;
  sunrise: string;
  sunset: string;
  icon: string;
  weatherCode: number;
}

const Weather = () => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const getPastDates = (days: number) => {
    const dates = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getWeatherDescription = (code: number) => {
    const weatherCodes: { [key: number]: string } = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail"
    };
    return weatherCodes[code] || "Unknown";
  };

  const getWeatherIcon = (code: number) => {
    const weatherIcons: { [key: number]: JSX.Element } = {
      0: <Sun className="w-16 h-16 text-yellow-500 animate-pulse" />,
      1: <Sun className="w-16 h-16 text-yellow-400" />,
      2: <Cloud className="w-16 h-16 text-gray-400" />,
      3: <Cloud className="w-16 h-16 text-gray-500" />,
      45: <CloudFog className="w-16 h-16 text-gray-300" />,
      48: <CloudFog className="w-16 h-16 text-gray-300" />,
      51: <CloudRain className="w-16 h-16 text-blue-300" />,
      53: <CloudRain className="w-16 h-16 text-blue-400" />,
      55: <CloudRain className="w-16 h-16 text-blue-500" />,
      61: <CloudRain className="w-16 h-16 text-blue-400" />,
      63: <CloudRain className="w-16 h-16 text-blue-500" />,
      65: <CloudRain className="w-16 h-16 text-blue-600" />,
      71: <CloudSnow className="w-16 h-16 text-blue-200" />,
      73: <CloudSnow className="w-16 h-16 text-blue-300" />,
      75: <CloudSnow className="w-16 h-16 text-blue-400" />,
      77: <CloudSnow className="w-16 h-16 text-blue-200" />,
      80: <CloudRain className="w-16 h-16 text-blue-400" />,
      81: <CloudRain className="w-16 h-16 text-blue-500" />,
      82: <CloudRain className="w-16 h-16 text-blue-600" />,
      85: <CloudSnow className="w-16 h-16 text-blue-300" />,
      86: <CloudSnow className="w-16 h-16 text-blue-400" />,
      95: <CloudLightning className="w-16 h-16 text-yellow-500 animate-pulse" />,
      96: <CloudLightning className="w-16 h-16 text-yellow-500 animate-pulse" />,
      99: <CloudLightning className="w-16 h-16 text-yellow-500 animate-pulse" />
    };
    return weatherIcons[code] || <Sun className="w-16 h-16 text-yellow-500" />;
  };

  const fetchWeatherData = async (state: string) => {
    setLoading(true);
    setError("");
    try {
      const stateData = INDIAN_STATES.find(s => s.name === state);
      if (!stateData) return;

      // Fetch forecast weather data
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${stateData.lat}&longitude=${stateData.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto&forecast_days=7`
      );
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason);
      }

      // Transform the data
      const transformedData = data.daily.time.map((date: string, index: number) => ({
        date,
        temperature: Number(((data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2).toFixed(2)),
        maxTemp: Number(data.daily.temperature_2m_max[index].toFixed(2)),
        minTemp: Number(data.daily.temperature_2m_min[index].toFixed(2)),
        description: getWeatherDescription(data.daily.weathercode[index]),
        humidity: 0, // Not available in daily forecast
        windSpeed: Number(data.daily.windspeed_10m_max[index].toFixed(2)),
        precipitation: Number(data.daily.precipitation_sum[index].toFixed(2)),
        pressure: 0, // Not available in daily forecast
        visibility: 0, // Not available in daily forecast
        sunrise: "N/A", // Not available in daily forecast
        sunset: "N/A", // Not available in daily forecast
        icon: `https://api.open-meteo.com/v1/icon/${data.daily.weathercode[index]}.png`,
        weatherCode: data.daily.weathercode[index]
      }));
      
      setWeatherData(transformedData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedState) {
      fetchWeatherData(selectedState);
    }
  }, [selectedState]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 container mx-auto px-4 py-8 lg:py-12">
          <h1 className="text-3xl font-bold mb-6">Weather Forecast</h1>
          
          {/* State Selection */}
          <div className="mb-8">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              Select State
            </label>
            <select
              id="state"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full md:w-64 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ease-in-out"
            >
              <option value="">Select a state</option>
              {INDIAN_STATES.map((state) => (
                <option key={state.name} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 animate-fade-in">
              {error}
            </div>
          )}

          {/* Weather Cards */}
          {weatherData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weatherData.map((day, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl will-change-transform animate-fade-in-up backdrop-blur-sm bg-opacity-80"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{day.date}</h2>
                      {getWeatherIcon(day.weatherCode)}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Thermometer className="w-8 h-8 text-red-500" />
                          <div>
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">{day.temperature}°C</span>
                            <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">{day.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <Droplets className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{day.humidity.toFixed(2)}%</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <Wind className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Wind</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{day.windSpeed.toFixed(2)} km/h</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <Sunrise className="w-5 h-5 text-yellow-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Sunrise</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{day.sunrise}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <Sunset className="w-5 h-5 text-orange-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Sunset</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{day.sunset}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;
