import { motion } from "framer-motion";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Map, Cloud, BarChart2, LineChart, Brain, Newspaper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Products = () => {
  const products = [
    {
      title: "Detailed Map",
      icon: Map,
      description: "Our comprehensive mapping solution provides detailed insights into your farm:",
      features: [
        "High-resolution satellite imagery",
        "Field boundary detection",
        "Soil type mapping",
        "Topography analysis",
        "Land use classification"
      ]
    },
    {
      title: "Weather Tool",
      icon: Cloud,
      description: "Advanced weather monitoring and forecasting system:",
      features: [
        "Real-time weather data",
        "7-day weather forecasts",
        "Rainfall predictions",
        "Temperature monitoring",
        "Weather alerts and warnings"
      ]
    },
    {
      title: "Visualization Tools",
      icon: BarChart2,
      description: "Interactive data visualization and analysis tools:",
      features: [
        "Customizable charts and graphs",
        "3D field visualization",
        "Time-series analysis",
        "Data export capabilities",
        "Interactive dashboards"
      ]
    },
    {
      title: "Prediction Tools",
      icon: LineChart,
      description: "AI-powered prediction and forecasting tools:",
      features: [
        "Crop yield predictions",
        "Disease outbreak forecasting",
        "Market price predictions",
        "Weather pattern analysis",
        "Resource optimization"
      ]
    },
    {
      title: "AI Model",
      icon: Brain,
      description: "Advanced AI models for agricultural insights:",
      features: [
        "Crop health monitoring",
        "Soil analysis",
        "Pest detection",
        "Growth stage prediction",
        "Yield optimization"
      ]
    },
    {
      title: "News Portal",
      icon: Newspaper,
      description: "Comprehensive agricultural news and updates:",
      features: [
        "Latest farming news",
        "Market trends",
        "Government policies",
        "Research updates",
        "Expert opinions"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 overflow-x-hidden">
          <div className="p-4 sm:p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4c871e] to-emerald-600">
                Our Products
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
                Discover our comprehensive suite of agricultural tools designed to enhance your farming operations
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 transform transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                      <product.icon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      {product.title}
                    </h2>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                    {product.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + featureIndex * 0.05 }}
                        className="flex items-center text-sm sm:text-base text-gray-600 dark:text-gray-300"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 dark:text-green-400"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 sm:mt-16 text-center"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4c871e] to-emerald-600">
                Ready to Transform Your Farming?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                Explore our comprehensive suite of products designed to enhance your farming operations. 
                Get started today and take your farming to the next level.
              </p>
              <Button className="bg-[#4c871e] hover:bg-[#4c871e]/90 text-white px-6 py-3 text-sm sm:text-base">
                Get Started
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
