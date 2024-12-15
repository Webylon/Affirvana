import React from 'react';
import { CreditCard } from 'lucide-react';
import { formatPrice } from '../../../utils/format';

interface PaymentButtonProps {
  onSuccess: () => void;
  disabled: boolean;
  amount: number;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ onSuccess, disabled, amount }) => {
  const handleClick = async () => {
    try {
      // In a real application, this would integrate with a payment processor
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSuccess();
    } catch (error) {
      console.error('Payment processing error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Total to pay:</p>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(amount)}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium text-gray-900">Affirvana Balance</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Processing Time:</span>
            <span className="font-medium text-gray-900">Instant</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleClick}
        disabled={disabled}
        className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white 
          ${
            disabled
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
          }`}
      >
        <CreditCard className="mr-2 h-5 w-5" />
        {disabled ? 'Processing...' : 'Complete Purchase'}
      </button>

      <p className="mt-2 text-sm text-gray-500 text-center">
        By clicking "Complete Purchase" you agree to our terms of service and privacy policy.
      </p>
    </div>
  );
};

export default PaymentButton;