import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 overflow-x-hidden">
          <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8">Our Services</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {/* Weather Monitoring Service */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold">Weather Monitoring</h2>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Our advanced weather monitoring system provides real-time weather data and forecasts for your specific location. This helps you:
                </p>
                <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-1 sm:space-y-2">
                  <li>Plan irrigation schedules efficiently</li>
                  <li>Protect crops from extreme weather conditions</li>
                  <li>Optimize planting and harvesting times</li>
                  <li>Reduce water usage through smart irrigation</li>
                </ul>
              </div>

              {/* Crop Disease Detection */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold">Crop Disease Detection</h2>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Our AI-powered disease detection system helps you identify and manage crop diseases early:
                </p>
                <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-1 sm:space-y-2">
                  <li>Early detection of plant diseases</li>
                  <li>Automated disease identification</li>
                  <li>Recommended treatment solutions</li>
                  <li>Preventive measures to protect crops</li>
                </ul>
              </div>

              {/* Market Insights */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold">Market Insights</h2>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Stay informed about market trends and make better business decisions:
                </p>
                <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-1 sm:space-y-2">
                  <li>Real-time market prices for crops</li>
                  <li>Demand forecasting</li>
                  <li>Best time to sell your produce</li>
                  <li>Market trend analysis</li>
                </ul>
              </div>

              {/* Smart Farming Solutions */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold">Smart Farming Solutions</h2>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Modernize your farming practices with our smart solutions:
                </p>
                <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-1 sm:space-y-2">
                  <li>Automated irrigation systems</li>
                  <li>Soil health monitoring</li>
                  <li>Precision farming techniques</li>
                  <li>Resource optimization</li>
                </ul>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 sm:mt-10 md:mt-12 text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Ready to Transform Your Farming?</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
                Join thousands of farmers who are already benefiting from our smart farming solutions. 
                Get started today and take your farming to the next level.
              </p>
              <button className="bg-farm-green text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
