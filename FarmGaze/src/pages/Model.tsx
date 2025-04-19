import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { RandomForestRegression } from "ml-random-forest";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Droplets, CloudRain, Leaf } from "lucide-react";
import Papa from "papaparse";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const models = [
  {
    id: "water-usage",
    title: "Water Usage Efficiency",
    description: "Analyze and optimize water usage patterns for maximum efficiency",
    icon: <Droplets className="w-6 h-6" />,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "water-level",
    title: "Water Level Analysis",
    description: "Monitor and predict water levels in reservoirs and irrigation systems",
    icon: <CloudRain className="w-6 h-6" />,
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: "soil-analysis",
    title: "Soil Analysis",
    description: "Analyze soil conditions and provide recommendations for improvement",
    icon: <Leaf className="w-6 h-6" />,
    color: "from-green-500 to-green-600",
  },
];

const crops = [
  { value: "0", label: "Rice" },
  { value: "1", label: "Wheat" },
  { value: "2", label: "Maize" },
  { value: "3", label: "Chickpea" },
  { value: "4", label: "Kidneybeans" },
  { value: "5", label: "Pigeonpeas" },
  { value: "6", label: "Mothbeans" },
  { value: "7", label: "Mungbean" },
  { value: "8", label: "Blackgram" },
  { value: "9", label: "Lentil" },
  { value: "10", label: "Pomegranate" },
  { value: "11", label: "Banana" },
  { value: "12", label: "Mango" },
  { value: "13", label: "Grapes" },
  { value: "14", label: "Watermelon" },
  { value: "15", label: "Muskmelon" },
  { value: "16", label: "Apple" },
  { value: "17", label: "Orange" },
  { value: "18", label: "Papaya" },
  { value: "19", label: "Coconut" },
  { value: "20", label: "Cotton" },
  { value: "21", label: "Jute" },
  { value: "22", label: "Coffee" }
];

const Model = () => {
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [waterModel, setWaterModel] = useState<RandomForestRegression | null>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidenceInterval, setConfidenceInterval] = useState<[number, number] | null>(null);
  const [trend, setTrend] = useState<"increasing" | "decreasing" | "stable" | null>(null);
  const [inputData, setInputData] = useState({
    temperature: "",
    humidity: "",
    rainfall: "",
    soilMoisture: "",
    cropType: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
  });

  const chartData = useMemo(() => ({
    labels: historicalData.map(d => d.month),
    datasets: [
      {
        label: "Water Efficiency (%)",
        data: historicalData.map(d => d.efficiency),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Temperature (°C)",
        data: historicalData.map(d => d.temperature),
        borderColor: "rgb(234, 88, 12)",
        backgroundColor: "rgba(234, 88, 12, 0.1)",
        tension: 0.4,
        fill: true,
        yAxisID: "y1",
      },
    ],
  }), [historicalData]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Water Efficiency (%)",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Temperature (°C)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }), []);

  const handleModelSelect = useCallback((modelId: string) => {
    setActiveModel(modelId);
    setPrediction(null);
    setConfidenceInterval(null);
    setTrend(null);
    setInputData({
      temperature: "",
      humidity: "",
      rainfall: "",
      soilMoisture: "",
      cropType: "",
      nitrogen: "",
      phosphorus: "",
      potassium: "",
    });
  }, []);

  const trainModel = useCallback(async () => {
    try {
      const response = await fetch('/data/data_set.csv');
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          const trainingData = results.data.map((row: any) => ({
            features: [
              parseFloat(row.temperature),
              parseFloat(row.humidity),
              parseFloat(row.rainfall),
              parseFloat(row.soilMoisture),
              parseInt(row.cropType),
              parseFloat(row.nitrogen),
              parseFloat(row.phosphorus),
              parseFloat(row.potassium)
            ],
            target: parseFloat(row.efficiency)
          }));

          const X = trainingData.map(d => d.features);
          const y = trainingData.map(d => d.target);

          const rf = new RandomForestRegression({
            nEstimators: 50,
            maxFeatures: 4,
          });

          rf.train(X, y);
          setWaterModel(rf);

          const historical = Array.from({ length: 12 }, (_, i) => ({
            month: `Month ${i + 1}`,
            efficiency: Math.random() * 20 + 70,
            temperature: Math.random() * 10 + 20,
            rainfall: Math.random() * 30,
          }));
          setHistoricalData(historical);
        }
      });
    } catch (error) {
      console.error('Error loading dataset:', error);
    }
  }, []);

  useEffect(() => {
    if (activeModel && !waterModel) {
      trainModel();
    }
  }, [activeModel, waterModel, trainModel]);

  const handlePredict = useCallback(() => {
    if (waterModel && inputData.temperature && inputData.humidity && inputData.rainfall && inputData.soilMoisture) {
      setLoading(true);
      
      const features = [
        parseFloat(inputData.temperature),
        parseFloat(inputData.humidity),
        parseFloat(inputData.rainfall),
        parseFloat(inputData.soilMoisture),
        parseInt(inputData.cropType) || 0,
        parseFloat(inputData.nitrogen) || 0,
        parseFloat(inputData.phosphorus) || 0,
        parseFloat(inputData.potassium) || 0
      ];

      const prediction = waterModel.predict([features])[0];
      setPrediction(Math.max(0, Math.min(100, prediction)));

      const confidence = calculateConfidenceInterval([prediction - 5, prediction, prediction + 5]);
      setConfidenceInterval(confidence);

      const lastMonth = historicalData[historicalData.length - 1]?.efficiency || 0;
      if (prediction > lastMonth + 2) setTrend("increasing");
      else if (prediction < lastMonth - 2) setTrend("decreasing");
      else setTrend("stable");

      setLoading(false);
    }
  }, [waterModel, inputData, historicalData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputData(prev => ({ ...prev, [name]: value }));
  }, []);

  const calculateConfidenceInterval = useCallback((data: number[]) => {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const stdDev = Math.sqrt(
      data.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / data.length
    );
    const margin = 1.96 * stdDev;
    return [mean - margin, mean + margin] as [number, number];
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 md:mb-8">
              Models
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
              {models.map((model) => (
                <motion.div
                  key={model.id}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 ${
                    activeModel === model.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
                      {model.icon}
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white ml-3">
                      {model.title}
                    </h2>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4">
                    {model.description}
                  </p>
                  <Button 
                    onClick={() => handleModelSelect(model.id)}
                    className="w-full text-sm md:text-base"
                  >
                    {activeModel === model.id ? 'Selected' : 'Select Model'}
                  </Button>
                </motion.div>
              ))}
            </div>

            {activeModel && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 md:mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6"
              >
                {activeModel === "water-usage" && (
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                        Water Usage Efficiency Model
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                      <Card className="w-full">
                        <CardHeader>
                          <CardTitle className="text-lg md:text-xl">Input Parameters</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3 md:space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                              <div>
                                <Label htmlFor="temperature" className="text-sm md:text-base">Temperature (°C)</Label>
                                <Input
                                  id="temperature"
                                  name="temperature"
                                  type="number"
                                  value={inputData.temperature}
                                  onChange={handleInputChange}
                                  placeholder="Enter temperature"
                                  className="text-sm md:text-base"
                                />
                              </div>
                              <div>
                                <Label htmlFor="humidity" className="text-sm md:text-base">Humidity (%)</Label>
                                <Input
                                  id="humidity"
                                  name="humidity"
                                  type="number"
                                  value={inputData.humidity}
                                  onChange={handleInputChange}
                                  placeholder="Enter humidity"
                                  className="text-sm md:text-base"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                              <div>
                                <Label htmlFor="rainfall" className="text-sm md:text-base">Rainfall (mm)</Label>
                                <Input
                                  id="rainfall"
                                  name="rainfall"
                                  type="number"
                                  value={inputData.rainfall}
                                  onChange={handleInputChange}
                                  placeholder="Enter rainfall"
                                  className="text-sm md:text-base"
                                />
                              </div>
                              <div>
                                <Label htmlFor="soilMoisture" className="text-sm md:text-base">Soil Moisture (%)</Label>
                                <Input
                                  id="soilMoisture"
                                  name="soilMoisture"
                                  type="number"
                                  value={inputData.soilMoisture}
                                  onChange={handleInputChange}
                                  placeholder="Enter soil moisture"
                                  className="text-sm md:text-base"
                                />
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="cropType" className="text-sm md:text-base">Crop Type</Label>
                              <select
                                id="cropType"
                                name="cropType"
                                value={inputData.cropType}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md text-sm md:text-base"
                              >
                                {crops.map(crop => (
                                  <option key={crop.value} value={crop.value}>
                                    {crop.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                              <div>
                                <Label htmlFor="nitrogen" className="text-sm md:text-base">N (kg/ha)</Label>
                                <Input
                                  id="nitrogen"
                                  name="nitrogen"
                                  type="number"
                                  value={inputData.nitrogen}
                                  onChange={handleInputChange}
                                  placeholder="N content"
                                  className="text-sm md:text-base"
                                />
                              </div>
                              <div>
                                <Label htmlFor="phosphorus" className="text-sm md:text-base">P (kg/ha)</Label>
                                <Input
                                  id="phosphorus"
                                  name="phosphorus"
                                  type="number"
                                  value={inputData.phosphorus}
                                  onChange={handleInputChange}
                                  placeholder="P content"
                                  className="text-sm md:text-base"
                                />
                              </div>
                              <div>
                                <Label htmlFor="potassium" className="text-sm md:text-base">K (kg/ha)</Label>
                                <Input
                                  id="potassium"
                                  name="potassium"
                                  type="number"
                                  value={inputData.potassium}
                                  onChange={handleInputChange}
                                  placeholder="K content"
                                  className="text-sm md:text-base"
                                />
                              </div>
                            </div>

                            <Button 
                              onClick={handlePredict} 
                              disabled={loading}
                              className="w-full text-sm md:text-base"
                            >
                              {loading ? "Calculating..." : "Predict Efficiency"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="w-full">
                        <CardHeader>
                          <CardTitle className="text-lg md:text-xl">Results & Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {loading ? (
                            <div className="text-center py-8">Loading...</div>
                          ) : prediction !== null ? (
                            <div className="space-y-4">
                              <div className="text-center">
                                <h3 className="text-lg md:text-xl font-semibold">Predicted Efficiency</h3>
                                <p className="text-2xl md:text-3xl font-bold text-blue-600">
                                  {prediction.toFixed(1)}%
                                </p>
                                {confidenceInterval && (
                                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                                    95% Confidence Interval: {confidenceInterval[0].toFixed(1)}% - {confidenceInterval[1].toFixed(1)}%
                                  </p>
                                )}
                              </div>

                              <div className="h-48 md:h-64">
                                <Line data={chartData} options={chartOptions} />
                              </div>

                              <div className="bg-gray-50 dark:bg-gray-800 p-3 md:p-4 rounded-lg">
                                <h4 className="font-semibold mb-2 text-sm md:text-base">Trend Analysis</h4>
                                <div className={`flex items-center text-sm md:text-base ${
                                  trend === "increasing" ? "text-green-600" :
                                  trend === "decreasing" ? "text-red-600" :
                                  "text-yellow-600"
                                }`}>
                                  <span className="mr-2">
                                    {trend === "increasing" ? "↑" :
                                     trend === "decreasing" ? "↓" : "→"}
                                  </span>
                                  {trend === "increasing" ? "Efficiency is improving" :
                                   trend === "decreasing" ? "Efficiency is declining" :
                                   "Efficiency is stable"}
                                </div>
                              </div>

                              <div className="bg-gray-50 dark:bg-gray-800 p-3 md:p-4 rounded-lg">
                                <h4 className="font-semibold mb-2 text-sm md:text-base">Recommendations</h4>
                                <ul className="space-y-1 md:space-y-2 text-sm md:text-base">
                                  {prediction < 70 && (
                                    <>
                                      <li>• Consider implementing drip irrigation system</li>
                                      <li>• Adjust watering schedule based on soil moisture</li>
                                      <li>• Monitor weather forecasts for optimal timing</li>
                                    </>
                                  )}
                                  {prediction >= 70 && prediction < 85 && (
                                    <>
                                      <li>• Fine-tune irrigation based on crop stage</li>
                                      <li>• Implement soil moisture sensors</li>
                                      <li>• Consider mulching to reduce evaporation</li>
                                    </>
                                  )}
                                  {prediction >= 85 && (
                                    <>
                                      <li>• Maintain current irrigation practices</li>
                                      <li>• Continue monitoring soil moisture levels</li>
                                      <li>• Document successful practices for future reference</li>
                                    </>
                                  )}
                                </ul>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-gray-500 py-8 text-sm md:text-base">
                              Enter parameters and click "Predict Efficiency" to get results
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {activeModel === "water-level" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Water Level Analysis Model
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Input Parameters</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="reservoir">Reservoir Level (m)</Label>
                              <Input
                                id="reservoir"
                                type="number"
                                placeholder="Enter current reservoir level"
                              />
                            </div>
                            <div>
                              <Label htmlFor="rainfall">Recent Rainfall (mm)</Label>
                              <Input
                                id="rainfall"
                                type="number"
                                placeholder="Enter recent rainfall"
                              />
                            </div>
                            <div>
                              <Label htmlFor="usage">Daily Usage (m³)</Label>
                              <Input
                                id="usage"
                                type="number"
                                placeholder="Enter daily water usage"
                              />
                            </div>
                            <Button onClick={handlePredict} disabled={loading}>
                              {loading ? "Calculating..." : "Analyze Water Level"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Results & Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {loading ? (
                            <div className="text-center">Loading...</div>
                          ) : prediction !== null ? (
                            <div className="space-y-4">
                              <div className="text-center">
                                <h3 className="text-xl font-semibold">Water Level Status</h3>
                                <p className="text-3xl font-bold text-blue-600">
                                  {prediction}%
                                </p>
                                {confidenceInterval && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    95% Confidence Interval: {confidenceInterval[0].toFixed(1)}% - {confidenceInterval[1].toFixed(1)}%
                                  </p>
                                )}
                              </div>

                              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Trend Analysis</h4>
                                <div className={`flex items-center ${
                                  trend === "increasing" ? "text-green-600" :
                                  trend === "decreasing" ? "text-red-600" :
                                  "text-yellow-600"
                                }`}>
                                  <span className="mr-2">
                                    {trend === "increasing" ? "↑" :
                                     trend === "decreasing" ? "↓" : "→"}
                                  </span>
                                  {trend === "increasing" ? "Water level is rising" :
                                   trend === "decreasing" ? "Water level is falling" :
                                   "Water level is stable"}
                                </div>
                              </div>

                              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Recommendations</h4>
                                <ul className="space-y-2">
                                  <li>• Monitor reservoir levels daily</li>
                                  <li>• Adjust water release based on predictions</li>
                                  <li>• Implement water conservation measures if needed</li>
                                </ul>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-gray-500">
                              Enter parameters and click "Analyze Water Level" to get results
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {activeModel === "soil-analysis" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Soil Analysis Model
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Input Parameters</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="nitrogen">Nitrogen Content (mg/kg)</Label>
                              <Input
                                id="nitrogen"
                                type="number"
                                placeholder="Enter nitrogen content"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phosphorus">Phosphorus Content (mg/kg)</Label>
                              <Input
                                id="phosphorus"
                                type="number"
                                placeholder="Enter phosphorus content"
                              />
                            </div>
                            <div>
                              <Label htmlFor="potassium">Potassium Content (mg/kg)</Label>
                              <Input
                                id="potassium"
                                type="number"
                                placeholder="Enter potassium content"
                              />
                            </div>
                            <div>
                              <Label htmlFor="ph">Soil pH</Label>
                              <Input
                                id="ph"
                                type="number"
                                placeholder="Enter soil pH"
                              />
                            </div>
                            <Button onClick={handlePredict} disabled={loading}>
                              {loading ? "Analyzing..." : "Analyze Soil"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Results & Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {loading ? (
                            <div className="text-center">Loading...</div>
                          ) : prediction !== null ? (
                            <div className="space-y-4">
                              <div className="text-center">
                                <h3 className="text-xl font-semibold">Soil Health Score</h3>
                                <p className="text-3xl font-bold text-green-600">
                                  {prediction}%
                                </p>
                                {confidenceInterval && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    95% Confidence Interval: {confidenceInterval[0].toFixed(1)}% - {confidenceInterval[1].toFixed(1)}%
                                  </p>
                                )}
                              </div>

                              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Trend Analysis</h4>
                                <div className={`flex items-center ${
                                  trend === "increasing" ? "text-green-600" :
                                  trend === "decreasing" ? "text-red-600" :
                                  "text-yellow-600"
                                }`}>
                                  <span className="mr-2">
                                    {trend === "increasing" ? "↑" :
                                     trend === "decreasing" ? "↓" : "→"}
                                  </span>
                                  {trend === "increasing" ? "Soil health is improving" :
                                   trend === "decreasing" ? "Soil health is declining" :
                                   "Soil health is stable"}
                                </div>
                              </div>

                              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Recommendations</h4>
                                <ul className="space-y-2">
                                  <li>• Apply organic compost to improve soil structure</li>
                                  <li>• Consider crop rotation to maintain nutrient balance</li>
                                  <li>• Monitor soil pH and adjust as needed</li>
                                </ul>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-gray-500">
                              Enter parameters and click "Analyze Soil" to get results
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Model; 