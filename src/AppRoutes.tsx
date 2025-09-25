import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Maps from "@/pages/Maps";
import Weather from "@/pages/Weather";
import Information from "@/pages/Information";
import About from "@/pages/About";
import Products from "@/pages/Products";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import Chatbot from "@/pages/Chatbot";
import AIRecommendation from "@/pages/AIRecommendation.tsx";
import CareCure from "@/pages/CareCure.tsx";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/maps" element={<Maps />} />


      <Route path="/weather" element={<Weather />} />
      <Route path="/information" element={<Information />} />

      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
      <Route path="/ai-recommendation" element={<AIRecommendation />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/care-cure" element={<CareCure />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;