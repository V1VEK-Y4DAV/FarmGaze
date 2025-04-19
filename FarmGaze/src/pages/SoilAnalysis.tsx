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

const SoilAnalysis = () => {
  const [model, setModel] = useState<RandomForestRegression | null>(null);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [historicalData, setHistoricalData] = useState<{
    labels: string[];
    values: number[];
  }>({ labels: [], values: [] });

  const [inputData, setInputData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    fertilizerUsage: "",
  });

  useEffect(() => {
    // Simulate loading and training the model
    setTimeout(() => {
      // Generate synthetic training data
      const trainingData = Array.from({ length: 100 }, () => ({
        features: [
          Math.random() * 100, // nitrogen
          Math.random() * 100, // phosphorus
          Math.random() * 100, // potassium
          Math.random() * 10,  // fertilizer usage
        ],
        target: Math.random() * 3 + 4, // pH (range: 4-7)
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
      const values = Array.from({ length: 12 }, () => Math.random() * 3 + 4);
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
        parseFloat(inputData.nitrogen),
        parseFloat(inputData.phosphorus),
        parseFloat(inputData.potassium),
        parseFloat(inputData.fertilizerUsage),
      ];

      const prediction = model.predict([features])[0];
      setPrediction(prediction);
    }
  };

  const chartData = {
    labels: historicalData.labels,
    datasets: [
      {
        label: "Historical Soil pH",
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
        text: "Soil pH Trends",
      },
    },
    scales: {
      y: {
        min: 4,
        max: 7,
        title: {
          display: true,
          text: "pH Level",
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Soil Analysis</h1>
      
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
                />
              </div>
              <div>
                <Label htmlFor="fertilizerUsage">Fertilizer Usage (kg/ha)</Label>
                <Input
                  id="fertilizerUsage"
                  name="fertilizerUsage"
                  type="number"
                  value={inputData.fertilizerUsage}
                  onChange={handleInputChange}
                />
              </div>
              <Button onClick={handlePredict} disabled={loading}>
                {loading ? "Loading Model..." : "Predict Soil pH"}
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
                    <h3 className="text-xl font-semibold">Predicted Soil pH</h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {prediction.toFixed(2)}
                    </p>
                    <div className="mt-2">
                      {prediction < 5.5 && (
                        <p className="text-red-500">Soil is too acidic. Consider adding lime.</p>
                      )}
                      {prediction > 6.5 && (
                        <p className="text-red-500">Soil is too alkaline. Consider adding sulfur.</p>
                      )}
                      {prediction >= 5.5 && prediction <= 6.5 && (
                        <p className="text-green-500">Soil pH is optimal for most crops.</p>
                      )}
                    </div>
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

export default SoilAnalysis; 