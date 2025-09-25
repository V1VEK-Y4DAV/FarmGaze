import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import { useState } from "react";
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
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const CropPrediction = () => {
  const [predictions, setPredictions] = useState<{ crop: string; probability: number }[]>([]);
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    rainfall: "",
    soilMoisture: "",
    ph: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCropPredict = () => {
    const features = [
      parseFloat(formData.nitrogen) || 0,
      parseFloat(formData.phosphorus) || 0,
      parseFloat(formData.potassium) || 0,
      parseFloat(formData.temperature) || 0,
      parseFloat(formData.humidity) || 0,
      parseFloat(formData.rainfall) || 0,
      parseFloat(formData.soilMoisture) || 0,
      parseFloat(formData.ph) || 0
    ];

    // Simulated crop prediction based on input features
    const cropPredictions = [
      { crop: "Rice", probability: 0.85 },
      { crop: "Wheat", probability: 0.75 },
      { crop: "Corn", probability: 0.65 }
    ];

    setPredictions(cropPredictions);
  };

  const cropChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Predicted Yield',
        data: [75, 78, 82, 85, 88, 90, 85, 80, 75, 70, 65, 60],
        borderColor: '#4c871e',
        backgroundColor: '#4c871e',
      },
      {
        label: 'Historical Average',
        data: [70, 72, 75, 78, 80, 82, 80, 78, 75, 72, 70, 68],
        borderColor: '#3a6a16',
        backgroundColor: '#3a6a16',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Crop Yield Predictions',
      },
    },
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
              Crop Prediction
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Input Parameters</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="soil-type">Soil Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clay">Clay</SelectItem>
                          <SelectItem value="sandy">Sandy</SelectItem>
                          <SelectItem value="loamy">Loamy</SelectItem>
                          <SelectItem value="silty">Silty</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ph-level">Soil pH Level</Label>
                      <Input id="ph-level" type="number" step="0.1" min="0" max="14" placeholder="Enter pH level" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="temperature">Average Temperature (°C)</Label>
                      <Input id="temperature" type="number" placeholder="Enter temperature" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rainfall">Annual Rainfall (mm)</Label>
                      <Input id="rainfall" type="number" placeholder="Enter rainfall" />
                    </div>

                    <Button type="submit" className="w-full">Get Prediction</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prediction Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Enter your soil and climate data to get crop recommendations.
                    </p>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Recommended Crops:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>No data entered yet</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default CropPrediction; 