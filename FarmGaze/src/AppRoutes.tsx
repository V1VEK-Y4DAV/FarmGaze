import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Maps from "@/pages/Maps";
import Visualizations from "@/pages/Visualizations";
import Predictions from "./pages/Predictions";
import Model from "@/pages/Model";
import Weather from "@/pages/Weather";
import Information from "@/pages/Information";
import News from "@/pages/News";
import About from "@/pages/About";
import Products from "@/pages/Products";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import WaterEfficiency from "@/pages/WaterEfficiency";
import WaterLevelAnalysis from "@/pages/WaterLevelAnalysis";
import SoilAnalysis from "@/pages/SoilAnalysis";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/maps" element={<Maps />} />
      <Route path="/visualizations" element={<Visualizations />} />
      <Route path="/predictions" element={<Predictions />} />
      <Route path="/model" element={<Model />} />
      <Route path="/water-efficiency" element={<WaterEfficiency />} />
      <Route path="/water-level" element={<WaterLevelAnalysis />} />
      <Route path="/soil-analysis" element={<SoilAnalysis />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/information" element={<Information />} />
      <Route path="/news" element={<News />} />
      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 