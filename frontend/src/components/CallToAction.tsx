import React from 'react';
import { CallToActionProps } from '../types/components';

const CallToAction: React.FC<CallToActionProps> = ({ onGetStarted }) => {
  return (
    <section className="py-16 md:py-20 bg-accent-500 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-white opacity-10 animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-80 h-80 rounded-full bg-white opacity-10 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      <div className="container-custom text-center relative z-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <span className="bg-white text-accent-500 px-4 py-1 rounded-full text-sm font-medium inline-block mb-4 md:mb-6">Ready for Tax Savings?</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Calculate Your Tax Depreciation Today
          </h2>
          <p className="text-lg md:text-xl text-white mb-6 md:mb-10">
            Get an instant estimate of your potential tax deductions and see how much you could save.
          </p>
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto bg-white text-accent-500 hover:bg-white/90 py-3 md:py-4 px-6 md:px-8 rounded-lg text-base md:text-lg font-medium shadow-xl hover:shadow-2xl transform transition duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            Open Calculator
          </button>
          
          <div className="mt-8 md:mt-10 py-4 md:py-6 px-4 md:px-8 bg-white/10 backdrop-blur-sm rounded-xl">
            <p className="text-sm md:text-base text-white">
              Using Duo Tax's calculator is quick, free, and gives you an immediate estimate of your property's potential tax deductions.
              For a comprehensive, ATO-compliant tax depreciation schedule, consider our professional depreciation report services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction; 