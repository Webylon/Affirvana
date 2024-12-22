import React from 'react';
import { CartItem } from '../../../types';
import { formatPrice } from '../../../utils/formatters';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  salesTax: number;
  luxuryTax: number;
  shipping: number;
  finalTotal: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  items, 
  total, 
  salesTax, 
  luxuryTax, 
  shipping, 
  finalTotal 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        {items.map(item => (
          <div key={item.id} className="flex justify-between">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <p className="text-gray-600">Subtotal</p>
          <p className="font-medium">{formatPrice(total)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600">Sales Tax (8%)</p>
          <p className="font-medium">{formatPrice(salesTax)}</p>
        </div>
        {luxuryTax > 0 && (
          <div className="flex justify-between">
            <p className="text-gray-600">Luxury Tax (2%)</p>
            <p className="font-medium">{formatPrice(luxuryTax)}</p>
          </div>
        )}
        <div className="flex justify-between">
          <p className="text-gray-600">Shipping</p>
          <p className="font-medium">Free</p>
        </div>
        <div className="flex justify-between border-t pt-2">
          <p className="font-semibold">Total</p>
          <p className="font-bold text-xl text-purple-600">{formatPrice(finalTotal)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;