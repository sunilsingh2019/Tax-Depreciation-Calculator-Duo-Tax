import axios from 'axios';
import { DepreciationResponse } from '../types/calculator';

// The backend API is accessible at /api with the proxy configuration
// The actual backend endpoints are at /api/v1/...
const API_BASE_URL = '/api/v1';

interface EmailReportOptions {
  email: string;
  name?: string;
  report: DepreciationResponse;
  includeAttachment: boolean;
}

/**
 * Send the depreciation report via email
 * @param options Email options including recipient and report data
 * @returns Promise with the email send result
 */
export const sendReportByEmail = async (options: EmailReportOptions): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Sending email to:', options.email);
    console.log('API URL:', `${API_BASE_URL}/email/send-report`);
    
    // First test if we can reach the test endpoint
    try {
      const testResponse = await axios.get(`${API_BASE_URL}/email/test`);
      console.log('Test endpoint response:', testResponse.data);
    } catch (testError) {
      console.error('Test endpoint failed:', testError);
    }
    
    // Now send the actual email
    console.log('Sending email with data:', { 
      to: options.email, 
      name: options.name || '', 
      includeAttachment: options.includeAttachment 
    });
    
    const response = await axios.post(`${API_BASE_URL}/email/send-report`, {
      to: options.email,
      name: options.name || '',
      report: options.report,
      includeAttachment: options.includeAttachment,
    });

    console.log('Email API response:', response.data);
    
    return {
      success: true,
      message: 'Email processed successfully. Due to demo limitations, actual delivery may not occur.'
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};

/**
 * Validates an email address format
 * @param email Email address to validate
 * @returns Boolean indicating if email is valid
 */
export const validateEmail = (email: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}; 