import React, { useEffect, useState } from 'react';
import { categoryApi, luxuryItemApi } from '../lib/api';
import { Database } from '../types/supabase';

type Category = Database['public']['Tables']['categories']['Row'];
type LuxuryItem = Database['public']['Tables']['luxury_items']['Row'];

const TestSupabase: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<LuxuryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, itemsData] = await Promise.all([
          categoryApi.getAll(),
          luxuryItemApi.getAll()
        ]);
        setCategories(categoriesData);
        setItems(itemsData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data from Supabase');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Supabase Test</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Categories ({categories.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <div key={category.id} className="p-4 border rounded-lg">
              <h4 className="font-medium">{category.name}</h4>
              <p className="text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Luxury Items ({items.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="p-4 border rounded-lg">
              <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-lg mb-2" />
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-purple-600 font-medium mt-2">
                ${item.price.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestSupabase;
