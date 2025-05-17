import axios from 'axios';
import { DepreciationRequest, DepreciationResponse } from '../types/calculator';
import { format } from 'date-fns';

// API base URL
const API_BASE_URL = '/api/v1';

// Format date for API (YYYY-MM-DD)
const formatDateForApi = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const calculateDepreciation = async (formData: DepreciationRequest): Promise<DepreciationResponse> => {
  try {
    // Format the dates for the API
    const apiData = {
      ...formData,
      construction_date: formatDateForApi(formData.construction_date),
      purchase_date: formatDateForApi(formData.purchase_date),
    };

    console.log('Calling calculation API at:', `${API_BASE_URL}/calculate`);
    console.log('API request data:', apiData);

    const response = await axios.post(`${API_BASE_URL}/calculate`, apiData);
    console.log('Calculation API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error calculating depreciation:', error);
    
    // If we're in development mode and the backend isn't running,
    // return mock data for testing the UI
    if (import.meta.env.DEV && 
        (axios.isAxiosError(error) && (error.code === 'ECONNREFUSED' || error.response?.status === 404))) {
      console.log('Using mock data due to API error');
      return getMockResults(formData);
    }
    
    throw new Error(
      axios.isAxiosError(error) && error.response?.data?.detail
        ? error.response.data.detail
        : 'Could not calculate depreciation. Please try again.'
    );
  }
};

// Mock data for development when backend isn't available
const getMockResults = (formData: DepreciationRequest): DepreciationResponse => {
  const yearlyBreakdown = [];
  const baseCapitalWorks = formData.purchase_price * 0.7 * 0.025; // 2.5% of building value
  const totalPlantValue = formData.assets.reduce((sum, asset) => sum + asset.value, 0);
  
  // Generate mock data for 40 years
  for (let year = 1; year <= 40; year++) {
    // Simplified calculations for mock data
    const diminishingValue = totalPlantValue * (0.2 / year);
    const primeCost = totalPlantValue * 0.1;
    
    yearlyBreakdown.push({
      year,
      diminishing_value: diminishingValue,
      prime_cost: primeCost,
      capital_works: baseCapitalWorks,
      total: Math.max(diminishingValue, primeCost) + baseCapitalWorks
    });
  }
  
  return {
    property_type: formData.property_type,
    purchase_price: formData.purchase_price,
    total_depreciable_amount: formData.purchase_price * 0.8,
    yearly_breakdown: yearlyBreakdown,
    first_year_depreciation: yearlyBreakdown[0].total,
    five_year_depreciation: yearlyBreakdown.slice(0, 5).reduce((sum, item) => sum + item.total, 0)
  };
}; 