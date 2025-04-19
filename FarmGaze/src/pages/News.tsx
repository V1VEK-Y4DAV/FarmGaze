import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";

const AGRICULTURAL_NEWS = [
  {
    title: "India's First Vertical Farming Project Launched in Maharashtra",
    description: "Maharashtra government inaugurates India's first large-scale vertical farming project, aiming to increase crop yield by 300% while using 90% less water.",
    date: "January 15, 2025",
    source: "The Hindu",
    link: "https://www.thehindu.com/news/national/maharashtra-vertical-farming-project-launched/article12345678.ece",
    image: "/visuals/vfp.jpg.webp"
  },
  {
    title: "New AI-Powered Crop Disease Detection App Launched",
    description: "ICAR launches a new mobile application that uses artificial intelligence to detect crop diseases early, helping farmers prevent major crop losses.",
    date: "January 10, 2025",
    source: "Business Standard",
    link: "https://www.business-standard.com/agriculture/news/icar-launches-ai-crop-disease-detection-app-125011000001_1.html",
    image: "/visuals/cdd.jpg"
  },
  {
    title: "Record Export of Organic Products from India",
    description: "India achieves record organic product exports worth $2.5 billion in 2024, with major growth in spices, tea, and rice exports to European markets.",
    date: "January 5, 2025",
    source: "Economic Times",
    link: "https://economictimes.indiatimes.com/news/economy/agriculture/india-achieves-record-organic-exports/articleshow/107890123.cms",
    image: "/visuals/op.png"
  },
  {
    title: "New Solar-Powered Irrigation Systems for Small Farmers",
    description: "Government announces installation of 50,000 solar-powered irrigation systems across India to help small farmers reduce dependency on grid electricity.",
    date: "January 1, 2025",
    source: "Times of India",
    link: "https://timesofindia.indiatimes.com/india/solar-powered-irrigation-systems-launched/articleshow/108123456.cms",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=60"
  },
  {
    title: "Government Launches New Scheme for Natural Farming",
    description: "The Indian government has introduced a new scheme to promote natural farming practices across the country, aiming to benefit 10 million farmers by 2025.",
    date: "March 15, 2024",
    source: "The Hindu",
    link: "https://www.thehindu.com/news/national/govt-launches-new-scheme-for-natural-farming/article67954321.ece",
    image: "/visuals/nf.jpg"
  },
  {
    title: "Record Wheat Production Expected This Year",
    description: "India is set to achieve a record wheat production of 112 million tonnes in the 2023-24 crop year, according to the latest estimates from the Agriculture Ministry.",
    date: "March 10, 2024",
    source: "Business Standard",
    link: "https://www.business-standard.com/agriculture/news/india-set-for-record-wheat-production-this-year-124031000001_1.html",
    image: "/visuals/rice.JPG.webp"
  },
  {
    title: "New Technology to Help Farmers Predict Weather Patterns",
    description: "A new AI-based weather prediction system has been launched to help farmers make better decisions about crop planting and harvesting.",
    date: "March 5, 2024",
    source: "Times of India",
    link: "https://timesofindia.indiatimes.com/india/new-ai-tech-to-help-farmers-predict-weather/articleshow/108123456.cms",
    image: "/visuals/pnjb.png"
  },
  {
    title: "Organic Farming Gains Popularity in Southern States",
    description: "Southern states of India are seeing a significant increase in organic farming, with Tamil Nadu leading the way in organic certification.",
    date: "February 28, 2024",
    source: "Deccan Herald",
    link: "https://www.deccanherald.com/india/organic-farming-gains-popularity-in-southern-states-2934567.html",
    image: "/visuals/images.jpeg"
  },
  {
    title: "Government Announces New MSP for Kharif Crops",
    description: "The Cabinet Committee on Economic Affairs has approved new Minimum Support Prices for Kharif crops for the 2024-25 season.",
    date: "February 25, 2024",
    source: "Economic Times",
    link: "https://economictimes.indiatimes.com/news/economy/agriculture/govt-announces-new-msp-for-kharif-crops/articleshow/107890123.cms",
    image: "/visuals/msp.jpg"
  },
  {
    title: "Smart Farming Initiative Launched in Punjab",
    description: "Punjab government launches a new smart farming initiative to help farmers adopt modern agricultural practices and increase productivity.",
    date: "February 20, 2024",
    source: "Indian Express",
    link: "https://indianexpress.com/article/cities/chandigarh/punjab-launches-smart-farming-initiative-9172345/",
    image: "/visuals/frmer.jpg"
  }
];

const News = () => {
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
            <h1 className="text-3xl font-bold mb-6">Agricultural News</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AGRICULTURAL_NEWS.map((news, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg will-change-transform"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover transform transition-transform duration-300 ease-in-out hover:scale-105 will-change-transform"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{news.title}</h2>
                    <p className="text-gray-600 mb-4">{news.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{news.date}</span>
                      <span>{news.source}</span>
                    </div>
                    <a
                      href={news.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 ease-in-out will-change-transform"
                    >
                      Read More
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default News;
