import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { MapPin, Cloud, Info, ShoppingCart, MessageCircle, Mail, Phone, MapPin as LocationIcon, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { title: "Home", to: "/" },
    { title: "About", to: "/about" },
    { title: "Services", to: "/services" },
    { title: "Contact", to: "/contact" },
  ];

  const tools = [
    { title: "Maps", to: "/maps", icon: <MapPin size={16} /> },
    { title: "Weather", to: "/weather", icon: <Cloud size={16} /> },
    { title: "Information", to: "/information", icon: <Info size={16} /> },
    { title: "Products", to: "/products", icon: <ShoppingCart size={16} /> },
    { title: "Chatbot", to: "/chatbot", icon: <MessageCircle size={16} /> },
  ];

  const features = [
    "Smart Irrigation Systems",
    "Real-time Weather Monitoring",
    "Precision Field Mapping",
    "AI-Powered Crop Analytics",
    "Water Efficiency Optimization",
    "Soil Health Analysis",
  ];

  return (
    <footer className="bg-[#4c871e] dark:bg-gray-900 text-white border-t border-green-600 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src="/logo.png" alt="FarmGaze Logo" className="h-8 w-auto" />
              <span className="ml-2 text-2xl font-bold">FarmGaze</span>
            </div>
            <p className="text-green-100 dark:text-gray-300 text-sm leading-relaxed">
              Revolutionizing agriculture through smart irrigation and precision farming technology. 
              Empowering farmers with data-driven insights for sustainable and efficient farming operations.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-green-100 hover:text-white hover:bg-green-700">
                <Facebook size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-green-100 hover:text-white hover:bg-green-700">
                <Twitter size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-green-100 hover:text-white hover:bg-green-700">
                <Instagram size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-green-100 hover:text-white hover:bg-green-700">
                <Linkedin size={20} />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Button
                    variant="ghost"
                    className="text-green-100 hover:text-white hover:bg-green-700 text-sm justify-start p-0 h-auto"
                    asChild
                  >
                    <Link to={link.to}>{link.title}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Our Tools</h3>
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li key={tool.to}>
                  <Button
                    variant="ghost"
                    className="text-green-100 hover:text-white hover:bg-green-700 text-sm justify-start p-0 h-auto"
                    asChild
                  >
                    <Link to={tool.to} className="flex items-center">
                      {tool.icon}
                      <span className="ml-2">{tool.title}</span>
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Features & Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Key Features</h3>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="text-green-100 text-sm flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-300 mt-2 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <div className="pt-4 space-y-2">
              <h4 className="font-semibold text-white">Contact Info</h4>
              <div className="space-y-1">
                <div className="flex items-center text-green-100 text-sm">
                  <Mail size={14} className="mr-2" />
                  <span>info@farmgaze.com</span>
                </div>
                <div className="flex items-center text-green-100 text-sm">
                  <Phone size={14} className="mr-2" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-green-100 text-sm">
                  <LocationIcon size={14} className="mr-2" />
                  <span>Agricultural Innovation Center</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="mt-8 pt-8 border-t border-green-600 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-green-100 text-sm">
              © 2025 FarmGaze. All rights reserved. | Built for sustainable agriculture.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-green-100 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-green-100 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/support" className="text-green-100 hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;