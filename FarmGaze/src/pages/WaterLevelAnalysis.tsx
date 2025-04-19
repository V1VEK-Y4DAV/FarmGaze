import { useState, useEffect } from "react";
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
} from "chart.js";
import { RandomForestRegression } from "ml-random-forest";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WaterLevelAnalysis = () => {
  const [model, setModel] = useState<RandomForestRegression | null>(null);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [historicalData, setHistoricalData] = useState<{
    labels: string[];
    values: number[];
  }>({ labels: [], values: [] });

  const [inputData, setInputData] = useState({
    rainfall: "",
    soilMoisture: "",
    temperature: "",
    humidity: "",
    irrigationFrequency: "",
  });

  useEffect(() => {
    // Simulate loading and training the model
    setTimeout(() => {
      // Generate synthetic training data
      const trainingData = Array.from({ length: 100 }, () => ({
        features: [
          Math.random() * 100, // rainfall
          Math.random() * 100, // soil moisture
          Math.random() * 50,  // temperature
          Math.random() * 100, // humidity
          Math.random() * 10,  // irrigation frequency
        ],
        target: Math.random() * 100, // water level
      }));

      const X = trainingData.map((d) => d.features);
      const y = trainingData.map((d) => d.target);

      const rf = new RandomForestRegression({
        nEstimators: 100,
      });

      rf.train(X, y);
      setModel(rf);

      // Generate historical data for the chart
      const labels = Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`);
      const values = Array.from({ length: 12 }, () => Math.random() * 100);
      setHistoricalData({ labels, values });
      setLoading(false);
    }, 2000);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = () => {
    if (model) {
      const features = [
        parseFloat(inputData.rainfall),
        parseFloat(inputData.soilMoisture),
        parseFloat(inputData.temperature),
        parseFloat(inputData.humidity),
        parseFloat(inputData.irrigationFrequency),
      ];

      const prediction = model.predict([features])[0];
      setPrediction(prediction);
    }
  };

  const chartData = {
    labels: historicalData.labels,
    datasets: [
      {
        label: "Historical Water Levels",
        data: historicalData.values,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Water Level Trends",
      },
    },
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Water Level Analysis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rainfall">Rainfall (mm)</Label>
                <Input
                  id="rainfall"
                  name="rainfall"
                  type="number"
                  value={inputData.rainfall}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="soilMoisture">Soil Moisture (%)</Label>
                <Input
                  id="soilMoisture"
                  name="soilMoisture"
                  type="number"
                  value={inputData.soilMoisture}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type="number"
                  value={inputData.temperature}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="humidity">Humidity (%)</Label>
                <Input
                  id="humidity"
                  name="humidity"
                  type="number"
                  value={inputData.humidity}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="irrigationFrequency">Irrigation Frequency (times/week)</Label>
                <Input
                  id="irrigationFrequency"
                  name="irrigationFrequency"
                  type="number"
                  value={inputData.irrigationFrequency}
                  onChange={handleInputChange}
                />
              </div>
              <Button onClick={handlePredict} disabled={loading}>
                {loading ? "Loading Model..." : "Predict Water Level"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center">Loading model and data...</div>
            ) : (
              <div className="space-y-4">
                {prediction !== null && (
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">Predicted Water Level</h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {prediction.toFixed(2)}%
                    </p>
                  </div>
                )}
                <div className="h-64">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WaterLevelAnalysis; 