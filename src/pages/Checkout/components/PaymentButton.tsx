import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { formatPrice } from '../../../utils/formatters';

interface PaymentButtonProps {
  isEnabled: boolean;
  total: number;
  onSuccess: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ isEnabled, total, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    onSuccess();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <button
        onClick={handlePayment}
        disabled={!isEnabled || loading}
        className={`w-full h-16 text-xl font-semibold rounded-lg flex items-center justify-center gap-3 transition-all ${
          isEnabled
            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={24} />
            Processing...
          </>
        ) : (
          <>
            <Check size={24} />
            Pay {formatPrice(total)}
          </>
        )}
      </button>
      {!isEnabled && (
        <p className="text-sm text-gray-500 text-center mt-3">
          Please complete shipping information first
        </p>
      )}
    </div>
  );
};

export default PaymentButton;