import { BarChart2, Clock, Info, Newspaper, Cloud, Map, ShoppingCart, MapPin, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SidebarItem = ({ icon, text, to }: { icon: React.ReactNode; text: string; to: string }) => {
  return (
    <li>
      <Button
        variant="ghost"
        className="w-full justify-start px-6 py-3 hover:bg-gray-100 text-gray-600"
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
  return (
    <aside className="w-64 min-h-screen border-r border-gray-200 flex flex-col bg-white hidden md:flex">
      <nav className="flex-grow">
        <ul className="pt-6">
          <SidebarItem icon={<Home size={18} />} text="Home" to="/" />
          <SidebarItem icon={<MapPin size={18} />} text="Maps" to="/maps" />
          <SidebarItem icon={<Cloud size={18} />} text="Weather" to="/weather" />
          <SidebarItem icon={<BarChart2 size={18} />} text="Visualizations" to="/visualizations" />
          <SidebarItem icon={<Clock size={18} />} text="Predictions" to="/predictions" />
          <SidebarItem icon={<Map size={18} />} text="Model" to="/model" />
          <SidebarItem icon={<Info size={18} />} text="Information" to="/information" />
          <SidebarItem icon={<Newspaper size={18} />} text="News" to="/news" />
          <SidebarItem icon={<ShoppingCart size={18} />} text="Products" to="/products" />
        </ul>
      </nav>
      <div className="p-4 text-gray-500 text-xs border-t border-gray-100">
        © FarmGaze 2025
      </div>
    </aside>
  );
};

export default Sidebar;
