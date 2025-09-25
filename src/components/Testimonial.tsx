
const Testimonial = () => {
  return (
    <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 max-w-sm md:max-w-md bg-white rounded-lg shadow-lg p-5 z-10">
      <div className="flex items-start mb-3">
        <div className="bg-blue-100 p-2 rounded">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1V15M1 8H15" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <p className="text-gray-600 mb-4">
        "Our sustainable farming methods have not only improved our crop yields but also helped restore the natural ecosystem on our land."
      </p>
      <div className="flex items-center">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="ml-2 text-gray-700 font-medium">JOHN PETERSON</span>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <div className="bg-gray-900 text-white text-xs px-3 py-1 rounded">
          700+ website
        </div>
        <div className="bg-green-600 text-white text-xs px-3 py-1 rounded flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
          now
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
