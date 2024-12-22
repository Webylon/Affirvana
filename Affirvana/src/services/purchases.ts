import { supabase } from '@/lib/supabase';
import { Purchase, CartItem } from '../types';

export const createPurchase = async (
  userId: string,
  purchase: Omit<Purchase, 'id' | 'date'>,
  items: CartItem[]
) => {
  const { data: purchaseData, error: purchaseError } = await supabase
    .from('purchases')
    .insert([{
      user_id: userId,
      total: purchase.total,
      subtotal: purchase.subtotal,
      sales_tax: purchase.salesTax,
      luxury_tax: purchase.luxuryTax,
      shipping: purchase.shipping,
      shipping_details: purchase.shippingDetails
    }])
    .select()
    .single();

  if (purchaseError) throw purchaseError;

  const purchaseItems = items.map(item => ({
    purchase_id: purchaseData.id,
    item_id: item.id,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    category: item.category
  }));

  const { error: itemsError } = await supabase
    .from('purchase_items')
    .insert(purchaseItems);

  if (itemsError) throw itemsError;

  return purchaseData;
};

export const getUserPurchases = async (userId: string) => {
  const { data: purchases, error: purchasesError } = await supabase
    .from('purchases')
    .select(`
      *,
      purchase_items (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (purchasesError) throw purchasesError;

  return purchases;
};