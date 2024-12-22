import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useBoard } from '../../context/BoardContext';
import { useBalance } from '../../context/BalanceContext';
import { useAuth } from '../../context/AuthContext';
import { createPurchase } from '../../services';
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
  const { user } = useAuth();
  const [shippingDetails, setShippingDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const salesTax = total * TAX_RATE;
  const luxuryTax = cartItems.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    return acc + (itemTotal > 10000 ? itemTotal * LUXURY_TAX_RATE : 0);
  }, 0);
  const shipping = 0; // Free shipping
  const finalTotal = total + salesTax + luxuryTax + shipping;

  const handleShippingSubmit = (details: any) => {
    setShippingDetails(details);
    setError(null);
  };

  const handlePaymentSuccess = async () => {
    if (!user) {
      setError('You must be logged in to complete this purchase.');
      return;
    }

    setIsProcessing(true);
    try {
      const success = deductFromBalance(finalTotal);
      if (!success) {
        setError('Insufficient balance to complete this purchase.');
        return;
      }

      const purchase = {
        total: finalTotal,
        subtotal: total,
        salesTax,
        luxuryTax,
        shipping,
        shippingDetails
      };

      await createPurchase(user.id, purchase, cartItems);
      
      addToPurchased(cartItems, {
        date: new Date(),
        ...purchase
      });

      clearCart();
      navigate('/board', { 
        state: { 
          success: true,
          message: 'Your purchase was successful! Items have been added to your board.'
        }
      });
    } catch (error) {
      console.error('Purchase failed:', error);
      setError('Failed to process purchase. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart to proceed with checkout.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ShippingForm onSubmit={handleShippingSubmit} />
          <PaymentButton
            isEnabled={!!shippingDetails && !isProcessing}
            total={finalTotal}
            onSuccess={handlePaymentSuccess}
          />
        </div>
        
        <OrderSummary
          items={cartItems}
          total={total}
          salesTax={salesTax}
          luxuryTax={luxuryTax}
          shipping={shipping}
          finalTotal={finalTotal}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;