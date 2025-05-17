import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { calculateDepreciation } from '../services/calculatorService';
import { PropertyType, AssetCategory, DepreciationResponse } from '../types/calculator';

interface CalculatorFormProps {
  setResults: React.Dispatch<React.SetStateAction<DepreciationResponse | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ 
  setResults, 
  isLoading, 
  setIsLoading 
}) => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      property_type: PropertyType.RESIDENTIAL,
      construction_date: new Date(new Date().getFullYear() - 10, 0, 1),
      purchase_date: new Date(),
      purchase_price: 650000,
      is_new_property: false,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
      
      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type
        </label>
        <select
          {...register("property_type")}
          className="input px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value={PropertyType.RESIDENTIAL}>Residential</option>
          <option value={PropertyType.COMMERCIAL}>Commercial</option>
          <option value={PropertyType.INDUSTRIAL}>Industrial</option>
        </select>
      </div>
      
      {/* Purchase Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Purchase Price
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
          <input
            type="number"
            {...register("purchase_price", { required: true, min: 1 })}
            className="input px-4 py-2 pl-8 border border-gray-300 rounded-md"
          />
        </div>
        {errors.purchase_price && (
          <p className="text-red-500 text-sm mt-1">Please enter a valid purchase price</p>
        )}
      </div>
      
      {/* Construction Date */}
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
              className="input px-4 py-2 border border-gray-300 rounded-md w-full"
              maxDate={new Date()}
              showYearDropdown
              dateFormat="dd/MM/yyyy"
            />
          )}
        />
      </div>
      
      {/* Purchase Date */}
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
              className="input px-4 py-2 border border-gray-300 rounded-md w-full"
              maxDate={new Date()}
              showYearDropdown
              dateFormat="dd/MM/yyyy"
            />
          )}
        />
      </div>
      
      {/* Is New Property */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_new_property"
          {...register("is_new_property")}
          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="is_new_property" className="ml-2 block text-sm text-gray-700">
          This is a brand new property
        </label>
      </div>
      
      {/* Assets Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Assets</h2>
        
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Asset {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
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
                    className="input px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                {/* Asset Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                    <input
                      type="number"
                      {...register(`assets.${index}.value` as const, { required: true, min: 1 })}
                      className="input px-4 py-2 pl-8 border border-gray-300 rounded-md"
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
                    className="input px-4 py-2 border border-gray-300 rounded-md"
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
                      className="input px-4 py-2 border border-gray-300 rounded-md"
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
          className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Add Asset
        </button>
      </div>
      
      <div className="pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {isLoading ? 'Calculating...' : 'Calculate Depreciation'}
        </button>
      </div>
    </form>
  );
};

export default CalculatorForm; 