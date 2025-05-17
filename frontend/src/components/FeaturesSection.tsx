import React from 'react';
import { FeaturesSectionProps } from '../types/components';

const FeaturesSection: React.FC<FeaturesSectionProps> = () => {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Our Tax Depreciation Calculator Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our easy-to-use calculator helps property investors estimate potential tax deductions through depreciation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-50 rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 text-accent-500 rounded-full mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Input Property Details</h3>
            <p className="text-gray-600">
              Enter basic information about your property including purchase date, construction date, and property type
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-50 rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 text-accent-500 rounded-full mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Add Your Assets</h3>
            <p className="text-gray-600">
              Include plant & equipment assets and capital works items to maximize your potential deductions
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-50 rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 text-accent-500 rounded-full mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Your Results</h3>
            <p className="text-gray-600">
              View comprehensive depreciation schedules showing both diminishing value and prime cost methods
            </p>
          </div>
        </div>

        <div className="mt-16 bg-accent-50 rounded-lg p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-accent-500 mb-4">ATO Compliant Calculations</h3>
              <p className="text-gray-700 mb-4">
                Our tax depreciation calculator follows Australian Taxation Office guidelines to ensure your estimates are based on current legislation.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Division 43 Capital Works deductions</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Division 40 Plant & Equipment depreciation</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Low-value pool calculations</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-center">
              <img
                src="/images/ato-compliance.svg"
                alt="ATO Compliant Calculations"
                className="max-h-48"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 