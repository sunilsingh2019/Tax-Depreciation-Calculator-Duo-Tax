import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-100 text-gray-800 shadow-md">
      <div className="container-custom flex items-center justify-between py-4">
        <div className="flex items-center">
          <img 
            src="/images/duo-tax-logo.svg" 
            alt="Duo Tax Logo" 
            className="h-12"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline font-medium">Australia's Leading Tax Depreciation Specialists</span>
          <div className="h-8 w-8 rounded-full bg-accent-500 flex items-center justify-center shadow-md hidden md:flex">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 