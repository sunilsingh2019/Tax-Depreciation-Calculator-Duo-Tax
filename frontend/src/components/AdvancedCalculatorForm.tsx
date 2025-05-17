import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { calculateDepreciation } from '../services/calculatorService';
import { PropertyType, AssetCategory, DepreciationResponse } from '../types/calculator';

interface AdvancedCalculatorFormProps {
  setResults: React.Dispatch<React.SetStateAction<DepreciationResponse | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdvancedCalculatorForm: React.FC<AdvancedCalculatorFormProps> = ({ 
  setResults, 
  isLoading, 
  setIsLoading 
}) => {
  const [activeTab, setActiveTab] = useState<'property' | 'assets' | 'additional'>('property');
  const [animateSlide, setAnimateSlide] = useState(false);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      property_type: PropertyType.RESIDENTIAL,
      construction_date: new Date(new Date().getFullYear() - 10, 0, 1),
      purchase_date: new Date(),
      purchase_price: 650000,
      land_value: 250000, // New field for advanced calculator
      is_new_property: false,
      rental_income: 450, // Weekly rental income
      interest_rate: 5.5, // Loan interest rate
      loan_term: 30, // Loan term in years
      downpayment: 130000, // Downpayment amount
      assets: [
        { name: "Carpet", category: AssetCategory.PLANT_EQUIPMENT, value: 5000, effective_life: 8 },
        { name: "Blinds", category: AssetCategory.PLANT_EQUIPMENT, value: 2500, effective_life: 10 },
        { name: "Air Conditioning", category: AssetCategory.PLANT_EQUIPMENT, value: 8000, effective_life: 10 }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "assets"
  });

  const watchPropertyType = watch("property_type");
  const watchPurchasePrice = watch("purchase_price");
  const watchLandValue = watch("land_value");

  // Calculate building value
  const buildingValue = watchPurchasePrice - watchLandValue;

  const handleTabChange = (tab: 'property' | 'assets' | 'additional') => {
    setAnimateSlide(true);
    setTimeout(() => {
      setActiveTab(tab);
      setAnimateSlide(false);
    }, 300);
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const results = await calculateDepreciation(data);
      setResults(results);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to calculate depreciation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const propertyTypes = [
    { value: PropertyType.RESIDENTIAL, label: 'Residential', icon: '🏠' },
    { value: PropertyType.COMMERCIAL, label: 'Commercial', icon: '🏢' },
    { value: PropertyType.INDUSTRIAL, label: 'Industrial', icon: '🏭' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Tab Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container-custom">
          <nav className="flex -mb-px">
            {[
              { id: 'property', label: 'Property Details' },
              { id: 'assets', label: 'Assets & Features' },
              { id: 'additional', label: 'Financial Details' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
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
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="container-custom py-8">
        <div className={`transition-all duration-300 transform ${animateSlide ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
          {/* Property Details Tab */}
          {activeTab === 'property' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Property Details</h2>
              
              {/* Property Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Property Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {propertyTypes.map((type) => (
                    <label 
                      key={type.value}
                      className={`
                        flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors
                        ${watchPropertyType === type.value 
                          ? 'border-accent-500 bg-accent-50 text-accent-700' 
                          : 'border-gray-200 hover:bg-gray-50'}
                      `}
                    >
                      <input
                        type="radio"
                        value={type.value}
                        {...register("property_type")}
                        className="sr-only"
                      />
                      <span className="text-2xl mr-3">{type.icon}</span>
                      <span className="font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Purchase Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Price
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      {...register("purchase_price", { required: true, min: 1 })}
                      className="focus:ring-accent-500 focus:border-accent-500 block w-full pl-8 pr-4 py-3 border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  </div>
                  {errors.purchase_price && (
                    <p className="text-red-500 text-sm mt-1">Please enter a valid purchase price</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Land Value
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      {...register("land_value", { required: true, min: 0 })}
                      className="focus:ring-accent-500 focus:border-accent-500 block w-full pl-8 pr-4 py-3 border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Building Value Display */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <span className="text-gray-700">Building Value (Depreciable)</span>
                <span className="text-lg font-medium text-gray-900">
                  ${buildingValue > 0 ? buildingValue.toLocaleString() : 0}
                </span>
              </div>
              
              {/* Date Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Construction Date
                  </label>
                  <Controller
                    control={control}
                    name="construction_date"
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        className="focus:ring-accent-500 focus:border-accent-500 block w-full py-3 px-4 border-gray-300 rounded-md"
                        maxDate={new Date()}
                        showYearDropdown
                        dateFormat="dd/MM/yyyy"
                      />
                    )}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Date
                  </label>
                  <Controller
                    control={control}
                    name="purchase_date"
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        className="focus:ring-accent-500 focus:border-accent-500 block w-full py-3 px-4 border-gray-300 rounded-md"
                        maxDate={new Date()}
                        showYearDropdown
                        dateFormat="dd/MM/yyyy"
                      />
                    )}
                  />
                </div>
              </div>
              
              {/* Is New Property Checkbox */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="is_new_property"
                    {...register("is_new_property")}
                    className="focus:ring-accent-500 h-5 w-5 text-accent-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="is_new_property" className="font-medium text-gray-700">
                    This is a brand new property
                  </label>
                  <p className="text-gray-500">Check this if the property has never been occupied before purchase</p>
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleTabChange('assets')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
                >
                  Next: Assets
                  <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {/* Assets Tab */}
          {activeTab === 'assets' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Assets & Features</h2>
              
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="bg-gray-50 rounded-lg p-6 transition-all hover:shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {watch(`assets.${index}.name`) || `Asset ${index + 1}`}
                      </h3>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Asset Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Asset Name
                        </label>
                        <input
                          {...register(`assets.${index}.name` as const, { required: true })}
                          className="focus:ring-accent-500 focus:border-accent-500 block w-full rounded-md border-gray-300 py-3 px-4"
                          placeholder="e.g. Carpet, Blinds, Air Conditioning"
                        />
                      </div>
                      
                      {/* Asset Value */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Value
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">$</span>
                          </div>
                          <input
                            type="number"
                            {...register(`assets.${index}.value` as const, { required: true, min: 1 })}
                            className="focus:ring-accent-500 focus:border-accent-500 block w-full pl-8 py-3 border-gray-300 rounded-md"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      
                      {/* Asset Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          {...register(`assets.${index}.category` as const)}
                          className="focus:ring-accent-500 focus:border-accent-500 block w-full py-3 pl-3 pr-10 border-gray-300 rounded-md"
                        >
                          <option value={AssetCategory.PLANT_EQUIPMENT}>Plant & Equipment</option>
                          <option value={AssetCategory.CAPITAL_WORKS}>Capital Works</option>
                        </select>
                      </div>
                      
                      {/* Effective Life (only for Plant & Equipment) */}
                      {watch(`assets.${index}.category`) === AssetCategory.PLANT_EQUIPMENT && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Effective Life (years)
                          </label>
                          <input
                            type="number"
                            {...register(`assets.${index}.effective_life` as const, { min: 1, max: 40 })}
                            className="focus:ring-accent-500 focus:border-accent-500 block w-full py-3 px-4 border-gray-300 rounded-md"
                            placeholder="10"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={() => append({
                  name: "",
                  category: AssetCategory.PLANT_EQUIPMENT,
                  value: 0,
                  effective_life: 10
                })}
                className="inline-flex items-center px-5 py-2 border border-accent-300 bg-white rounded-md shadow-sm text-sm font-medium text-accent-700 hover:bg-accent-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-accent-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Asset
              </button>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => handleTabChange('property')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
                >
                  <svg className="mr-2 -ml-1 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('additional')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
                >
                  Next
                  <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {/* Additional Details Tab */}
          {activeTab === 'additional' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Financial Details</h2>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700">
                      These additional financial details help provide a more comprehensive investment analysis but are optional.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Income */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Rental Income</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weekly Rental Income
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="number"
                        {...register("rental_income", { min: 0 })}
                        className="focus:ring-accent-500 focus:border-accent-500 block w-full pl-8 py-3 border-gray-300 rounded-md"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Loan Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("interest_rate", { min: 0, max: 20 })}
                      className="focus:ring-accent-500 focus:border-accent-500 block w-full py-3 px-4 border-gray-300 rounded-md"
                      placeholder="5.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Term (years)
                    </label>
                    <input
                      type="number"
                      {...register("loan_term", { min: 1, max: 40 })}
                      className="focus:ring-accent-500 focus:border-accent-500 block w-full py-3 px-4 border-gray-300 rounded-md"
                      placeholder="30"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Downpayment
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="number"
                        {...register("downpayment", { min: 0 })}
                        className="focus:ring-accent-500 focus:border-accent-500 block w-full pl-8 py-3 border-gray-300 rounded-md"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation and Submit */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => handleTabChange('assets')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
                >
                  <svg className="mr-2 -ml-1 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculating...
                    </>
                  ) : (
                    'Calculate Depreciation'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdvancedCalculatorForm; 