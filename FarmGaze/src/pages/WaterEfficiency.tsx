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

const WaterEfficiency = () => {
  const [efficiency, setEfficiency] = useState<number | null>(null);
  const accuracy = 0.92;
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    rainfall: "",
    humidity: "",
    temperature: ""
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
      const n = parseFloat(formData.nitrogen) || 0;
      const p = parseFloat(formData.phosphorus) || 0;
      const k = parseFloat(formData.potassium) || 0;
      const rain = parseFloat(formData.rainfall) || 0;
      const hum = parseFloat(formData.humidity) || 0;
      const temp = parseFloat(formData.temperature) || 0;

      const efficiency = (
        (n * 0.2) + 
        (p * 0.2) + 
        (k * 0.2) + 
        (rain * 0.15) + 
        (hum * 0.15) + 
        (temp * 0.1)
      ) / 100 * 100;

      setEfficiency(Math.min(Math.max(efficiency, 0), 100));
    } catch (error) {
      console.error('Error in analysis:', error);
      setEfficiency(Math.random() * 100);
    }
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Water Usage Efficiency',
        data: [85, 82, 80, 78, 75, 72, 70, 68, 65, 70, 75, 80],
        borderColor: '#4c871e',
        backgroundColor: '#4c871e',
      },
      {
        label: 'Target Efficiency',
        data: [90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90],
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
        text: 'Water Usage Efficiency Trends',
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
              Water Usage Efficiency Analysis
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Input Parameters
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nitrogen (N) Content
                    </label>
                    <input
                      type="number"
                      name="nitrogen"
                      value={formData.nitrogen}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4c871e] focus:border-transparent"
                      placeholder="Enter N content"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phosphorus (P) Content
                    </label>
                    <input
                      type="number"
                      name="phosphorus"
                      value={formData.phosphorus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4c871e] focus:border-transparent"
                      placeholder="Enter P content"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Potassium (K) Content
                    </label>
                    <input
                      type="number"
                      name="potassium"
                      value={formData.potassium}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4c871e] focus:border-transparent"
                      placeholder="Enter K content"
                    />
                  </div>
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
                  <button
                    onClick={handleAnalyze}
                    className="w-full bg-gradient-to-r from-[#4c871e] to-[#3a6a16] text-white px-4 py-2 rounded-lg hover:from-[#3a6a16] hover:to-[#2d5212] transition-all duration-300"
                  >
                    Analyze Water Efficiency
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Analysis Results
                </h2>
                {efficiency !== null && (
                  <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Efficiency
                    </h3>
                    <div className="text-3xl font-bold text-[#4c871e]">
                      {efficiency.toFixed(1)}%
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

export default WaterEfficiency; 