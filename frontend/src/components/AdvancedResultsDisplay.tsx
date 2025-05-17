import React, { useState } from 'react';
import { DepreciationResponse } from '../types/calculator';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import EmailReportModal from './EmailReportModal';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AdvancedResultsDisplayProps {
  results: DepreciationResponse;
  onBack: () => void;
}

const AdvancedResultsDisplay: React.FC<AdvancedResultsDisplayProps> = ({ results, onBack }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'yearly' | 'cashflow'>('summary');
  const [showEmailModal, setShowEmailModal] = useState(false);
  
  // Prepare data for chart display
  const yearsToShow = 10; // Show first 10 years in chart
  
  const chartData = {
    labels: results.yearly_breakdown.slice(0, yearsToShow).map(item => `Year ${item.year}`),
    datasets: [
      {
        label: 'Diminishing Value Method',
        data: results.yearly_breakdown.slice(0, yearsToShow).map(item => item.diminishing_value),
        backgroundColor: 'rgba(232, 119, 34, 0.7)', // accent color
      },
      {
        label: 'Prime Cost Method',
        data: results.yearly_breakdown.slice(0, yearsToShow).map(item => item.prime_cost),
        backgroundColor: 'rgba(26, 108, 195, 0.7)', // primary color
      },
      {
        label: 'Capital Works',
        data: results.yearly_breakdown.slice(0, yearsToShow).map(item => item.capital_works),
        backgroundColor: 'rgba(75, 192, 192, 0.7)', // teal color for variety
      }
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `$${value.toLocaleString()}`,
        }
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    }
  };

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);
  };
  
  // Calculate total depreciation over 40 years
  const totalDepreciation = results.yearly_breakdown.reduce((total, year) => total + year.total, 0);
  
  // Calculate percentage of purchase price that is depreciable
  const depreciablePercentage = (totalDepreciation / results.purchase_price) * 100;

  const handlePrintReport = () => {
    window.print();
  };

  const handleEmailReport = () => {
    setShowEmailModal(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header with summary */}
      <div className="bg-accent-500 text-white p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Depreciation Schedule</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleEmailReport}
              className="px-4 py-2 rounded-md bg-white text-accent-500 hover:bg-white/90 transition-colors"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Report
              </span>
            </button>
            <button
              onClick={handlePrintReport}
              className="px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 transition-colors text-white"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </span>
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 transition-colors text-white"
            >
              Back
            </button>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-white/70 text-sm">First Year Deduction</div>
            <div className="text-2xl font-bold mt-1">{formatCurrency(results.first_year_depreciation)}</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-white/70 text-sm">First 5 Years</div>
            <div className="text-2xl font-bold mt-1">{formatCurrency(results.five_year_depreciation)}</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-white/70 text-sm">Total Depreciable Amount</div>
            <div className="text-2xl font-bold mt-1">{formatCurrency(results.total_depreciable_amount)}</div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {[
            { id: 'summary', label: 'Summary' },
            { id: 'yearly', label: 'Yearly Breakdown' },
            { id: 'cashflow', label: 'Cash Flow Analysis' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? 'border-accent-500 text-accent-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Chart section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">10-Year Depreciation Forecast</h3>
                <div className="h-80">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
              
              {/* Key statistics */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Key Depreciation Statistics</h3>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">Property Type</div>
                        <div className="text-lg font-medium mt-1 capitalize">
                          {results.property_type.replace('_', ' ')}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Purchase Price</div>
                        <div className="text-lg font-medium mt-1">
                          {formatCurrency(results.purchase_price)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-500">Depreciable Amount</div>
                        <div className="text-lg font-medium mt-1">
                          {formatCurrency(results.total_depreciable_amount)}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-500">% of Purchase Price</div>
                        <div className="text-lg font-medium mt-1">
                          {depreciablePercentage.toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-500">Year 1 Cash Impact</div>
                        <div className="text-lg font-medium mt-1">
                          {formatCurrency(results.first_year_depreciation * 0.32)} <span className="text-xs text-gray-500">(32% tax rate)</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-500">5-Year Cash Impact</div>
                        <div className="text-lg font-medium mt-1">
                          {formatCurrency(results.five_year_depreciation * 0.32)} <span className="text-xs text-gray-500">(32% tax rate)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-accent-50 rounded-lg p-4 border-l-4 border-accent-500">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-accent-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-accent-800">Recommended Method</h3>
                        <div className="mt-2 text-sm text-accent-700">
                          <p>
                            For this property profile, we recommend the <strong>Diminishing Value Method</strong> for the highest deductions in the early years, maximizing your immediate tax benefits.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Yearly Breakdown Tab */}
        {activeTab === 'yearly' && (
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diminishing Value
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prime Cost
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capital Works
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tax Saving
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.yearly_breakdown.slice(0, 25).map((yearData) => (
                    <tr key={yearData.year} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Year {yearData.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(yearData.diminishing_value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(yearData.prime_cost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(yearData.capital_works)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(yearData.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-accent-600 font-medium">
                        {formatCurrency(yearData.total * 0.32)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-md text-sm text-gray-500">
              <p>* Tax savings calculated at a marginal tax rate of 32%. Actual tax savings may vary based on your individual tax situation.</p>
              <p>* This table shows the first 25 years. The full schedule covers 40 years.</p>
            </div>
          </div>
        )}
        
        {/* Cash Flow Analysis Tab */}
        {activeTab === 'cashflow' && (
          <div>
            <div className="mb-6 bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Cash Flow Analysis Preview</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      This feature will provide a detailed analysis of your property's cash flow including rental income, mortgage payments, and tax savings from depreciation. Currently in preview mode with example data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Annual Cash Flow Summary</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Annual Rental Income</span>
                      <span className="text-lg font-medium">{formatCurrency(450 * 52)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Annual Mortgage Payments</span>
                      <span className="text-lg font-medium text-red-600">-{formatCurrency(30000)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Maintenance & Expenses</span>
                      <span className="text-lg font-medium text-red-600">-{formatCurrency(5000)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Property Management</span>
                      <span className="text-lg font-medium text-red-600">-{formatCurrency(2300)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Tax Savings from Depreciation</span>
                      <span className="text-lg font-medium text-green-600">+{formatCurrency(results.first_year_depreciation * 0.32)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-accent-50 rounded-lg p-4 border-t-2 border-accent-500">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-medium">Net Annual Cash Flow</span>
                      <span className="text-xl font-bold text-accent-700">
                        {formatCurrency((450 * 52) - 30000 - 5000 - 2300 + (results.first_year_depreciation * 0.32))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Key Investment Metrics</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Gross Yield</div>
                    <div className="text-lg font-medium mt-1">5.4%</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Net Yield</div>
                    <div className="text-lg font-medium mt-1">3.8%</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Cash-on-Cash Return</div>
                    <div className="text-lg font-medium mt-1">4.2%</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Cap Rate</div>
                    <div className="text-lg font-medium mt-1">4.6%</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Depreciation Impact</h3>
                  <div className="bg-accent-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 mb-2">
                      Depreciation tax benefits improve your cash flow by <strong>{formatCurrency(results.first_year_depreciation * 0.32)}</strong> in the first year, effectively boosting your net yield by <strong>0.7%</strong>.
                    </p>
                    <p className="text-sm text-gray-700">
                      Over 5 years, the total tax savings from depreciation are estimated at <strong>{formatCurrency(results.five_year_depreciation * 0.32)}</strong>, significantly enhancing your investment returns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Email Modal */}
      <EmailReportModal 
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        report={results}
      />
    </div>
  );
};

export default AdvancedResultsDisplay; 