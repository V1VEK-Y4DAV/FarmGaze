import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Droplets, Leaf, ChevronRight, Crop, Calendar, Thermometer, CloudRain, Wind, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "chart.js";
import { RandomForestRegression } from "ml-random-forest";
import { useState, useEffect } from "react";
import Papa from 'papaparse';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Predictions = () => {
  const [showCropPrediction, setShowCropPrediction] = useState(false);
  const [showIrrigationSchedule, setShowIrrigationSchedule] = useState(false);
  const [model, setModel] = useState<RandomForestRegression | null>(null);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [inputData, setInputData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    rainfall: "",
    temperature: "",
    humidity: "",
    soilType: "loamy", // default value
  });
  const [irrigationData, setIrrigationData] = useState({
    crop: "",
    area: "",
    soilMoisture: "",
    weather: "sunny",
    growthStage: "vegetative"
  });
  const [irrigationSchedule, setIrrigationSchedule] = useState<any>(null);

  // List of crops with their irrigation requirements
  const crops = [
    { name: "Rice", stages: ["Seedling", "Vegetative", "Reproductive", "Ripening"] },
    { name: "Wheat", stages: ["Germination", "Tillering", "Stem Extension", "Heading", "Ripening"] },
    { name: "Maize", stages: ["Germination", "Vegetative", "Tasseling", "Silking", "Maturity"] },
    { name: "Soybean", stages: ["Germination", "Vegetative", "Flowering", "Pod Development", "Maturity"] },
    { name: "Cotton", stages: ["Germination", "Vegetative", "Square Formation", "Flowering", "Boll Development"] },
    { name: "Potato", stages: ["Planting", "Vegetative", "Tuber Initiation", "Tuber Bulking", "Maturity"] },
    { name: "Tomato", stages: ["Germination", "Vegetative", "Flowering", "Fruit Development", "Maturity"] },
    { name: "Sugarcane", stages: ["Germination", "Tillering", "Grand Growth", "Maturity"] },
    { name: "Barley", stages: ["Germination", "Tillering", "Stem Extension", "Heading", "Ripening"] },
    { name: "Millet", stages: ["Germination", "Vegetative", "Flowering", "Grain Filling", "Maturity"] },
    { name: "Chickpea", stages: ["Germination", "Vegetative", "Flowering", "Pod Development", "Maturity"] },
    { name: "Kidneybeans", stages: ["Germination", "Vegetative", "Flowering", "Pod Development", "Maturity"] },
    { name: "Pigeonpeas", stages: ["Germination", "Vegetative", "Flowering", "Pod Development", "Maturity"] },
    { name: "Mothbeans", stages: ["Germination", "Vegetative", "Flowering", "Pod Development", "Maturity"] },
    { name: "Mungbean", stages: ["Germination", "Vegetative", "Flowering", "Pod Development", "Maturity"] },
    { name: "Blackgram", stages: ["Germination", "Vegetative", "Flowering", "Pod Development", "Maturity"] },
    { name: "Lentil", stages: ["Germination", "Vegetative", "Flowering", "Pod Development", "Maturity"] },
    { name: "Pomegranate", stages: ["Dormant", "Bud Break", "Flowering", "Fruit Development", "Harvest"] },
    { name: "Banana", stages: ["Planting", "Vegetative", "Flowering", "Fruit Development", "Harvest"] },
    { name: "Mango", stages: ["Dormant", "Flowering", "Fruit Set", "Fruit Development", "Harvest"] },
    { name: "Grapes", stages: ["Dormant", "Bud Break", "Flowering", "Fruit Development", "Harvest"] },
    { name: "Coffee", stages: ["Germination", "Vegetative", "Flowering", "Fruit Development", "Harvest"] }
  ];

  useEffect(() => {
    if (showCropPrediction) {
      // Load and parse the dataset
      Papa.parse('/data/data_set.csv', {
        download: true,
        header: true,
        complete: (results) => {
          const data = results.data;
          
          // Prepare training data
          const trainingData = data.map((row: any) => {
            const features = [
              parseFloat(row.N),
              parseFloat(row.P),
              parseFloat(row.K),
              parseFloat(row.rainfall),
              parseFloat(row.temperature),
              parseFloat(row.humidity),
              parseInt(row.soil_type) - 1, // Convert to 0-based index
            ];
            const target = crops.find(c => c.name.toLowerCase() === row.label.toLowerCase())?.name || "Unknown";
            return { features, target };
          });

          const X = trainingData.map((d) => d.features);
          const y = trainingData.map((d) => d.target);

          const rf = new RandomForestRegression({
            nEstimators: 100,
          });

          rf.train(X, y);
          setModel(rf);
          setLoading(false);
        },
        error: (error) => {
          console.error('Error loading dataset:', error);
          setLoading(false);
        }
      });
    }
  }, [showCropPrediction]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = () => {
    if (model) {
      const soilTypeMap = {
        sandy: 0,
        loamy: 1,
        clayey: 2,
      };

      const features = [
        parseFloat(inputData.nitrogen),
        parseFloat(inputData.phosphorus),
        parseFloat(inputData.potassium),
        parseFloat(inputData.rainfall),
        parseFloat(inputData.temperature),
        parseFloat(inputData.humidity),
        soilTypeMap[inputData.soilType as keyof typeof soilTypeMap],
      ];

      const prediction = model.predict([features])[0];
      const cropIndex = Math.round(prediction);
      const confidence = 1 - Math.abs(prediction - cropIndex);
      
      setPrediction(crops[cropIndex].name.charAt(0).toUpperCase() + crops[cropIndex].name.slice(1));
      setConfidence(confidence * 100);
    }
  };

  const handleIrrigationInputChange = (name: string, value: string) => {
    setIrrigationData(prev => ({ ...prev, [name]: value }));
  };

  const calculateIrrigationSchedule = () => {
    if (!irrigationData.crop || !irrigationData.area || !irrigationData.soilMoisture) {
      return;
    }

    const selectedCrop = crops.find(c => c.name === irrigationData.crop);
    if (!selectedCrop) return;

    // Enhanced base irrigation requirements with growth stage factors
    const baseRequirements = {
      "Rice": { 
        base: { frequency: 3, duration: 30, amount: 25 },
        growthFactors: {
          "seedling": 1.2,
          "vegetative": 1.0,
          "reproductive": 1.3,
          "ripening": 0.8
        }
      },
      "Wheat": { 
        base: { frequency: 5, duration: 20, amount: 15 },
        growthFactors: {
          "germination": 1.1,
          "tillering": 1.2,
          "stem extension": 1.3,
          "heading": 1.4,
          "ripening": 0.7
        }
      },
      "Maize": { 
        base: { frequency: 4, duration: 25, amount: 20 },
        growthFactors: {
          "germination": 1.1,
          "vegetative": 1.0,
          "tasseling": 1.2,
          "silking": 1.3,
          "maturity": 0.9
        }
      },
      "Soybean": { 
        base: { frequency: 5, duration: 20, amount: 15 },
        growthFactors: {
          "germination": 1.1,
          "vegetative": 1.0,
          "flowering": 1.2,
          "pod development": 1.3,
          "maturity": 0.9
        }
      },
      "Cotton": { 
        base: { frequency: 4, duration: 25, amount: 20 },
        growthFactors: {
          "germination": 1.1,
          "vegetative": 1.0,
          "square formation": 1.2,
          "flowering": 1.3,
          "boll development": 1.4
        }
      },
      "Potato": { 
        base: { frequency: 4, duration: 25, amount: 20 },
        growthFactors: {
          "planting": 1.1,
          "vegetative": 1.0,
          "tuber initiation": 1.2,
          "tuber bulking": 1.3,
          "maturity": 0.9
        }
      },
      "Tomato": { 
        base: { frequency: 3, duration: 30, amount: 25 },
        growthFactors: {
          "germination": 1.1,
          "vegetative": 1.0,
          "flowering": 1.2,
          "fruit development": 1.3,
          "maturity": 0.9
        }
      },
      "Sugarcane": { 
        base: { frequency: 4, duration: 25, amount: 20 },
        growthFactors: {
          "germination": 1.1,
          "tillering": 1.2,
          "grand growth": 1.3,
          "maturity": 0.9
        }
      },
      "Barley": { 
        base: { frequency: 5, duration: 20, amount: 15 },
        growthFactors: {
          "germination": 1.1,
          "tillering": 1.2,
          "stem extension": 1.3,
          "heading": 1.4,
          "ripening": 0.7
        }
      },
      "Millet": { 
        base: { frequency: 5, duration: 20, amount: 15 },
        growthFactors: {
          "germination": 1.1,
          "vegetative": 1.0,
          "flowering": 1.2,
          "grain filling": 1.3,
          "maturity": 0.9
        }
      },
      "Chickpea": { 
        base: { frequency: 5, duration: 20, amount: 15 },
        growthFactors: {
          "germination": 1.1,
          "vegetative": 1.0,
          "flowering": 1.2,
          "pod development": 1.3,
          "maturity": 0.9
        }
      },
      "Kidneybeans": { 
        base: { frequency: 5, duration: 20, amount: 15 },
        growthFactors: {
          "germination": 1.1,
          "vegetative": 1.0,
          "flowering": 1.2,
          "pod development": 1.3,
          "maturity": 0.9
        }
      },
      "Pigeonpeas": { 
        base: { frequency: 5, duration: 20, amount: 15 },
        growthFactors: {
          "germination": 1.1,
          "vegetative": 1.0,
          "flowering": 1.2,
          "pod development": 1.3,
          "maturity": 0.9
        }
      },
      "Mothbeans": { 
        base: { frequency: 5, duration: 20, amount: 15 },
        growthFactors: {
          "germination": 1.1,
          "vegetative": 1.0,
          "flowering": 1.2,
          "pod development": 1.3,
          "maturity": 0.9
        }
      },
      "Mungbean": { 
        base: { frequency: 5, duration: 20, amount: 15 },
        growthFactors: {
          "germination": 1.1,
          "vegetative": 1.0,
          "flowering": 1.2,
          "pod development": 1.3,
          "maturity": 0.9
        }
      },
      "Blackgram": { 
        base: { frequency: 5, duration: 20, amount: 15 },
        growthFactors: {
          "germination": 1.1,
          "vegetative": 1.0,
          "flowering": 1.2,
          "pod development": 1.3,
          "maturity": 0.9
        }
      },
      "Lentil": { 
        base: { frequency: 5, duration: 20, amount: 15 },
        growthFactors: {
          "germination": 1.1,
          "vegetative": 1.0,
          "flowering": 1.2,
          "pod development": 1.3,
          "maturity": 0.9
        }
      },
      "Pomegranate": { 
        base: { frequency: 7, duration: 40, amount: 30 },
        growthFactors: {
          "dormant": 1.1,
          "bud break": 1.2,
          "flowering": 1.3,
          "fruit development": 1.4,
          "harvest": 0.9
        }
      },
      "Banana": { 
        base: { frequency: 3, duration: 35, amount: 30 },
        growthFactors: {
          "planting": 1.1,
          "vegetative": 1.0,
          "flowering": 1.2,
          "fruit development": 1.3,
          "harvest": 0.9
        }
      },
      "Mango": { 
        base: { frequency: 7, duration: 40, amount: 30 },
        growthFactors: {
          "dormant": 1.1,
          "flowering": 1.2,
          "fruit set": 1.3,
          "fruit development": 1.4,
          "harvest": 0.9
        }
      },
      "Grapes": { 
        base: { frequency: 7, duration: 40, amount: 30 },
        growthFactors: {
          "dormant": 1.1,
          "bud break": 1.2,
          "flowering": 1.3,
          "fruit development": 1.4,
          "harvest": 0.9
        }
      },
      "Coffee": { 
        base: { frequency: 7, duration: 40, amount: 30 },
        growthFactors: {
          "germination": 1.1,
          "vegetative": 1.0,
          "flowering": 1.2,
          "fruit development": 1.3,
          "harvest": 0.9
        }
      }
    };

    // Get base requirements for the selected crop
    const cropRequirements = baseRequirements[irrigationData.crop as keyof typeof baseRequirements];
    const growthFactor = cropRequirements.growthFactors[irrigationData.growthStage as keyof typeof cropRequirements.growthFactors] || 1.0;

    // Enhanced soil moisture calculation
    const soilMoisture = parseFloat(irrigationData.soilMoisture);
    const soilMoistureFactor = soilMoisture < 30 ? 1.5 : 
                              soilMoisture < 50 ? 1.2 : 
                              soilMoisture < 70 ? 1.0 : 0.8;

    // Enhanced weather factor calculation
    const weatherFactor = irrigationData.weather === "sunny" ? 1.3 : 
                         irrigationData.weather === "cloudy" ? 1.0 : 0.7;

    // Calculate area factor (non-linear scaling for larger areas)
    const area = parseFloat(irrigationData.area);
    const areaFactor = area < 1 ? 1.0 : 
                      area < 5 ? 0.9 : 
                      area < 10 ? 0.8 : 0.7;

    // Calculate final irrigation parameters with enhanced accuracy
    const base = cropRequirements.base;
    const adjustedFrequency = Math.round(base.frequency * soilMoistureFactor * weatherFactor * (1 / growthFactor));
    const adjustedDuration = Math.round(base.duration * (1 / soilMoistureFactor) * weatherFactor * growthFactor);
    const adjustedAmount = Math.round(base.amount * soilMoistureFactor * weatherFactor * growthFactor * area * areaFactor);

    // Calculate confidence score based on input quality
    const confidenceScore = calculateConfidenceScore(soilMoisture, area, irrigationData.weather);

    // Generate detailed recommendations
    const recommendations = [
      `Irrigate every ${adjustedFrequency} days`,
      `Duration: ${adjustedDuration} minutes per session`,
      `Water amount: ${adjustedAmount} liters per session`,
      `Next irrigation: ${new Date(Date.now() + adjustedFrequency * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
      `Current growth stage: ${irrigationData.growthStage}`,
      `Weather condition: ${irrigationData.weather}`,
      `Model confidence: ${confidenceScore}%`
    ];

    // Add specific recommendations based on conditions
    if (soilMoisture < 30) {
      recommendations.push("⚠️ Soil moisture is critically low. Consider immediate irrigation.");
    } else if (soilMoisture > 70) {
      recommendations.push("⚠️ Soil moisture is high. Consider reducing irrigation frequency.");
    }

    if (irrigationData.weather === "sunny") {
      recommendations.push("☀️ High evaporation expected. Monitor soil moisture closely.");
    } else if (irrigationData.weather === "rainy") {
      recommendations.push("🌧️ Rainfall may reduce irrigation needs. Monitor soil moisture.");
    }

    setIrrigationSchedule({
      frequency: adjustedFrequency,
      duration: adjustedDuration,
      amount: adjustedAmount,
      nextIrrigation: new Date(Date.now() + adjustedFrequency * 24 * 60 * 60 * 1000).toLocaleDateString(),
      recommendations,
      confidence: confidenceScore
    });
  };

  const calculateConfidenceScore = (soilMoisture: number, area: number, weather: string) => {
    let score = 100;

    // Soil moisture confidence
    if (soilMoisture < 20 || soilMoisture > 80) score -= 20;
    else if (soilMoisture < 30 || soilMoisture > 70) score -= 10;

    // Area confidence
    if (area > 20) score -= 15;
    else if (area > 10) score -= 10;
    else if (area > 5) score -= 5;

    // Weather confidence
    if (weather === "rainy") score -= 5;

    return Math.max(60, score); // Minimum confidence of 60%
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
              Predictions
            </h1>
            
            {!showCropPrediction && !showIrrigationSchedule ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-center mb-4">
                    <Leaf className="h-8 w-8 text-green-500 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Crop Prediction
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Predict the most suitable crop type based on soil conditions, climate data, and historical patterns.
                  </p>
                  <Button 
                    onClick={() => setShowCropPrediction(true)}
                    className="w-full"
                  >
                    Open Crop Prediction
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-center mb-4">
                    <Droplets className="h-8 w-8 text-blue-500 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Irrigation Schedule
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Get optimized irrigation schedules based on crop type, area, soil moisture, and weather conditions.
                  </p>
                  <Button 
                    onClick={() => setShowIrrigationSchedule(true)}
                    className="w-full"
                  >
                    Open Irrigation Schedule
                  </Button>
                </motion.div>
              </div>
            ) : showIrrigationSchedule ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Irrigation Parameters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="crop">Select Crop</Label>
                        <Select
                          value={irrigationData.crop}
                          onValueChange={(value) => handleIrrigationInputChange("crop", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a crop" />
                          </SelectTrigger>
                          <SelectContent>
                            {crops.map((crop) => (
                              <SelectItem key={crop.name} value={crop.name}>
                                {crop.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {irrigationData.crop && (
                        <div>
                          <Label htmlFor="growthStage">Growth Stage</Label>
                          <Select
                            value={irrigationData.growthStage}
                            onValueChange={(value) => handleIrrigationInputChange("growthStage", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select growth stage" />
                            </SelectTrigger>
                            <SelectContent>
                              {crops.find(c => c.name === irrigationData.crop)?.stages.map((stage) => (
                                <SelectItem key={stage} value={stage.toLowerCase()}>
                                  {stage}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="area">Area (hectares)</Label>
                        <Input
                          id="area"
                          type="number"
                          value={irrigationData.area}
                          onChange={(e) => handleIrrigationInputChange("area", e.target.value)}
                          placeholder="Enter area in hectares"
                        />
                      </div>

                      <div>
                        <Label htmlFor="soilMoisture">Soil Moisture (%)</Label>
                        <Input
                          id="soilMoisture"
                          type="number"
                          value={irrigationData.soilMoisture}
                          onChange={(e) => handleIrrigationInputChange("soilMoisture", e.target.value)}
                          placeholder="Enter soil moisture percentage"
                        />
                      </div>

                      <div>
                        <Label htmlFor="weather">Weather Condition</Label>
                        <Select
                          value={irrigationData.weather}
                          onValueChange={(value) => handleIrrigationInputChange("weather", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select weather condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sunny">Sunny</SelectItem>
                            <SelectItem value="cloudy">Cloudy</SelectItem>
                            <SelectItem value="rainy">Rainy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-4">
                        <Button 
                          onClick={calculateIrrigationSchedule}
                          className="flex-1"
                          disabled={!irrigationData.crop || !irrigationData.area || !irrigationData.soilMoisture}
                        >
                          Calculate Schedule
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowIrrigationSchedule(false)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Irrigation Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {irrigationSchedule ? (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-semibold">Recommended Schedule</h3>
                          <p className="text-3xl font-bold text-blue-600">
                            {irrigationSchedule.frequency} days interval
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            Model Confidence: {irrigationSchedule.confidence}%
                          </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Detailed Recommendations</h4>
                          <ul className="space-y-2">
                            {irrigationSchedule.recommendations.map((rec: string, index: number) => (
                              <li key={index} className="flex items-center">
                                <span className="mr-2">•</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Water Requirements</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Duration per Session</p>
                              <p className="text-lg font-semibold">
                                {irrigationSchedule.duration} minutes
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Water Amount</p>
                              <p className="text-lg font-semibold">
                                {irrigationSchedule.amount} liters
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Accuracy Factors</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Soil Moisture Quality:</span>
                              <span>{irrigationSchedule.confidence >= 90 ? "High" : irrigationSchedule.confidence >= 70 ? "Medium" : "Low"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Weather Impact:</span>
                              <span>{irrigationData.weather === "sunny" ? "High" : irrigationData.weather === "cloudy" ? "Medium" : "Low"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Growth Stage Accuracy:</span>
                              <span>High</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        Enter the required parameters and click "Calculate Schedule" to get recommendations
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Input Parameters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="nitrogen">Nitrogen (N) Content (mg/kg)</Label>
                        <Input
                          id="nitrogen"
                          name="nitrogen"
                          type="number"
                          value={inputData.nitrogen}
                          onChange={handleInputChange}
                          placeholder="Enter nitrogen content"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phosphorus">Phosphorus (P) Content (mg/kg)</Label>
                        <Input
                          id="phosphorus"
                          name="phosphorus"
                          type="number"
                          value={inputData.phosphorus}
                          onChange={handleInputChange}
                          placeholder="Enter phosphorus content"
                        />
                      </div>
                      <div>
                        <Label htmlFor="potassium">Potassium (K) Content (mg/kg)</Label>
                        <Input
                          id="potassium"
                          name="potassium"
                          type="number"
                          value={inputData.potassium}
                          onChange={handleInputChange}
                          placeholder="Enter potassium content"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rainfall">Annual Rainfall (mm)</Label>
                        <Input
                          id="rainfall"
                          name="rainfall"
                          type="number"
                          value={inputData.rainfall}
                          onChange={handleInputChange}
                          placeholder="Enter annual rainfall"
                        />
                      </div>
                      <div>
                        <Label htmlFor="temperature">Average Temperature (°C)</Label>
                        <Input
                          id="temperature"
                          name="temperature"
                          type="number"
                          value={inputData.temperature}
                          onChange={handleInputChange}
                          placeholder="Enter average temperature"
                        />
                      </div>
                      <div>
                        <Label htmlFor="humidity">Average Humidity (%)</Label>
                        <Input
                          id="humidity"
                          name="humidity"
                          type="number"
                          value={inputData.humidity}
                          onChange={handleInputChange}
                          placeholder="Enter average humidity"
                        />
                      </div>
                      <div>
                        <Label htmlFor="soilType">Soil Type</Label>
                        <select
                          id="soilType"
                          name="soilType"
                          value={inputData.soilType}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="sandy">Sandy</option>
                          <option value="loamy">Loamy</option>
                          <option value="clayey">Clayey</option>
                        </select>
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={handlePredict} disabled={loading} className="flex-1">
                          {loading ? "Loading Model..." : "Predict Best Crop"}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setShowCropPrediction(false)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Results & Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center">Loading model and data...</div>
                    ) : (
                      <div className="space-y-6">
                        {prediction !== null && (
                          <div className="space-y-4">
                            <div className="text-center">
                              <h3 className="text-xl font-semibold">Recommended Crop</h3>
                              <p className="text-3xl font-bold text-green-600">
                                {prediction}
                              </p>
                              {confidence !== null && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Prediction Confidence: {confidence.toFixed(2)}%
                                </p>
                              )}
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2">Crop Requirements</h4>
                              <ul className="space-y-2">
                                <li>🌡️ Temperature Range: {Math.round(parseFloat(inputData.temperature) - 5)}°C - {Math.round(parseFloat(inputData.temperature) + 5)}°C</li>
                                <li>💧 Rainfall: {Math.round(parseFloat(inputData.rainfall) * 0.8)}mm - {Math.round(parseFloat(inputData.rainfall) * 1.2)}mm</li>
                                <li>🌱 Soil Type: {inputData.soilType.charAt(0).toUpperCase() + inputData.soilType.slice(1)}</li>
                              </ul>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2">Nutrient Analysis</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                  <p className="text-sm text-gray-600">Nitrogen</p>
                                  <p className="text-lg font-semibold">
                                    {inputData.nitrogen} mg/kg
                                  </p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-gray-600">Phosphorus</p>
                                  <p className="text-lg font-semibold">
                                    {inputData.phosphorus} mg/kg
                                  </p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-gray-600">Potassium</p>
                                  <p className="text-lg font-semibold">
                                    {inputData.potassium} mg/kg
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Predictions; 