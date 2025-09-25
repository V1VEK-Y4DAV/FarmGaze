import { Info, Cloud, ShoppingCart, MapPin, Home, MessageCircle, Brain, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const SidebarItem = ({ icon, text, to }: { icon: React.ReactNode; text: string; to: string }) => {
  return (
    <li>
      <Button
        variant="ghost"
        className="w-full justify-start px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
        asChild
      >
        <Link to={to} className="flex items-center">
          <span className="w-6 flex items-center justify-center">{icon}</span>
          <span className="ml-3">{text}</span>
        </Link>
      </Button>
    </li>
  );
};

const Sidebar = () => {
  const { t } = useLanguage();

  return (
    <aside className="w-64 min-h-screen border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-900 hidden md:flex transition-colors duration-200">
      <nav className="flex-grow">
        <ul className="pt-6">
          <SidebarItem icon={<Home size={18} />} text={t.common.home} to="/" />
          <SidebarItem icon={<MapPin size={18} />} text={t.common.maps} to="/maps" />
          <SidebarItem icon={<Cloud size={18} />} text={t.common.weather} to="/weather" />
          <SidebarItem icon={<Info size={18} />} text={t.common.information} to="/information" />
          <SidebarItem icon={<ShoppingCart size={18} />} text={t.common.products} to="/products" />
          <SidebarItem icon={<Brain size={18} />} text={t.common.aiRecommendation} to="/ai-recommendation" />
          <SidebarItem icon={<MessageCircle size={18} />} text={t.common.chatbot} to="/chatbot" />
          <SidebarItem icon={<Heart size={18} />} text={t.common.careCure} to="/care-cure" />
        </ul>
      </nav>
      <div className="p-4 text-gray-500 dark:text-gray-400 text-xs border-t border-gray-100 dark:border-gray-700">
        © {t.common.farmgaze} 2025
      </div>
    </aside>
  );
};

export default Sidebar;