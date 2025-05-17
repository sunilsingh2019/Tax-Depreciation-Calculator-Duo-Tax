import React, { useState } from 'react';
import AdvancedCalculatorForm from './AdvancedCalculatorForm';
import AdvancedResultsDisplay from './AdvancedResultsDisplay';
import { DepreciationResponse } from '../types/calculator';

interface AdvancedCalculatorPageProps {
  onClose: () => void;
}

const AdvancedCalculatorPage: React.FC<AdvancedCalculatorPageProps> = ({ onClose }) => {
  const [results, setResults] = useState<DepreciationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    setResults(null);
  };

  return (
    <div className="bg-gray-50 p-4 md:p-8 rounded-3xl max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Depreciation Calculator</h1>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {results ? (
        <AdvancedResultsDisplay results={results} onBack={handleBack} />
      ) : (
        <AdvancedCalculatorForm 
          setResults={setResults} 
          isLoading={isLoading} 
          setIsLoading={setIsLoading} 
        />
      )}
    </div>
  );
};

export default AdvancedCalculatorPage; 