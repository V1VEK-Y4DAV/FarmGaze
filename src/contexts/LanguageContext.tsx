import React, { createContext, useContext, useState, useEffect } from 'react';

// Define language type
export type Language = 'en' | 'hi';

// Define translation structure
export interface Translations {
  // Common
  common: {
    farmgaze: string;
    home: string;
    about: string;
    contact: string;
    services: string;
    products: string;
    maps: string;
    weather: string;
    information: string;
    chatbot: string;
    aiRecommendation: string;
  };
  
  // Home page
  home: {
    title: string;
    subtitle: string;
    description: string;
    getStarted: string;
    learnMore: string;
    keyFeatures: string;
    keyFeaturesDesc: string;
    features: {
      smartIrrigation: {
        title: string;
        description: string;
      };
      dataAnalytics: {
        title: string;
        description: string;
      };
      weatherMonitoring: {
        title: string;
        description: string;
      };
      cropHealth: {
        title: string;
        description: string;
      };
      fieldMapping: {
        title: string;
        description: string;
      };
      performanceTracking: {
        title: string;
        description: string;
      };
      systemIntegration: {
        title: string;
        description: string;
      };
      dataSecurity: {
        title: string;
        description: string;
      };
    };
  };
  
  // AI Recommendation page
  aiRecommendation: {
    title: string;
    description: string;
    selectLocation: string;
    selectLocationDesc: string;
    state: string;
    district: string;
    season: string;
    seasonAdv: string;
    autoDetect: string;
    getRecommendations: string;
    analyzing: string;
    currentConditions: string;
    currentSeason: string;
    weatherConditions: string;
    precipitation: string;
    recommendedCrops: string;
    seasonSuitability: string;
    whyThisCrop: string;
    currentWeatherFactors: string;
    temperature: string;
    humidity: string;
    rainfallForecast: string;
    proTips: string;
    readyToStart: string;
    readyToStartDesc: string;
    confidence: string;
    match: string;
    high: string;
    medium: string;
    low: string;
  };
}

// English translations
const enTranslations: Translations = {
  common: {
    farmgaze: "FarmGaze",
    home: "Home",
    about: "About",
    contact: "Contact",
    services: "Services",
    products: "Products", 
    maps: "Maps",
    weather: "Weather",
    information: "Information",
    chatbot: "Chatbot",
    aiRecommendation: "AI Recommendation",
  },
  home: {
    title: "Smart Irrigation for Precision Farming",
    subtitle: "FarmGaze",
    description: "Optimize your farming operations with data-driven insights and intelligent irrigation solutions",
    getStarted: "Get Started",
    learnMore: "Learn More",
    keyFeatures: "Key Features",
    keyFeaturesDesc: "Discover how FarmGaze can transform your farming operations with advanced features",
    features: {
      smartIrrigation: {
        title: "Smart Irrigation",
        description: "Automated irrigation systems that optimize water usage based on real-time data"
      },
      dataAnalytics: {
        title: "Data Analytics", 
        description: "Comprehensive data analysis tools to track and improve farm performance"
      },
      weatherMonitoring: {
        title: "Weather Monitoring",
        description: "Real-time weather data integration for better decision making"
      },
      cropHealth: {
        title: "Crop Health",
        description: "Monitor and maintain optimal crop health with advanced tracking"
      },
      fieldMapping: {
        title: "Field Mapping",
        description: "Detailed field mapping and area management tools"
      },
      performanceTracking: {
        title: "Performance Tracking",
        description: "Track and analyze farm performance metrics over time"
      },
      systemIntegration: {
        title: "System Integration",
        description: "Seamless integration with existing farm management systems"
      },
      dataSecurity: {
        title: "Data Security",
        description: "Enterprise-grade security for your farm data"
      }
    }
  },
  aiRecommendation: {
    title: "AI Crop Recommendation",
    description: "Get intelligent district-specific crop suggestions using our enhanced 5-season agricultural system. Our AI analyzes historical cultivation data, real-time weather, and climate patterns across 12,000+ districts in India.",
    selectLocation: "Select Your Location",
    selectLocationDesc: "Choose your state, district, and season (optional) to get personalized crop recommendations",
    state: "State",
    district: "District",
    season: "Season",
    seasonAdv: "Season (Advanced)",
    autoDetect: "🤖 Auto-Detect",
    getRecommendations: "Get Recommendations",
    analyzing: "Analyzing...",
    currentConditions: "Current Conditions",
    currentSeason: "Current Season", 
    weatherConditions: "Weather Conditions",
    precipitation: "Precipitation",
    recommendedCrops: "Recommended Crops",
    seasonSuitability: "Season Suitability:",
    whyThisCrop: "Why this crop:",
    currentWeatherFactors: "Current Weather Factors:",
    temperature: "Temperature",
    humidity: "Humidity",
    rainfallForecast: "Rainfall Forecast",
    proTips: "💡 Pro Tips:",
    readyToStart: "Ready to Get Started?",
    readyToStartDesc: "Select your location above to receive AI-powered crop recommendations tailored to your area's unique agricultural conditions.",
    confidence: "confidence",
    match: "match",
    high: "high",
    medium: "medium",
    low: "low",
  }
};

// Hindi translations
const hiTranslations: Translations = {
  common: {
    farmgaze: "फार्मगेज़",
    home: "होम",
    about: "हमारे बारे में",
    contact: "संपर्क करें",
    services: "सेवाएँ",
    products: "उत्पाद", 
    maps: "मानचित्र",
    weather: "मौसम",
    information: "जानकारी",
    chatbot: "चैटबॉट",
    aiRecommendation: "एआई अनुशंसा",
  },
  home: {
    title: "सटीक खेती के लिए स्मार्ट सिंचाई",
    subtitle: "फार्मगेज़",
    description: "डेटा-संचालित अंतर्दृष्टि और बुद्धिमान सिंचाई समाधान के साथ अपने कृषि ऑपरेशन को अनुकूलित करें",
    getStarted: "शुरू करें",
    learnMore: "और जानें",
    keyFeatures: "मुख्य विशेषताएँ",
    keyFeaturesDesc: "उन्नत विशेषताओं के साथ फार्मगेज़ के साथ अपने कृषि ऑपरेशन को कैसे बदला जा सकता है, इसे खोजें",
    features: {
      smartIrrigation: {
        title: "स्मार्ट सिंचाई",
        description: "वास्तविक समय के डेटा के आधार पर पानी के उपयोग को अनुकूलित करने वाले स्वचालित सिंचाई प्रणाली"
      },
      dataAnalytics: {
        title: "डेटा विश्लेषण", 
        description: "खेती के प्रदर्शन को ट्रैक और सुधारने के लिए व्यापक डेटा विश्लेषण उपकरण"
      },
      weatherMonitoring: {
        title: "मौसम निगरानी",
        description: "बेहतर निर्णय लेने के लिए वास्तविक समय के मौसम डेटा एकीकरण"
      },
      cropHealth: {
        title: "फसल स्वास्थ्य",
        description: "उन्नत ट्रैकिंग के साथ इष्टतम फसल स्वास्थ्य की निगरानी और रखरखाव"
      },
      fieldMapping: {
        title: "क्षेत्र मानचित्रण",
        description: "विस्तृत क्षेत्र मानचित्रण और क्षेत्र प्रबंधन उपकरण"
      },
      performanceTracking: {
        title: "प्रदर्शन ट्रैकिंग",
        description: "समय के साथ खेती के प्रदर्शन मेंट्रिक्स को ट्रैक और विश्लेषण करें"
      },
      systemIntegration: {
        title: "प्रणाली एकीकरण",
        description: "मौजूदा खेती प्रबंधन प्रणालियों के साथ सहज एकीकरण"
      },
      dataSecurity: {
        title: "डेटा सुरक्षा",
        description: "आपके खेती डेटा के लिए एंटरप्राइज़-ग्रेड सुरक्षा"
      }
    }
  },
  aiRecommendation: {
    title: "एआई फसल अनुशंसा",
    description: "हमारे सुधारित 5-मौसम कृषि प्रणाली का उपयोग करके जिला-विशिष्ट फसल सुझाव प्राप्त करें। हमारा एआई 12,000+ भारतीय जिलों में ऐतिहासिक खेती डेटा, वास्तविक समय के मौसम और जलवायु पैटर्न का विश्लेषण करता है।",
    selectLocation: "अपना स्थान चुनें",
    selectLocationDesc: "व्यक्तिगत फसल सुझाव प्राप्त करने के लिए अपना राज्य, जिला और मौसम (वैकल्पिक) चुनें",
    state: "राज्य",
    district: "जिला",
    season: "मौसम",
    seasonAdv: "मौसम (उन्नत)",
    autoDetect: "🤖 स्वतः पहचान",
    getRecommendations: "अनुशंसाएँ प्राप्त करें",
    analyzing: "विश्लेषण कर रहा है...",
    currentConditions: "वर्तमान स्थितियाँ",
    currentSeason: "वर्तमान मौसम", 
    weatherConditions: "मौसम की स्थितियाँ",
    precipitation: "वर्षा",
    recommendedCrops: "अनुशंसित फसलें",
    seasonSuitability: "मौसम अनुकूलता:",
    whyThisCrop: "यह फसल क्यों:",
    currentWeatherFactors: "वर्तमान मौसम कारक:",
    temperature: "तापमान",
    humidity: "आर्द्रता",
    rainfallForecast: "वर्षा पूर्वानुमान",
    proTips: "💡 पेशेवर युक्तियाँ:",
    readyToStart: "शुरू करने के लिए तैयार हैं?",
    readyToStartDesc: "अपने क्षेत्र की अद्वितीय कृषि स्थितियों के अनुकूल एआई-संचालित फसल सुझाव प्राप्त करने के लिए ऊपर अपना स्थान चुनें।",
    confidence: "आत्मविश्वास",
    match: "मेल",
    high: "उच्च",
    medium: "मध्यम",
    low: "कम",
  }
};

export const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
}>({
  language: 'en',
  setLanguage: () => {},
  t: enTranslations,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = language === 'en' ? enTranslations : hiTranslations;

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};