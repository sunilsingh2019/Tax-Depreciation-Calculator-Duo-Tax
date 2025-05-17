import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AdvancedCalculatorPage from './components/AdvancedCalculatorPage';
import Hero from './components/Hero';
// @ts-ignore - These components exist but TypeScript can't find the declarations
import FeaturesSection from './components/FeaturesSection';
// @ts-ignore - These components exist but TypeScript can't find the declarations
import BenefitsSection from './components/BenefitsSection';
// @ts-ignore - These components exist but TypeScript can't find the declarations
import CallToAction from './components/CallToAction';
import axios from 'axios';

const App: React.FC = () => {
  const [showCalculator, setShowCalculator] = useState<boolean>(false);

  // Scroll to the features section when Learn More is clicked
  const handleGetStarted = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open the calculator
  const handleOpenCalculator = () => {
    setShowCalculator(true);
  };

  // Go back to landing page
  const handleBackToLanding = () => {
    setShowCalculator(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {!showCalculator ? (
          <div>
            <Hero onGetStarted={handleGetStarted} onAdvancedCalculator={handleOpenCalculator} />
            <div id="features-section">
              <FeaturesSection />
            </div>
            <BenefitsSection />
            <CallToAction onGetStarted={handleOpenCalculator} />
            <div className="p-4 bg-gray-100 mb-4">
              <h3 className="text-lg font-bold mb-2">API Test</h3>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded" 
                onClick={async () => {
                  try {
                    // Test API connection
                    const debugResponse = await axios.get('/debug');
                    console.log('Debug response:', debugResponse.data);
                    alert('Debug endpoint response: ' + JSON.stringify(debugResponse.data, null, 2));
                    
                    // Test calculator endpoint
                    try {
                      const calcResponse = await axios.get('/api/v1/debug');
                      console.log('API v1 response:', calcResponse.data);
                    } catch (err) {
                      console.error('API v1 test failed:', err);
                    }
                  } catch (err) {
                    console.error('Debug test failed:', err);
                    alert('Debug test failed: ' + JSON.stringify(err, null, 2));
                  }
                }}
              >
                Test API Connection
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 py-8">
            <AdvancedCalculatorPage onClose={handleBackToLanding} />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default App; 