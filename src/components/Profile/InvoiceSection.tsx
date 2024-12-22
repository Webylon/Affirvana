import React from 'react';
import { Receipt, Download } from 'lucide-react';
import { useBoard } from '../../context/BoardContext';
import { formatPrice, formatDate } from '../../utils/formatters';

const InvoiceSection: React.FC = () => {
  const { purchaseHistory } = useBoard();

  if (purchaseHistory.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="text-purple-600" size={24} />
          <h2 className="text-xl font-semibold">Purchase History</h2>
        </div>
        <p className="text-gray-500">No purchase history available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Receipt className="text-purple-600" size={24} />
          <h2 className="text-xl font-semibold">Purchase History</h2>
        </div>
      </div>

      <div className="space-y-6">
        {purchaseHistory.map((purchase) => (
          <div
            key={purchase.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-lg">
                  Invoice #{purchase.id.slice(0, 8)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(purchase.date)}
                </p>
              </div>
              <button
                onClick={() => {}} // TODO: Implement invoice download
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Download Invoice"
              >
                <Download size={20} className="text-purple-600" />
              </button>
            </div>

            <div className="space-y-2">
              {purchase.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-600">
                    {item.title} x{item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-bold text-purple-600">
                  {formatPrice(purchase.total)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Status</p>
                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  Completed
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceSection;