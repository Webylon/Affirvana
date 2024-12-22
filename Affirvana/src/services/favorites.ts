import { supabase } from '@/lib/supabase';
import { LuxuryItem } from '@/types';

export const addToFavorites = async (userId: string, item: LuxuryItem) => {
  const { data, error } = await supabase
    .from('favorites')
    .insert([{
      user_id: userId,
      item_id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      category: item.category,
      description: item.description,
      rating: item.rating,
      rating_count: item.ratingCount
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeFromFavorites = async (userId: string, itemId: string) => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('item_id', itemId);

  if (error) throw error;
};

export const getFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;

  return data.map(item => ({
    id: item.item_id,
    title: item.title,
    price: item.price,
    image: item.image,
    category: item.category,
    description: item.description,
    rating: item.rating,
    ratingCount: item.rating_count,
    isFavorite: true
  })) as LuxuryItem[];
};