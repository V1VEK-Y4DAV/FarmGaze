import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Loader2, Sparkles, MapPin, BarChart3, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';

interface CropRecommendation {
  crop: string;
  probability: number;
  confidence: 'high' | 'medium' | 'low';
  season_suitable: string;
  weather_factors: {
    temperature: number;
    humidity: number;
    rainfall_forecast: number;
  };
  suitability_reason?: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  wind_speed: number;
  precipitation_current: number;
  precipitation_week: number;
  fetch_time: string;
}

interface PredictionResponse {
  state: string;
  district: string;
  season: string;
  predictions: CropRecommendation[];
  weather_data: WeatherData;
  timestamp: string;
}

const AIRecommendation = () => {
  const { t } = useLanguage();
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedSeason, setSelectedSeason] = useState<string>('auto');
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentSeason, setCurrentSeason] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<'unknown' | 'healthy' | 'error'>('unknown');
  const [nativeOnly, setNativeOnly] = useState<boolean>(true);

  // API base URL - Enhanced seasonal API with improved recommendations
  const API_BASE = 'http://localhost:5004';

  // Check API health on component mount
  useEffect(() => {
    checkApiHealth();
    loadStates();
  }, []);

  // Load districts when state changes
  useEffect(() => {
    if (selectedState) {
      loadDistricts(selectedState);
      setSelectedDistrict('');
      setRecommendations([]);
    }
  }, [selectedState]);

  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      if (response.ok) {
        setApiStatus('healthy');
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      setApiStatus('error');
      console.error('API health check failed:', error);
    }
  };

  const loadStates = async () => {
    try {
      const response = await fetch(`${API_BASE}/states`);
      if (response.ok) {
        const data = await response.json();
        setStates(data.states || []);
      }
    } catch (error) {
      console.error('Failed to load states:', error);
    }
  };

  const loadDistricts = async (state: string) => {
    try {
      const response = await fetch(`${API_BASE}/districts/${encodeURIComponent(state)}`);
      if (response.ok) {
        const data = await response.json();
        setDistricts(data.districts || []);
      }
    } catch (error) {
      console.error('Failed to load districts:', error);
    }
  };

  const getCropRecommendations = async () => {
    if (!selectedState || !selectedDistrict) {
      setError('Please select both state and district');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: selectedState,
          district: selectedDistrict,
          season: selectedSeason === 'auto' ? null : selectedSeason,
          top_k: 5,
          district_native: nativeOnly
        }),
      });

      if (response.ok) {
        const data: PredictionResponse = await response.json();
        setRecommendations(data.predictions);
        setWeatherData(data.weather_data);
        setCurrentSeason(data.season);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to get recommendations');
      }
    } catch (error) {
      setError('Failed to connect to recommendation service');
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.7) return 'text-green-600';
    if (probability >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCropName = (crop: string) => {
    return crop.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">{t.aiRecommendation.title}</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t.aiRecommendation.description}
        </p>
      </div>

      {/* API Status */}
      {apiStatus === 'error' && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            Unable to connect to the AI recommendation service. Please ensure the Flask API is running on port 5004.
          </AlertDescription>
        </Alert>
      )}

      {/* Location Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t.aiRecommendation.selectLocation}
          </CardTitle>
          <CardDescription>
            {t.aiRecommendation.selectLocationDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.aiRecommendation.state}</label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${t.aiRecommendation.state}`} />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t.aiRecommendation.district}</label>
              <Select 
                value={selectedDistrict} 
                onValueChange={setSelectedDistrict}
                disabled={!selectedState}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${t.aiRecommendation.district}`} />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t.aiRecommendation.seasonAdv}</label>
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${t.aiRecommendation.season}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">{t.aiRecommendation.autoDetect}</SelectItem>
                  <SelectItem value="kharif">🌾 Kharif (Jun-Oct)</SelectItem>
                  <SelectItem value="rabi_early">🌱 Rabi Early (Nov-Dec)</SelectItem>
                  <SelectItem value="rabi_late">🌿 Rabi Late (Jan-Mar)</SelectItem>
                  <SelectItem value="zaid">☀️ Zaid (Apr-Jun)</SelectItem>
                  <SelectItem value="perennial">🌳 Perennial (Year-round)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Emphasize Native Crops</label>
              <button
                type="button"
                onClick={() => setNativeOnly(v => !v)}
                className={`h-10 px-4 rounded-md border text-sm font-medium ${nativeOnly ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {nativeOnly ? 'On' : 'Off'}
              </button>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={getCropRecommendations}
                disabled={!selectedState || !selectedDistrict || loading || apiStatus === 'error'}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.aiRecommendation.analyzing}
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    {t.aiRecommendation.getRecommendations}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Weather and Season Info */}
      {weatherData && currentSeason && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              {t.aiRecommendation.currentConditions} - {selectedDistrict}, {selectedState}
            </CardTitle>
            <CardDescription>
              {t.aiRecommendation.weatherConditions}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">{t.aiRecommendation.currentSeason}</h3>
                <div className="text-2xl font-bold text-blue-700 capitalize">{currentSeason}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-900 mb-2">{t.aiRecommendation.weatherConditions}</h3>
                <div className="space-y-1 text-sm text-green-700">
                  <div>{t.aiRecommendation.temperature}: {weatherData.temperature}°C</div>
                  <div>{t.aiRecommendation.humidity}: {weatherData.humidity}%</div>
                  <div>Wind Speed: {weatherData.wind_speed} km/h</div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-purple-900 mb-2">{t.aiRecommendation.precipitation}</h3>
                <div className="space-y-1 text-sm text-purple-700">
                  <div>Current: {weatherData.precipitation_current}mm</div>
                  <div>Weekly: {weatherData.precipitation_week}mm</div>
                  <div className="text-xs text-gray-500 mt-2">
                    Updated: {new Date(weatherData.fetch_time).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              {t.aiRecommendation.recommendedCrops} for {selectedDistrict}, {selectedState}
            </CardTitle>
            <CardDescription>
              Based on real-time weather, soil conditions, climate patterns, and seasonal analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {formatCropName(rec.crop)}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-sm font-medium ${getProbabilityColor(rec.probability)}`}>
                            {(rec.probability * 100).toFixed(1)}% {t.aiRecommendation.match}
                          </span>
                          <Badge className={getConfidenceColor(rec.confidence)}>
                            {t.aiRecommendation[rec.confidence as keyof typeof t.aiRecommendation] || rec.confidence} {t.aiRecommendation.confidence}
                          </Badge>
                          {'district_native' in rec && (rec as any).district_native && (
                            <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200">Native</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>

                  {/* Seasonal and Weather Info */}
                  <div className="bg-gray-50 rounded-md p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">{t.aiRecommendation.seasonSuitability}</h4>
                        <p className="text-sm text-gray-600">{rec.season_suitable}</p>
                        {rec.suitability_reason && (
                          <div className="mt-2">
                            <p className="text-xs text-green-700 font-medium">{t.aiRecommendation.whyThisCrop}</p>
                            <p className="text-xs text-green-600">{rec.suitability_reason}</p>
                          </div>
                        )}
                      </div>
                      {rec.weather_factors && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">{t.aiRecommendation.currentWeatherFactors}</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>{t.aiRecommendation.temperature}: {rec.weather_factors.temperature}°C</div>
                            <div>{t.aiRecommendation.humidity}: {rec.weather_factors.humidity}%</div>
                            <div>{t.aiRecommendation.rainfallForecast}: {rec.weather_factors.rainfall_forecast}mm</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">{t.aiRecommendation.proTips}</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Consider local market demand and pricing for selected crops</li>
                <li>• Check with local agricultural extension officers for current soil conditions</li>
                <li>• Factor in water availability and irrigation infrastructure</li>
                <li>• Consider crop rotation patterns for soil health</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      {recommendations.length === 0 && !loading && !error && (
        <Card className="text-center py-12">
          <CardContent>
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t.aiRecommendation.readyToStart}
            </h3>
            <p className="text-gray-600 mb-4">
              {t.aiRecommendation.readyToStartDesc}
            </p>
            <div className="text-sm text-gray-500">
              Our model analyzes data from over 12,000 districts across 20 Indian states
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIRecommendation;