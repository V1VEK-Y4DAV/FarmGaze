import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Sunset,
  Search,
  MapPin
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

interface Location {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

const Weather = () => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
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

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setLocations([]);
      return;
    }

    setSearching(true);
    setError("");
    try {
      // Use Open-Meteo Geocoding API to search for locations
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      );
      
      const data = await response.json();
      
      if (data.results) {
        setLocations(data.results.map((result: any) => ({
          name: result.name,
          lat: result.latitude,
          lon: result.longitude,
          country: result.country,
          state: result.admin1
        })));
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error("Error searching locations:", error);
      setError("Failed to search locations");
    } finally {
      setSearching(false);
    }
  };

  const fetchWeatherData = async (lat: number, lon: number, locationName: string) => {
    setLoading(true);
    setError("");
    try {
      // Fetch current weather data
      const currentResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_hours,wind_speed_10m_max,wind_gusts_10m_max&timezone=auto&forecast_days=7`
      );
      
      const currentData = await currentResponse.json();
      
      if (currentData.error) {
        throw new Error(currentData.reason);
      }

      // Transform the data
      const transformedData = currentData.daily.time.map((date: string, index: number) => ({
        date,
        temperature: Number(((currentData.daily.temperature_2m_max[index] + currentData.daily.temperature_2m_min[index]) / 2).toFixed(2)),
        maxTemp: Number(currentData.daily.temperature_2m_max[index].toFixed(2)),
        minTemp: Number(currentData.daily.temperature_2m_min[index].toFixed(2)),
        description: getWeatherDescription(currentData.daily.weather_code[index]),
        humidity: currentData.current.relative_humidity_2m || 0,
        windSpeed: Number(currentData.daily.wind_speed_10m_max[index].toFixed(2)),
        precipitation: Number(currentData.daily.precipitation_sum[index].toFixed(2)),
        pressure: currentData.current.pressure_msl || 0,
        visibility: 0, // Not available in this API
        sunrise: currentData.daily.sunrise[index].split('T')[1],
        sunset: currentData.daily.sunset[index].split('T')[1],
        icon: `https://api.open-meteo.com/v1/icon/${currentData.daily.weather_code[index]}.png`,
        weatherCode: currentData.daily.weather_code[index]
      }));
      
      setWeatherData(transformedData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchLocations(searchQuery);
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setLocations([]);
    setSearchQuery("");
    fetchWeatherData(location.lat, location.lon, location.name);
  };

  const handleStateSelect = (stateName: string) => {
    setSelectedState(stateName);
    const stateData = INDIAN_STATES.find(s => s.name === stateName);
    if (stateData) {
      setSelectedLocation({
        name: stateData.capital,
        lat: stateData.lat,
        lon: stateData.lon,
        country: "India"
      });
      fetchWeatherData(stateData.lat, stateData.lon, stateData.capital);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 container mx-auto px-4 py-8 lg:py-12">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Weather Forecast</h1>
          
          {/* Search Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Location
                </label>
                <div className="relative">
                  <Input
                    id="search"
                    type="text"
                    placeholder="Enter city or location name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button
                    onClick={handleSearch}
                    className="absolute right-0 top-0 h-full px-3"
                    variant="ghost"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="w-full md:w-64">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Or Select State
                </label>
                <Select value={selectedState} onValueChange={handleStateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state.name} value={state.name}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location Search Results */}
            {locations.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mt-2 max-h-60 overflow-y-auto">
                {locations.map((location) => (
                  <div
                    key={`${location.lat}-${location.lon}`}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span>
                      {location.name}
                      {location.state && `, ${location.state}`}
                      {location.country && `, ${location.country}`}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {searching && (
              <div className="flex justify-center items-center mt-2">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
              </div>
            )}
          </div>

          {/* Current Location Display */}
          {selectedLocation && (
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Weather for {selectedLocation.name}
                  {selectedLocation.state && `, ${selectedLocation.state}`}
                  {selectedLocation.country && `, ${selectedLocation.country}`}
                </h2>
              </div>
            </div>
          )}

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
          {weatherData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weatherData.map((day, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl will-change-transform animate-fade-in-up backdrop-blur-sm bg-opacity-80"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </h2>
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
                            <p className="font-semibold text-gray-900 dark:text-white">{day.humidity.toFixed(0)}%</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <Wind className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Wind</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{day.windSpeed.toFixed(1)} km/h</p>
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

          {/* Initial State - No data */}
          {!loading && !error && weatherData.length === 0 && !selectedLocation && (
            <div className="text-center py-12">
              <Cloud className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Search for Weather</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enter a location name or select a state to view the weather forecast
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;