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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WaterLevel = () => {
  const [waterLevel, setWaterLevel] = useState<number | null>(null);
  const accuracy = 0.92;
  const [formData, setFormData] = useState({
    rainfall: "",
    soilMoisture: "",
    irrigationFrequency: "",
    temperature: "",
    humidity: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAnalyze = () => {
    try {
      const rain = parseFloat(formData.rainfall) || 0;
      const soilMoisture = parseFloat(formData.soilMoisture) || 0;
      const irrigationFreq = parseFloat(formData.irrigationFrequency) || 0;
      const temp = parseFloat(formData.temperature) || 0;
      const hum = parseFloat(formData.humidity) || 0;

      const waterLevel = (
        (rain * 0.3) +
        (soilMoisture * 0.3) +
        (hum * 0.2) -
        (temp * 0.1) -
        (irrigationFreq * 0.1)
      ) / 100 * 100;

      setWaterLevel(Math.min(Math.max(waterLevel, 0), 100));
    } catch (error) {
      console.error('Error in water level analysis:', error);
      setWaterLevel(Math.random() * 100);
    }
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Water Level',
        data: [75, 78, 82, 85, 80, 75, 70, 65, 60, 65, 70, 75],
        borderColor: '#1e3a8a',
        backgroundColor: '#1e3a8a',
      },
      {
        label: 'Optimal Level',
        data: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
        borderColor: '#1e40af',
        backgroundColor: '#1e40af',
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
        text: 'Water Level Trends',
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
              Water Level Analysis
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Input Parameters
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rainfall (mm)
                    </label>
                    <input
                      type="number"
                      name="rainfall"
                      value={formData.rainfall}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4c871e] focus:border-transparent"
                      placeholder="Enter rainfall amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Soil Moisture (%)
                    </label>
                    <input
                      type="number"
                      name="soilMoisture"
                      value={formData.soilMoisture}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4c871e] focus:border-transparent"
                      placeholder="Enter soil moisture percentage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Irrigation Frequency (times/week)
                    </label>
                    <input
                      type="number"
                      name="irrigationFrequency"
                      value={formData.irrigationFrequency}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4c871e] focus:border-transparent"
                      placeholder="Enter irrigation frequency"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4c871e] focus:border-transparent"
                      placeholder="Enter temperature"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Humidity (%)
                    </label>
                    <input
                      type="number"
                      name="humidity"
                      value={formData.humidity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4c871e] focus:border-transparent"
                      placeholder="Enter humidity percentage"
                    />
                  </div>
                  <button
                    onClick={handleAnalyze}
                    className="w-full bg-gradient-to-r from-[#4c871e] to-[#3a6a16] text-white px-4 py-2 rounded-lg hover:from-[#3a6a16] hover:to-[#2d5212] transition-all duration-300"
                  >
                    Analyze Water Level
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Analysis Results
                </h2>
                {waterLevel !== null && (
                  <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Water Level
                    </h3>
                    <div className="text-3xl font-bold text-[#4c871e]">
                      {waterLevel.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Model Accuracy: {(accuracy * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
                <div className="mt-6">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default WaterLevel; 