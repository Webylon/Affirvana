import { supabase } from './supabase';
import { Database } from '../types/supabase';

type Tables = Database['public']['Tables'];

// Categories
export const categoryApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(category: Tables['categories']['Insert']) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, category: Tables['categories']['Update']) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// Luxury Items
export const luxuryItemApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('luxury_items')
      .select('*, categories(*)');
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('luxury_items')
      .select('*, categories(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getByCategory(categoryId: string) {
    const { data, error } = await supabase
      .from('luxury_items')
      .select('*, categories(*)')
      .eq('category_id', categoryId);
    if (error) throw error;
    return data;
  },

  async create(item: Tables['luxury_items']['Insert']) {
    const { data, error } = await supabase
      .from('luxury_items')
      .insert(item)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, item: Tables['luxury_items']['Update']) {
    const { data, error } = await supabase
      .from('luxury_items')
      .update(item)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('luxury_items')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// Users
export const userApi = {
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) throw error;
    return data;
  },

  async updateProfile(profile: Tables['users']['Update']) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('users')
      .update(profile)
      .eq('id', user.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// Favorites
export const favoriteApi = {
  async getAll() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('favorites')
      .select('*, luxury_items(*)')
      .eq('user_id', user.id);
    if (error) throw error;
    return data;
  },

  async add(itemId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, item_id: itemId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(itemId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('item_id', itemId);
    if (error) throw error;
  },
};

// Purchases
export const purchaseApi = {
  async getAll() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('purchases')
      .select('*, purchase_items(*, luxury_items(*))')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('purchases')
      .select('*, purchase_items(*, luxury_items(*))')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(purchase: Tables['purchases']['Insert'], items: Tables['purchase_items']['Insert'][]) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: purchaseData, error: purchaseError } = await supabase
      .from('purchases')
      .insert({ ...purchase, user_id: user.id })
      .select()
      .single();
    if (purchaseError) throw purchaseError;

    const purchaseItems = items.map(item => ({
      ...item,
      purchase_id: purchaseData.id,
    }));

    const { error: itemsError } = await supabase
      .from('purchase_items')
      .insert(purchaseItems);
    if (itemsError) throw itemsError;

    return purchaseData;
  },
};
