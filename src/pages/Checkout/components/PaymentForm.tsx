import React from 'react';
import { CreditCard, Lock } from 'lucide-react';

const PaymentForm: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="text-purple-600" size={24} />
        <h2 className="text-xl font-semibold">Payment Information</h2>
      </div>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
            />
            <CreditCard className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Security Code
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="CVC"
                className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
              />
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <Lock size={20} />
          Complete Purchase
        </button>

        <p className="text-sm text-gray-500 text-center">
          Your payment information is encrypted and secure
        </p>
      </form>
    </div>
  );
};

export default PaymentForm;