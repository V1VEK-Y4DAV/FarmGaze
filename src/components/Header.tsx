import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, Info, Cloud, ShoppingCart, MapPin, Home } from "lucide-react";
import { useState, useCallback, useMemo, memo } from "react";

// Optimized navigation item component with memo to prevent re-renders
const NavButton = memo(({ item, onClick }: { item: { text: string; to: string }; onClick?: () => void }) => (
  <Button 
    variant="ghost" 
    className="text-white hover:text-white hover:bg-green-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-150 will-change-auto" 
    asChild
    onClick={onClick}
  >
    <Link to={item.to} className="focus:outline-none focus:ring-0">{item.text}</Link>
  </Button>
));
NavButton.displayName = 'NavButton';

// Optimized mobile nav item component
const MobileNavButton = memo(({ item, onClick, showIcon = false }: { 
  item: { text: string; to: string; icon?: React.ReactNode }; 
  onClick: () => void;
  showIcon?: boolean;
}) => (
  <Button
    variant="ghost"
    className="w-full justify-start px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors duration-150 will-change-auto"
    asChild
    onClick={onClick}
  >
    <Link to={item.to} className={`flex items-center focus:outline-none focus:ring-0 ${showIcon ? '' : ''}`}>
      {showIcon && item.icon && (
        <span className="w-6 flex items-center justify-center">{item.icon}</span>
      )}
      <span className={showIcon ? "ml-3" : ""}>{item.text}</span>
    </Link>
  </Button>
));
MobileNavButton.displayName = 'MobileNavButton';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Memoize navigation items to prevent recreation on every render
  const navigationItems = useMemo(() => [
    { icon: <Home size={18} />, text: "Home", to: "/" },
    { icon: <MapPin size={18} />, text: "Maps", to: "/maps" },
    { icon: <Cloud size={18} />, text: "Weather", to: "/weather" },
    { icon: <Info size={18} />, text: "Information", to: "/information" },
    { icon: <ShoppingCart size={18} />, text: "Products", to: "/products" },
  ], []);

  const headerItems = useMemo(() => [
    { text: "Home", to: "/" },
    { text: "About", to: "/about" },
    { text: "Services", to: "/services" },
    { text: "Products", to: "/products" },
    { text: "Contact", to: "/contact" },
  ], []);

  // Memoize close handler to prevent recreation
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <header className="bg-farm-green dark:bg-gray-900 text-white border-b border-green-600 dark:border-gray-700 transition-colors duration-150 will-change-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center focus:outline-none focus:ring-0 transition-transform duration-150 hover:scale-105 will-change-transform">
              <img src="/logo.png" alt="FarmGaze Logo" className="h-8 w-auto" loading="lazy" />
              <span className="ml-2 text-2xl font-bold text-white dark:text-gray-100">FarmGaze</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {headerItems.map((item) => (
              <NavButton key={item.to} item={item} />
            ))}
            <div className="border-l border-green-600 dark:border-gray-600 pl-4 ml-4">
              <ModeToggle />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-green-700 transition-colors duration-150 will-change-auto focus:outline-none focus:ring-0">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 bg-white dark:bg-gray-900 will-change-transform">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation</h2>
                  </div>
                  
                  {/* Header Items Section */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Pages</h3>
                    <div className="space-y-1">
                      {headerItems.map((item) => (
                        <MobileNavButton key={item.to} item={item} onClick={handleClose} />
                      ))}
                    </div>
                  </div>
                  
                  {/* Sidebar Items Section */}
                  <div className="flex-1 px-4 py-3">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Tools</h3>
                    <div className="space-y-1">
                      {navigationItems.map((item) => (
                        <MobileNavButton key={item.to} item={item} onClick={handleClose} showIcon={true} />
                      ))}
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      © FarmGaze 2025
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;