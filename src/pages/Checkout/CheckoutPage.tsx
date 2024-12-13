import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useBoard } from '../../context/BoardContext';
import { useBalance } from '../../context/BalanceContext';
import OrderSummary from './components/OrderSummary';
import ShippingForm from './components/ShippingForm';
import PaymentButton from './components/PaymentButton';

const TAX_RATE = 0.08;
const LUXURY_TAX_RATE = 0.02;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, total, clearCart } = useCart();
  const { addToPurchased } = useBoard();
  const { deductFromBalance } = useBalance();
  const [shippingDetails, setShippingDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate total with taxes
  const salesTax = total * TAX_RATE;
  const luxuryTax = cartItems.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    return acc + (itemTotal > 10000 ? itemTotal * LUXURY_TAX_RATE : 0);
  }, 0);
  const shipping = 0;
  const finalTotal = total + salesTax + luxuryTax + shipping;

  const handleShippingSubmit = (details: any) => {
    setShippingDetails(details);
    setError(null);
  };

  const handlePaymentSuccess = () => {
    // Try to deduct from balance
    const success = deductFromBalance(finalTotal);
    
    if (!success) {
      setError('Insufficient balance to complete this purchase.');
      return;
    }

    // Add items to board and purchase history
    addToPurchased(cartItems, {
      date: new Date(),
      total: finalTotal,
      subtotal: total,
      salesTax,
      luxuryTax,
      shipping,
      shippingDetails
    });

    // Clear the cart
    clearCart();

    // Navigate to board with success message
    navigate('/board', { 
      state: { 
        success: true,
        message: 'Your purchase was successful! Items have been added to your board.'
      }
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ShippingForm onSubmit={handleShippingSubmit} />
          <PaymentButton 
            isEnabled={!!shippingDetails}
            total={finalTotal}
            onSuccess={handlePaymentSuccess}
          />
        </div>
        
        <div className="lg:col-span-1">
          <OrderSummary items={cartItems} total={total} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;