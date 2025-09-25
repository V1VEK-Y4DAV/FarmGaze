import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  MapPin,
  Search,
  Droplets
} from "lucide-react";

import DrySpellVisualization from "../components/DrySpellVisualization";
import SimpleMonsoonAnalyzer from "../components/SimpleMonsoonAnalyzer";

interface Location {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

const CareCure = () => {
  const [weatherData, setWeatherData] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [latitude, setLatitude] = useState(20.5937); // Default to India's center
  const [longitude, setLongitude] = useState(78.9629); // Default to India's center
  const [coordinatesLoading, setCoordinatesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"weather" | "monsoon">("weather");
  const [monsoonView, setMonsoonView] = useState<"traditional" | "analyzer">("traditional");

  // Function to generate 21 days (past 5, today, next 15)
  const generateCalendarDays = () => {
    const days = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 5); // Start 5 days before today
    
    for (let i = 0; i < 21; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Search locations using Open-Meteo Geocoding API
  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setLocations([]);
      return;
    }

    setCoordinatesLoading(true);
    setError(null);
    try {
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error searching locations:', err);
    } finally {
      setCoordinatesLoading(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setLocations([]);
    setSearchQuery("");
    setLatitude(location.lat);
    setLongitude(location.lon);
  };

  // Handle search
  const handleSearch = () => {
    searchLocations(searchQuery);
  };

  // Fetch weather data from both Open-Meteo APIs
  useEffect(() => {
    const fetchWeatherData = async () => {
      // Don't fetch weather data if we don't have a selected location
      if (!selectedLocation) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Calculate date ranges
        const today = new Date();
        const pastStartDate = new Date(today);
        pastStartDate.setDate(today.getDate() - 5);
        const futureEndDate = new Date(today);
        futureEndDate.setDate(today.getDate() + 15);
        
        // Format dates as YYYY-MM-DD
        const pastStartDateStr = pastStartDate.toISOString().split('T')[0];
        const todayStr = today.toISOString().split('T')[0];
        const futureEndDateStr = futureEndDate.toISOString().split('T')[0];
        
        // Fetch historical weather data (past 5 days + today)
        const archiveResponse = await fetch(
          `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${pastStartDateStr}&end_date=${todayStr}&daily=weather_code&timezone=auto`
        );
        
        // Fetch forecast weather data (today + next 15 days)
        const forecastResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${todayStr}&end_date=${futureEndDateStr}&daily=weather_code&timezone=auto`
        );
        
        if (!archiveResponse.ok) {
          const errorText = await archiveResponse.text();
          throw new Error(`Failed to fetch historical weather data: ${archiveResponse.status} ${archiveResponse.statusText}. Details: ${errorText}`);
        }
        
        if (!forecastResponse.ok) {
          const errorText = await forecastResponse.text();
          throw new Error(`Failed to fetch forecast weather data: ${forecastResponse.status} ${forecastResponse.statusText}. Details: ${errorText}`);
        }
        
        const archiveData = await archiveResponse.json();
        const forecastData = await forecastResponse.json();
        
        if (archiveData.error) {
          throw new Error(archiveData.reason || 'Unknown error from archive weather API');
        }
        
        if (forecastData.error) {
          throw new Error(forecastData.reason || 'Unknown error from forecast weather API');
        }
        
        // Create a mapping of date strings to weather codes
        const weatherMap: {[key: string]: number} = {};
        
        // Process archive data (past 5 days + today)
        if (archiveData.daily && archiveData.daily.time && archiveData.daily.weather_code) {
          archiveData.daily.time.forEach((date: string, index: number) => {
            weatherMap[date] = archiveData.daily.weather_code[index];
          });
        }
        
        // Process forecast data (today + next 15 days)
        // Skip the first entry (today) to avoid duplication
        if (forecastData.daily && forecastData.daily.time && forecastData.daily.weather_code) {
          for (let i = 1; i < forecastData.daily.time.length; i++) {
            weatherMap[forecastData.daily.time[i]] = forecastData.daily.weather_code[i];
          }
        }
        
        setWeatherData(weatherMap);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching weather data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [latitude, longitude, selectedLocation]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Weather icon mapping function
  const getWeatherIcon = (code: number) => {
    const weatherIcons: { [key: number]: JSX.Element } = {
      0: <Sun className="w-6 h-6 text-yellow-500" />,
      1: <Sun className="w-6 h-6 text-yellow-400" />,
      2: <Cloud className="w-6 h-6 text-gray-400" />,
      3: <Cloud className="w-6 h-6 text-gray-500" />,
      45: <CloudFog className="w-6 h-6 text-gray-300" />,
      48: <CloudFog className="w-6 h-6 text-gray-300" />,
      51: <CloudRain className="w-6 h-6 text-blue-300" />,
      53: <CloudRain className="w-6 h-6 text-blue-400" />,
      55: <CloudRain className="w-6 h-6 text-blue-500" />,
      61: <CloudRain className="w-6 h-6 text-blue-400" />,
      63: <CloudRain className="w-6 h-6 text-blue-500" />,
      65: <CloudRain className="w-6 h-6 text-blue-600" />,
      71: <CloudSnow className="w-6 h-6 text-blue-200" />,
      73: <CloudSnow className="w-6 h-6 text-blue-300" />,
      75: <CloudSnow className="w-6 h-6 text-blue-400" />,
      77: <CloudSnow className="w-6 h-6 text-blue-200" />,
      80: <CloudRain className="w-6 h-6 text-blue-400" />,
      81: <CloudRain className="w-6 h-6 text-blue-500" />,
      82: <CloudRain className="w-6 h-6 text-blue-600" />,
      85: <CloudSnow className="w-6 h-6 text-blue-300" />,
      86: <CloudSnow className="w-6 h-6 text-blue-400" />,
      95: <CloudLightning className="w-6 h-6 text-yellow-500" />,
      96: <CloudLightning className="w-6 h-6 text-yellow-500" />,
      99: <CloudLightning className="w-6 h-6 text-yellow-500" />
    };
    return weatherIcons[code] || <Sun className="w-6 h-6 text-yellow-500" />;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Location Search Section */}
      <Card className="mb-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Search className="w-6 h-6 text-green-600 dark:text-green-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              Search Location
            </span>
          </CardTitle>
          <CardDescription>
            Enter a location to get area-specific weather information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Input
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

          {coordinatesLoading && (
            <div className="flex justify-center items-center mt-2">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
            </div>
          )}
          
          {/* Current Location Display */}
          {selectedLocation && (
            <div className="mt-4 flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Current Location: {selectedLocation.name}
                {selectedLocation.state && `, ${selectedLocation.state}`}
                {selectedLocation.country && `, ${selectedLocation.country}`}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "weather"
              ? "border-b-2 border-green-500 text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("weather")}
        >
          <CalendarIcon className="w-4 h-4 inline mr-2" />
          Weather Calendar
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "monsoon"
              ? "border-b-2 border-green-500 text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("monsoon")}
        >
          <Droplets className="w-4 h-4 inline mr-2" />
          Monsoon Analysis
        </button>
      </div>

      {/* Weather Calendar Section */}
      {activeTab === "weather" && (
        <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CalendarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                21-Day Weather Calendar
              </span>
            </CardTitle>
            <CardDescription>
              Weather data: past 5 days (archive) and next 15 days (forecast)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {loading && (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                Error: {error}
              </div>
            )}
            
            {!loading && !error && selectedLocation && (
              <>
                <div className="mb-6">
                  <div className="text-center mb-2">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                      {calendarDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      {calendarDays[0].getMonth() !== calendarDays[20].getMonth() 
                        ? ` - ${calendarDays[20].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                        : ''}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(calendarDays[0])} to {formatDate(calendarDays[20])}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-inner">
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                      <div 
                        key={day} 
                        className={`text-center text-xs font-bold py-2 rounded-lg ${
                          index === 0 
                            ? 'text-red-500 dark:text-red-400' 
                            : index === 6 
                              ? 'text-blue-500 dark:text-blue-400' 
                              : 'text-gray-600 dark:text-gray-300'
                        } bg-gray-100 dark:bg-gray-700`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => {
                      const dateKey = formatDateKey(date);
                      const weatherCode = weatherData[dateKey];
                      
                      return (
                        <div
                          key={index}
                          className={`h-16 rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${
                            isToday(date)
                              ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg ring-2 ring-green-300'
                              : date.getDay() === 0
                                ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                                : date.getDay() === 6
                                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                  : 'bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}
                        >
                          <span className="text-sm font-bold">{date.getDate()}</span>
                          <span className="text-xs opacity-80">
                            {date.toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          {weatherCode !== undefined ? (
                            <div className="mt-1">
                              {getWeatherIcon(weatherCode)}
                            </div>
                          ) : (
                            <div className="mt-1 text-xs text-gray-400">N/A</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 rounded-lg border border-green-100 dark:border-gray-600">
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Today</span>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        Weather data from Open-Meteo Archive (past) and Forecast (future) APIs
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Initial State - No data */}
            {!loading && !error && !selectedLocation && (
              <div className="text-center py-12">
                <CalendarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Search for Location</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter a location name to view the 21-day weather calendar
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Monsoon Analysis Section */}
      {activeTab === "monsoon" && selectedLocation && (
        <div className="space-y-6">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 font-medium text-sm ${
                monsoonView === "traditional"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setMonsoonView("traditional")}
            >
              <Droplets className="w-4 h-4 inline mr-2" />
              Traditional Analysis
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${
                monsoonView === "analyzer"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setMonsoonView("analyzer")}
            >
              <CalendarIcon className="w-4 h-4 inline mr-2" />
              Dry Spell Analyzer
            </button>
          </div>
          
          {monsoonView === "traditional" ? (
            <DrySpellVisualization />
          ) : (
            <SimpleMonsoonAnalyzer />
          )}
        </div>
      )}
      
      {/* Message when no location is selected in monsoon tab */}
      {activeTab === "monsoon" && !selectedLocation && (
        <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <Droplets className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Select a Location</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please select a location to analyze monsoon patterns
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CareCure;