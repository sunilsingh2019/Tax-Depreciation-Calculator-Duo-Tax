import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DepreciationResponse } from '../types/calculator';

interface ResultsDisplayProps {
  results: DepreciationResponse | null;
  isLoading: boolean;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">Calculating depreciation...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-center">
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-medium text-gray-700 mb-2">No Results Yet</h3>
        <p className="text-gray-500 max-w-sm">
          Fill out the calculator form and submit to see your potential tax depreciation benefits.
        </p>
      </div>
    );
  }

  // Prepare chart data for the first 10 years
  const chartData = results.yearly_breakdown
    .slice(0, 10)
    .map(year => ({
      name: `Year ${year.year}`,
      'Diminishing Value': year.diminishing_value,
      'Prime Cost': year.prime_cost,
      'Capital Works': year.capital_works,
    }));

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Depreciation Results</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
          <p className="text-primary-800 text-sm font-medium mb-1">First Year Deduction</p>
          <p className="text-3xl font-bold text-primary-700">{formatCurrency(results.first_year_depreciation)}</p>
        </div>
        
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
          <p className="text-primary-800 text-sm font-medium mb-1">Five Year Deduction</p>
          <p className="text-3xl font-bold text-primary-700">{formatCurrency(results.five_year_depreciation)}</p>
        </div>
        
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
          <p className="text-primary-800 text-sm font-medium mb-1">Total Deductions</p>
          <p className="text-3xl font-bold text-primary-700">{formatCurrency(results.total_depreciable_amount)}</p>
        </div>
      </div>
      
      {/* Depreciation Chart */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">10 Year Depreciation Forecast</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => [`${formatCurrency(value)}`, '']} />
              <Legend />
              <Bar dataKey="Diminishing Value" fill="#1a6cc3" />
              <Bar dataKey="Prime Cost" fill="#124380" />
              <Bar dataKey="Capital Works" fill="#e87722" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Yearly Breakdown Table */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Yearly Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diminishing Value</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prime Cost</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capital Works</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.yearly_breakdown.slice(0, 10).map((year) => (
                <tr key={year.year}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Year {year.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(year.diminishing_value)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(year.prime_cost)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(year.capital_works)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">{formatCurrency(year.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Tax Savings Info */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Estimated Tax Savings</h3>
        <p className="text-gray-600 mb-4">
          Based on a marginal tax rate of 32.5%, your potential tax savings could be approximately:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-1">First Year Savings</p>
            <p className="text-2xl font-bold text-accent-500">{formatCurrency(results.first_year_depreciation * 0.325)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-1">Five Year Savings</p>
            <p className="text-2xl font-bold text-accent-500">{formatCurrency(results.five_year_depreciation * 0.325)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-1">Total Lifetime Savings</p>
            <p className="text-2xl font-bold text-accent-500">{formatCurrency(results.total_depreciable_amount * 0.325)}</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Note: This is an estimate only. Consult with a tax professional for personalized advice.
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay; 