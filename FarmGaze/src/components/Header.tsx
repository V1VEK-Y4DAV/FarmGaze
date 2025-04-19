import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="bg-farm-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="FarmGaze Logo" className="h-8 w-auto" />
              <span className="ml-2 text-2xl font-bold text-white">FarmGaze</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-green-700">
              <Link to="/">Home</Link>
            </Button>
            <Button variant="ghost" className="text-white hover:text-white hover:bg-green-700">
              <Link to="/about">About</Link>
            </Button>
            <Button variant="ghost" className="text-white hover:text-white hover:bg-green-700">
              <Link to="/services">Services</Link>
            </Button>
            <Button variant="ghost" className="text-white hover:text-white hover:bg-green-700">
              <Link to="/products">Products</Link>
            </Button>
            <Button variant="ghost" className="text-white hover:text-white hover:bg-green-700">
              <Link to="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
