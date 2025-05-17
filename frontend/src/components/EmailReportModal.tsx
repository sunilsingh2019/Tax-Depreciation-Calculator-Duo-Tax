import React, { useState } from 'react';
import { DepreciationResponse } from '../types/calculator';
import { sendReportByEmail, validateEmail } from '../services/emailService';

interface EmailReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: DepreciationResponse;
}

const EmailReportModal: React.FC<EmailReportModalProps> = ({ isOpen, onClose, report }) => {
  const [email, setEmail] = useState<string>('sunil.singh.programmer@gmail.com');
  const [name, setName] = useState<string>('');
  const [includeAttachment, setIncludeAttachment] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await sendReportByEmail({
        email,
        name,
        report,
        includeAttachment
      });
      
      if (result.success) {
        setSuccess(true);
        // Don't clear the email if it's successful
        setName('');
        // Auto close after 5 seconds on success
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 5000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="bg-white rounded-lg w-full max-w-md z-10 shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Email Your Depreciation Report
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Demo Notice */}
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Demo Mode Information</p>
            <p className="text-sm mt-1">This demonstration is configured to use a real Gmail account. For the email to be sent, you need to:</p>
            <ol className="text-sm list-decimal pl-5 mt-1">
              <li>Configure a valid Gmail app password in the backend</li>
              <li>Enter a valid email address that can receive mail</li>
            </ol>
            <p className="text-sm mt-1">Check spam folders if you don't see the email in your inbox.</p>
          </div>
          
          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              <p className="font-medium">Report processing completed!</p>
              <p className="text-sm mt-1">Your report has been processed and an email has been sent to {email}. The window will close automatically in a few seconds.</p>
              <p className="text-sm mt-2">If you don't receive the email, please check:</p>
              <ul className="text-sm list-disc pl-5">
                <li>Your spam/junk folder</li>
                <li>That the backend has been configured with a valid Gmail app password</li>
              </ul>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address*
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name (Optional)
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                  placeholder="John Smith"
                />
              </div>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeAttachment}
                    onChange={() => setIncludeAttachment(!includeAttachment)}
                    className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Include PDF report as attachment
                  </span>
                </label>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Send Report'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailReportModal; 