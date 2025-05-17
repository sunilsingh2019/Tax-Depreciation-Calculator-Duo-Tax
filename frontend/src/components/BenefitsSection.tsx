import React from 'react';
import { BenefitsSectionProps } from '../types/components';

const BenefitsSection: React.FC<BenefitsSectionProps> = () => {
  return (
    <section id="benefits" className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Benefits of Tax Depreciation
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Claiming depreciation can significantly reduce your taxable income from investment properties
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          {/* Benefit 1 */}
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent-500 text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Maximize Tax Deductions
              </h3>
              <p className="text-gray-600">
                By claiming depreciation, you can significantly reduce your taxable income, potentially saving thousands of dollars each year.
              </p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent-500 text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Higher Cash Flow
              </h3>
              <p className="text-gray-600">
                Improved cash flow due to lower tax payments can help you manage your investment property more effectively.
              </p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent-500 text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Improved Investment Returns
              </h3>
              <p className="text-gray-600">
                Claiming all available deductions leads to better overall investment performance and return on investment.
              </p>
            </div>
          </div>

          {/* Benefit 4 */}
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent-500 text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Claim for Both New and Old Properties
              </h3>
              <p className="text-gray-600">
                Even if you've owned your property for several years, you can still benefit from depreciation claims on qualifying assets.
              </p>
            </div>
          </div>

          {/* Benefit 5 */}
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent-500 text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                ATO Compliant Documentation
              </h3>
              <p className="text-gray-600">
                Having proper depreciation schedules helps ensure compliance with ATO regulations and supports your tax claims.
              </p>
            </div>
          </div>

          {/* Benefit 6 */}
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent-500 text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Expert Guidance
              </h3>
              <p className="text-gray-600">
                Using Duo Tax's depreciation calculator gives you access to insights based on years of industry experience and expertise.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-xl font-semibold text-gray-800 mb-2">
              "The average property investor can claim between $5,000 and $10,000 in depreciation deductions in the first year alone."
            </p>
            <p className="text-gray-600 italic">
              - Australian Taxation Office
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection; 