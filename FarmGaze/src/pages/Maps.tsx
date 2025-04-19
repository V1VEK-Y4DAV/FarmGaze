import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const Maps = () => {
  const mapVisualizations = [
    {
      title: "Rainfall Distribution",
      description: "Annual rainfall patterns across India",
      image: "/maps/rainfall-distribution.png",
      data: "Shows the distribution of rainfall across different regions of India, highlighting areas with high and low precipitation."
    },
    {
      title: "Temperature Distribution",
      description: "Average annual temperature patterns across India",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/India_average_annual_temperature_map_en.svg/1920px-India_average_annual_temperature_map_en.svg.png",
      data: "Shows the average annual temperature distribution across India, highlighting regions with different temperature zones."
    },
    {
      title: "Soil Types",
      description: "Major soil types across India",
      image: "https://upload.wikimedia.org/wikipedia/commons/b/be/Major_soil_types_in_India.jpg",
      data: "Illustrates different soil types and their distribution, crucial for crop selection and agricultural planning."
    },
    {
      title: "Crop Zones",
      description: "Major crop growing regions",
      image: "/maps/crop-zones.png",
      data: "Shows different agricultural zones and the major crops grown in each region."
    },
    {
      title: "Irrigation Coverage",
      description: "Areas with irrigation facilities",
      image: "/maps/irrigation-coverage.png",
      data: "Displays regions with irrigation infrastructure and water availability for agriculture."
    },
    {
      title: "Agricultural Productivity",
      description: "Crop yield patterns",
      image: "/maps/agricultural-productivity.png",
      data: "Shows agricultural productivity levels across different regions of India."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-[#4c871e] mb-1 sm:mb-2">Agricultural Maps of India</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Explore various agricultural data visualizations across India
            </p>

            <Tabs defaultValue="rainfall" className="w-full mt-6">
              <div className="overflow-x-auto">
                <TabsList className="grid w-full grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1 xs:gap-2 mb-2 xs:mb-4 sm:mb-6 min-w-max">
                  {mapVisualizations.map((map) => (
                    <TabsTrigger
                      key={map.title}
                      value={map.title.toLowerCase().replace(/\s+/g, '-')}
                      className="text-[10px] xs:text-xs sm:text-sm md:text-base px-1 xs:px-2 sm:px-4 py-0.5 xs:py-1 sm:py-2 whitespace-nowrap"
                    >
                      {map.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {mapVisualizations.map((map) => (
                <TabsContent
                  key={map.title}
                  value={map.title.toLowerCase().replace(/\s+/g, '-')}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-2 border-[#4c871e]/20 hover:border-[#4c871e]/40 transition-colors">
                      <CardHeader className="p-2 xs:p-3 sm:p-6">
                        <CardTitle className="text-base xs:text-lg sm:text-xl text-[#4c871e]">{map.title}</CardTitle>
                        <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 dark:text-gray-300">{map.description}</p>
                      </CardHeader>
                      <CardContent className="p-1 xs:p-2 sm:p-6">
                        <div className="max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto">
                          <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 w-full max-h-[350px] xs:max-h-[400px] sm:max-h-[450px] md:max-h-[550px] lg:max-h-[650px]">
                            <img
                              src={map.image}
                              alt={map.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-4 p-2 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{map.data}</p>
                          {map.title === "Soil Types" && (
                            <div className="mt-2 sm:mt-4 space-y-1 sm:space-y-2">
                              <h3 className="text-base sm:text-lg font-semibold text-[#4c871e]">Major Soil Types in India:</h3>
                              <ul className="list-disc pl-4 sm:pl-5 space-y-1 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                <li><span className="font-medium">Alluvial Soils:</span> Found in the Indo-Gangetic plains, these are the most fertile soils, ideal for growing wheat, rice, and sugarcane.</li>
                                <li><span className="font-medium">Black Soils (Regur):</span> Predominant in Maharashtra, Gujarat, and parts of Madhya Pradesh, excellent for cotton cultivation.</li>
                                <li><span className="font-medium">Red Soils:</span> Covering large parts of southern and eastern India, suitable for growing pulses, millets, and oilseeds.</li>
                                <li><span className="font-medium">Laterite Soils:</span> Found in high rainfall areas of Western Ghats and Eastern Ghats, used for tea, coffee, and cashew cultivation.</li>
                                <li><span className="font-medium">Arid and Desert Soils:</span> Present in Rajasthan and parts of Gujarat, requiring special irrigation techniques for agriculture.</li>
                                <li><span className="font-medium">Mountain Soils:</span> Found in Himalayan regions, suitable for growing fruits, tea, and spices.</li>
                              </ul>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
                                Note: Soil type distribution plays a crucial role in determining suitable crops and agricultural practices in different regions of India.
                              </p>
                            </div>
                          )}
                          {map.title === "Temperature Distribution" && (
                            <div className="mt-2 sm:mt-4 space-y-1 sm:space-y-2">
                              <h3 className="text-base sm:text-lg font-semibold text-[#4c871e]">Temperature Zones in India:</h3>
                              <ul className="list-disc pl-4 sm:pl-5 space-y-1 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                <li><span className="font-medium">Hot Arid Zone:</span> Found in Rajasthan and parts of Gujarat, with temperatures often exceeding 45°C in summer, suitable for drought-resistant crops like millets and pulses.</li>
                                <li><span className="font-medium">Hot Semi-Arid Zone:</span> Covering parts of Maharashtra, Karnataka, and Andhra Pradesh, with temperatures ranging from 25-40°C, ideal for cotton and groundnut cultivation.</li>
                                <li><span className="font-medium">Tropical Zone:</span> Encompassing most of peninsular India, with temperatures between 20-35°C, perfect for rice, sugarcane, and tropical fruits.</li>
                                <li><span className="font-medium">Sub-Tropical Zone:</span> Found in the Indo-Gangetic plains, with temperatures ranging from 15-30°C, excellent for wheat, rice, and various vegetables.</li>
                                <li><span className="font-medium">Temperate Zone:</span> Present in the Himalayan foothills, with temperatures between 10-25°C, suitable for apples, cherries, and temperate vegetables.</li>
                                <li><span className="font-medium">Cold Arid Zone:</span> Located in Ladakh and parts of Himachal Pradesh, with temperatures often below freezing, requiring special agricultural practices.</li>
                              </ul>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
                                Note: Temperature distribution significantly influences crop selection, growing seasons, and agricultural practices across different regions of India. Understanding these patterns helps in planning crop rotations and implementing appropriate farming techniques.
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Maps; 