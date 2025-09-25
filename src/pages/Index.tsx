import { motion } from "framer-motion";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Cloud, Droplet, Leaf, LineChart, Map, Settings2, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { language, setLanguage, t } = useLanguage();

  // Handle language change when buttons are clicked
  const handleGetStarted = () => {
    if (language !== 'en') {
      setLanguage('en');
    }
    // Additional navigation logic can be added here
  };

  const handleLearnMore = () => {
    if (language !== 'hi') {
      setLanguage('hi');
    }
    // Additional navigation logic can be added here
  };

  // Create features array with translations
  const features = [
    {
      title: t.home.features.smartIrrigation.title,
      description: t.home.features.smartIrrigation.description,
      icon: <Droplet className="h-6 w-6 text-[#4c871e]" />,
    },
    {
      title: t.home.features.dataAnalytics.title,
      description: t.home.features.dataAnalytics.description,
      icon: <BarChart2 className="h-6 w-6 text-[#4c871e]" />,
    },
    {
      title: t.home.features.weatherMonitoring.title,
      description: t.home.features.weatherMonitoring.description,
      icon: <Cloud className="h-6 w-6 text-[#4c871e]" />,
    },
    {
      title: t.home.features.cropHealth.title,
      description: t.home.features.cropHealth.description,
      icon: <Leaf className="h-6 w-6 text-[#4c871e]" />,
    },
    {
      title: t.home.features.fieldMapping.title,
      description: t.home.features.fieldMapping.description,
      icon: <Map className="h-6 w-6 text-[#4c871e]" />,
    },
    {
      title: t.home.features.performanceTracking.title,
      description: t.home.features.performanceTracking.description,
      icon: <LineChart className="h-6 w-6 text-[#4c871e]" />,
    },
    {
      title: t.home.features.systemIntegration.title,
      description: t.home.features.systemIntegration.description,
      icon: <Settings2 className="h-6 w-6 text-[#4c871e]" />,
    },
    {
      title: t.home.features.dataSecurity.title,
      description: t.home.features.dataSecurity.description,
      icon: <Shield className="h-6 w-6 text-[#4c871e]" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 overflow-x-hidden">
          {/* Title Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full py-12 px-4 md:px-8 lg:px-16 bg-white dark:bg-gray-900 shadow-sm mb-8 relative"
          >
            <div className="max-w-6xl mx-auto relative">
              <p className="text-gray-300/40 text-8xl md:text-9xl font-black text-center absolute -top-6 left-1/2 -translate-x-1/2 w-full">{t.common.farmgaze}</p>
              <h1 className="text-5xl md:text-6xl font-bold text-[#4c871e] text-center relative z-10">{t.common.farmgaze}</h1>
            </div>
          </motion.div>

          {/* Hero Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-center justify-center min-h-[80vh] p-8 md:p-12 lg:p-16 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
          >
            <div className="absolute inset-0 flex items-center justify-center mt-16 md:mt-20">
              <div className="absolute text-[#4c871e]/5 text-[220px] md:text-[320px] font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-[#4c871e]/5 to-[#4c871e]/10">
                {t.common.farmgaze}
              </div>
              <div className="absolute text-[#4c871e]/10 text-[200px] md:text-[300px] font-black tracking-tight -rotate-12 bg-clip-text text-transparent bg-gradient-to-b from-[#4c871e]/10 to-[#4c871e]/15">
                {t.common.farmgaze}
              </div>
              <div className="absolute text-[#4c871e]/15 text-[180px] md:text-[280px] font-black tracking-tight rotate-12 bg-clip-text text-transparent bg-gradient-to-b from-[#4c871e]/15 to-[#4c871e]/20">
                {t.common.farmgaze}
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/50 dark:to-gray-900/50 pointer-events-none" />
            </div>
            
            <div className="relative z-10 max-w-4xl text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#4c871e] to-emerald-600"
              >
                {t.home.title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8"
              >
                {t.home.description}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col md:flex-row gap-4 justify-center"
              >
                <Button 
                  size="lg" 
                  className="bg-[#4c871e] hover:bg-[#4c871e]/90 transition-all duration-200 transform hover:scale-105"
                  onClick={handleGetStarted}
                >
                  {t.home.getStarted}
                  {language !== 'en' && <span className="ml-2 text-xs opacity-70">(English)</span>}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-[#4c871e] text-[#4c871e] hover:bg-[#4c871e]/10 transition-all duration-200 transform hover:scale-105"
                  onClick={handleLearnMore}
                >
                  {t.home.learnMore}
                  {language !== 'hi' && <span className="ml-2 text-xs opacity-70">(हिंदी)</span>}
                </Button>
              </motion.div>
            </div>
          </motion.section>

          {/* Features Section */}
          <section className="py-16 px-4 md:px-8 lg:px-16 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.home.keyFeatures}</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  {t.home.keyFeaturesDesc}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-[#4c871e]/10 flex items-center justify-center mb-4">
                          {feature.icon}
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
