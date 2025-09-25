import { motion } from "framer-motion";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Lightbulb, Users, Database, Globe, Shield } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 overflow-x-hidden">
          {/* About Section */}
          <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-6xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">About FarmGaze</h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  A revolutionary platform transforming agriculture through data-driven insights and smart technology
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Main Developer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-16 h-16 rounded-full bg-[#4c871e]/10 flex items-center justify-center mx-auto mb-4">
                        <Code2 className="h-8 w-8 text-[#4c871e]" />
                      </div>
                      <CardTitle className="text-xl text-center">Vivek Kumar Yadav</CardTitle>
                      <p className="text-[#4c871e] text-center font-semibold">Model Trainer</p>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 dark:text-gray-300">
                        Lead architect and developer behind FarmGaze's innovative features and robust infrastructure
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Helping Hand 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-16 h-16 rounded-full bg-[#4c871e]/10 flex items-center justify-center mx-auto mb-4">
                        <Lightbulb className="h-8 w-8 text-[#4c871e]" />
                      </div>
                      <CardTitle className="text-xl text-center">Vinarm Kumar</CardTitle>
                      <p className="text-[#4c871e] text-center font-semibold">Frontend developer</p>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 dark:text-gray-300">
                        Providing valuable insights and technical guidance for optimal system architecture
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Helping Hand 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-16 h-16 rounded-full bg-[#4c871e]/10 flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-[#4c871e]" />
                      </div>
                      <CardTitle className="text-xl text-center">Dileep Kumar Prajapati</CardTitle>
                      <p className="text-[#4c871e] text-center font-semibold">Metereological Deptt.</p>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 dark:text-gray-300">
                        Ensuring smooth project execution and effective team collaboration
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Data Analyst */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-16 h-16 rounded-full bg-[#4c871e]/10 flex items-center justify-center mx-auto mb-4">
                        <Database className="h-8 w-8 text-[#4c871e]" />
                      </div>
                      <CardTitle className="text-xl text-center">Ritika Kaushik</CardTitle>
                      <p className="text-[#4c871e] text-center font-semibold">Data Analyst</p>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 dark:text-gray-300">
                        Specializing in agricultural data analysis and machine learning models for crop predictions
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* UI/UX Designer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-16 h-16 rounded-full bg-[#4c871e]/10 flex items-center justify-center mx-auto mb-4">
                        <Globe className="h-8 w-8 text-[#4c871e]" />
                      </div>
                      <CardTitle className="text-xl text-center">Abhishek Yadav</CardTitle>
                      <p className="text-[#4c871e] text-center font-semibold">Chatbot Developer</p>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 dark:text-gray-300">
                        Creating intuitive and user-friendly interfaces for seamless farmer experience
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quality Assurance */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-16 h-16 rounded-full bg-[#4c871e]/10 flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-8 w-8 text-[#4c871e]" />
                      </div>
                      <CardTitle className="text-xl text-center">Aditya Ashok Singh</CardTitle>
                      <p className="text-[#4c871e] text-center font-semibold">Backend Developer</p>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 dark:text-gray-300">
                        Ensuring platform reliability and maintaining high quality standards across all features
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-12 text-center"
              >
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Together, our team combines technical expertise with agricultural knowledge to create a platform that truly revolutionizes farming practices. We're committed to making agriculture more efficient, sustainable, and data-driven.
                </p>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
