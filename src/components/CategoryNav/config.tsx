import React from 'react';
import { Home, Plane, Car, Ship, Smartphone, Shirt, Diamond, Watch, Palette, Trophy } from 'lucide-react';
import { Category } from '@/types';

interface CategoryConfig {
  name: Category;
  icon: React.ReactNode;
  description: string;
}

export const categoryConfig: CategoryConfig[] = [
  { name: 'Homes', icon: <Home size={24} />, description: 'Luxury Properties' },
  { name: 'Travel', icon: <Plane size={24} />, description: 'Exclusive Destinations' },
  { name: 'Cars', icon: <Car size={24} />, description: 'Premium Vehicles' },
  { name: 'Boats', icon: <Ship size={24} />, description: 'Luxury Yachts' },
  { name: 'Fashion', icon: <Shirt size={24} />, description: 'Designer Apparel' },
  { name: 'Jewelry', icon: <Diamond size={24} />, description: 'Fine Jewelry' },
  { name: 'Watches', icon: <Watch size={24} />, description: 'Luxury Timepieces' },
  { name: 'Gadgets', icon: <Smartphone size={24} />, description: 'High-end Tech' },
  { name: 'Art', icon: <Palette size={24} />, description: 'Fine Art & Collectibles' },
  { name: 'Experiences', icon: <Trophy size={24} />, description: 'Exclusive Events' }
];