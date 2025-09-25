const HeroSection = () => {
  return (
    <div className="relative flex items-center justify-center flex-1 p-8 md:p-12 lg:p-16">
      {/* Background Text with reduced opacity and positioned lower */}
      <div className="absolute inset-0 flex items-center justify-center mt-16 md:mt-20 text-gray-100/20 text-[120px] md:text-[180px] font-bold overflow-hidden pointer-events-none">
        FarmGaze
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-lg">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-center md:text-left">FarmGaze</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 text-center md:text-left">
          The smart irrigation system for precision farming
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          {/* Get Started button - always in English */}
          <button className="bg-farm-orange text-white px-6 py-3 rounded-full flex items-center">
            Get Started
            <svg className="ml-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14M19 12l-7-7m7 7l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {/* Learn More button - always in Hindi (Devanagari) */}
          <button className="bg-white text-farm-orange border-2 border-farm-orange px-6 py-3 rounded-full flex items-center">
            अधिक जानें
            <svg className="ml-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14M19 12l-7-7m7 7l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;