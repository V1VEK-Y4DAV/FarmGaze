import { motion } from "framer-motion";
import { useState } from "react";
import { cropData } from "@/data/cropData";
import Header from "@/components/Header";

interface CropInfo {
  name: string;
  temperature: string;
  rainfall: string;
  season: string;
  soil: string;
  duration: string;
  yield: string;
  market: string;
  special: string;
  image: string;
}

const Information = () => {
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white"
        >
          Crop Information
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(cropData).map(([key, crop]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer"
              onClick={() => setSelectedCrop(key)}
            >
              <div className="relative h-48">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {crop.name}
                </h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <p><span className="font-medium">Temperature:</span> {crop.temperature}</p>
                  <p><span className="font-medium">Rainfall:</span> {crop.rainfall}</p>
                  <p><span className="font-medium">Season:</span> {crop.season}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedCrop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCrop(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64">
                <img
                  src={cropData[selectedCrop].image}
                  alt={cropData[selectedCrop].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  {cropData[selectedCrop].name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Temperature:</span> {cropData[selectedCrop].temperature}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Rainfall:</span> {cropData[selectedCrop].rainfall}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Season:</span> {cropData[selectedCrop].season}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Soil Type:</span> {cropData[selectedCrop].soil}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Duration:</span> {cropData[selectedCrop].duration}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Expected Yield:</span> {cropData[selectedCrop].yield}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Market:</span> {cropData[selectedCrop].market}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Special Notes:</span> {cropData[selectedCrop].special}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Information;
