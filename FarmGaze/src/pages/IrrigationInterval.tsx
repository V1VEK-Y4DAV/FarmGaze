import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import { useState } from "react";

const IrrigationInterval = () => {
  const [irrigationSchedule, setIrrigationSchedule] = useState<{ date: string; amount: number }[]>([]);
  const [formData, setFormData] = useState({
    soilMoisture: "",
    temperature: "",
    humidity: "",
    rainfall: "",
    cropType: "",
    growthStage: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIrrigationPredict = () => {
    // Generate simulated irrigation schedule
    const currentDate = new Date();
    const schedule = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      return {
        date: date.toLocaleDateString(),
        amount: Math.round(Math.random() * 20 + 10) // Random amount between 10-30mm
      };
    });

    setIrrigationSchedule(schedule);
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
              Irrigation Schedule
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Input Parameters
                </h2>
                <div className="space-y-4">
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
                      Crop Type
                    </label>
                    <select
                      name="cropType"
                      value={formData.cropType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4c871e] focus:border-transparent"
                    >
                      <option value="">Select crop type</option>
                      <option value="wheat">Wheat</option>
                      <option value="rice">Rice</option>
                      <option value="corn">Corn</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Growth Stage
                    </label>
                    <select
                      name="growthStage"
                      value={formData.growthStage}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4c871e] focus:border-transparent"
                    >
                      <option value="">Select growth stage</option>
                      <option value="vegetative">Vegetative</option>
                      <option value="flowering">Flowering</option>
                      <option value="fruiting">Fruiting</option>
                    </select>
                  </div>
                  <button
                    onClick={handleIrrigationPredict}
                    className="w-full bg-gradient-to-r from-[#4c871e] to-[#3a6a16] text-white px-4 py-2 rounded-lg hover:from-[#3a6a16] hover:to-[#2d5212] transition-all duration-300"
                  >
                    Predict Irrigation Schedule
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Irrigation Schedule
                </h2>
                {irrigationSchedule.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {irrigationSchedule.map((item, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Date</div>
                          <div className="font-medium text-gray-900 dark:text-white">{item.date}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Amount</div>
                          <div className="font-medium text-[#4c871e]">{item.amount}mm</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default IrrigationInterval; 