import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useBoard } from '../../context/BoardContext';
import { useBalance } from '../../context/BalanceContext';
import ShippingForm from './components/ShippingForm';
import PaymentButton from './components/PaymentButton';
import OrderSummary from './components/OrderSummary';
import { ShippingDetails } from '../../types';

const TAX_RATE = 0.08; // 8% sales tax
const LUXURY_THRESHOLD = 1000; // $1000 threshold for luxury tax
const LUXURY_TAX_RATE = 0.02; // 2% luxury tax

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, total: cartTotal, clearCart } = useCart();
  const { addToPurchased } = useBoard();
  const { deductFromBalance } = useBalance();
  
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Only redirect if we're not processing a payment
    if (!processing && (!cartItems || cartItems.length === 0)) {
      navigate('/cart', { replace: true });
    }
  }, [cartItems, navigate, processing]);

  // Don't render anything while processing to prevent flashing
  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your purchase...</p>
        </div>
      </div>
    );
  }

  // Return null if no cart items (useEffect will handle redirect)
  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  // Calculate totals
  const salesTax = cartTotal * TAX_RATE;
  const luxuryTax = cartItems.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    return acc + (itemTotal > LUXURY_THRESHOLD ? itemTotal * LUXURY_TAX_RATE : 0);
  }, 0);
  const finalTotal = cartTotal + salesTax + luxuryTax;

  const handleShippingSubmit = (details: ShippingDetails) => {
    setShippingDetails(details);
    setError(null);
    setStep('payment');
  };

  const handleBack = () => {
    if (step === 'payment') {
      setStep('shipping');
    } else {
      navigate(-1);
    }
  };

  const handlePaymentSuccess = async () => {
    if (processing || !shippingDetails || !cartItems || cartItems.length === 0) {
      return;
    }
    
    try {
      setProcessing(true);
      setError(null);
      
      // Try to deduct from balance
      const success = deductFromBalance(finalTotal);
      
      if (!success) {
        setError('Insufficient balance to complete this purchase.');
        setProcessing(false);
        return;
      }

      // Add items to purchased
      const purchased = await addToPurchased(shippingDetails);

      if (!purchased) {
        // Rollback the balance deduction
        deductFromBalance(-finalTotal);
        setError('Failed to complete purchase. Please try again.');
        setProcessing(false);
        return;
      }

      // Clear cart and navigate in one go
      clearCart();
      navigate('/success', { 
        replace: true,
        state: { 
          success: true,
          message: 'Your purchase was successful! Items have been added to your collection.'
        }
      });
    } catch (err) {
      console.error('Error processing purchase:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while processing your purchase.');
      }
      // Rollback the balance deduction
      deductFromBalance(-finalTotal);
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 text-center">
            {step === 'shipping' ? 'Shipping Information' : 'Payment'}
          </h1>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left column - Form */}
                <div>
                  {step === 'shipping' ? (
                    <ShippingForm
                      onSubmit={handleShippingSubmit}
                      initialData={shippingDetails}
                    />
                  ) : (
                    <PaymentButton
                      onSuccess={handlePaymentSuccess}
                      disabled={processing}
                      amount={finalTotal}
                    />
                  )}
                </div>

                {/* Right column - Order summary */}
                <div>
                  <OrderSummary
                    items={cartItems}
                    total={cartTotal}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;