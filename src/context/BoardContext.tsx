import React, { createContext, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
}

interface BoardContextType {
  addToPurchased: (shippingDetails: ShippingDetails) => Promise<boolean>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};

// Keep useBoardContext as an alias for backward compatibility
export const useBoardContext = useBoard;

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { cartItems, total } = useCart();

  const addToPurchased = async (shippingDetails: ShippingDetails): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to make a purchase');
      return false;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      return false;
    }

    try {
      // Calculate tax and totals
      const subtotal = Number(total.toFixed(2));
      const salesTax = Number((subtotal * 0.08).toFixed(2)); // 8% sales tax
      const luxuryTax = Number(cartItems.reduce((acc, item) => {
        const itemTotal = item.price * item.quantity;
        return acc + (itemTotal > 1000 ? itemTotal * 0.02 : 0); // 2% luxury tax for items over $1000
      }, 0).toFixed(2));
      const finalTotal = Number((subtotal + salesTax + luxuryTax).toFixed(2));

      // Format shipping details to match database structure
      const shippingAddress = {
        first_name: shippingDetails.firstName,
        last_name: shippingDetails.lastName,
        email: shippingDetails.email,
        address: shippingDetails.address,
        city: shippingDetails.city,
        state: shippingDetails.state,
        zip_code: shippingDetails.zipCode,
        country: shippingDetails.country || 'Sweden' // Default to Sweden if not provided
      };

      // First create the purchase record
      const purchaseData = {
        user_id: user.id,
        total: finalTotal,
        subtotal: subtotal,
        sales_tax: salesTax,
        luxury_tax: luxuryTax,
        shipping_address: shippingAddress,
        // Add individual shipping fields
        first_name: shippingDetails.firstName,
        last_name: shippingDetails.lastName,
        email: shippingDetails.email,
        address: shippingDetails.address,
        city: shippingDetails.city,
        state: shippingDetails.state,
        zip_code: shippingDetails.zipCode,
        country: shippingDetails.country || 'Sweden'
      };

      console.log('Purchase data:', purchaseData); // Debug log

      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert(purchaseData)
        .select('id')
        .single();

      if (purchaseError) {
        console.error('Purchase error:', purchaseError);
        throw new Error(purchaseError.message);
      }

      if (!purchase) {
        throw new Error('Failed to create purchase');
      }

      // Insert purchase items
      const purchaseItems = cartItems.map(item => ({
        purchase_id: purchase.id,
        item_id: item.id,
        title: item.title,
        price: Number(item.price.toFixed(2)),
        quantity: item.quantity,
        category: item.category,
        image: item.image
      }));

      const { error: itemsError } = await supabase
        .from('purchase_items')
        .insert(purchaseItems);

      if (itemsError) {
        // Rollback the purchase if items insertion fails
        await supabase
          .from('purchases')
          .delete()
          .match({ id: purchase.id });
        throw new Error(itemsError.message);
      }

      toast.success('Purchase completed successfully!');
      return true;
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to complete purchase. Please try again.');
      return false;
    }
  };

  const value = {
    addToPurchased
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};