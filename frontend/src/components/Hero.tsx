import React, { useEffect, useState } from 'react';

interface HeroProps {
  onGetStarted: () => void;
  onAdvancedCalculator?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted, onAdvancedCalculator }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
  }, []);

  return (
    <section className="relative bg-gray-100 text-accent-500 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-accent-500 opacity-10 animate-pulse"></div>
        <div className="absolute top-60 -left-20 w-60 h-60 rounded-full bg-accent-500 opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 right-60 w-80 h-80 rounded-full bg-accent-500 opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container-custom py-24 md:py-32 pb-36 md:pb-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Main content with animations */}
          <div className={`space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div>
              <span className="bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">Australian Tax Specialists</span>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight text-gray-800">
                <span className="block">Property Tax</span>
                <span className="block mt-2">Depreciation Calculator</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-xl">
              Maximize your tax deductions with Duo Tax's calculator - Australia's leading tax depreciation specialists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {onAdvancedCalculator && (
                <button 
                  onClick={onAdvancedCalculator}
                  className="bg-accent-500 text-white hover:bg-accent-600 py-4 px-8 rounded-lg text-lg font-medium shadow-xl hover:shadow-2xl transform transition duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-opacity-50 w-full sm:w-auto"
                >
                  Basic Calculator
                </button>
              )}
              <button 
                onClick={onGetStarted} 
                className="bg-gray-700 text-white hover:bg-gray-800 py-4 px-8 rounded-lg text-lg font-medium shadow-xl hover:shadow-2xl transform transition duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50 w-full sm:w-auto"
              >
                Learn More
              </button>
            </div>
          </div>
          
          {/* Right column - Animated feature card */}
          <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent-500 text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold ml-4 text-gray-800">Maximize Your Savings</h2>
              </div>
              
              <ul className="space-y-5">
                <li className="flex items-start animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-lg text-gray-700">Uncover thousands in potential tax deductions</p>
                </li>
                <li className="flex items-start animate-fadeIn" style={{ animationDelay: '0.7s' }}>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-lg text-gray-700">Get instant estimates in seconds</p>
                </li>
                <li className="flex items-start animate-fadeIn" style={{ animationDelay: '0.9s' }}>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-lg text-gray-700">Comprehensive property analysis</p>
                </li>
                <li className="flex items-start animate-fadeIn" style={{ animationDelay: '1.1s' }}>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-lg text-gray-700">ATO compliant calculations</p>
                </li>
              </ul>
              
              <div className="mt-8 flex justify-center">
                <div className="py-2 px-4 bg-gray-100 rounded-lg text-center text-gray-600 text-sm flex items-center">
                  <svg className="w-5 h-5 text-accent-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ATO Compliant & Expert Reviewed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave svg divider */}
      <div className="absolute bottom-0 left-0 right-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160" className="w-full">
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,128L48,112C96,96,192,64,288,64C384,64,480,96,576,112C672,128,768,128,864,122.7C960,117,1056,107,1152,90.7C1248,75,1344,53,1392,42.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero; 