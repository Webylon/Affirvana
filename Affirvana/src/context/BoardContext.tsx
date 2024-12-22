import React, { createContext, useContext, useState } from 'react';
import { LuxuryItem, Purchase, CartItem } from '../types';

interface BoardContextType {
  purchasedItems: LuxuryItem[];
  purchaseHistory: Purchase[];
  addToPurchased: (items: CartItem[], purchaseDetails: Omit<Purchase, 'id' | 'items'>) => void;
  removeFromBoard: (itemId: string) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchasedItems, setPurchasedItems] = useState<LuxuryItem[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);

  const addToPurchased = (items: CartItem[], purchaseDetails: Omit<Purchase, 'id' | 'items'>) => {
    // Add items to purchased items list
    setPurchasedItems(prev => [...prev, ...items]);

    // Create purchase record
    const purchase: Purchase = {
      id: crypto.randomUUID(),
      items,
      ...purchaseDetails
    };

    // Add to purchase history
    setPurchaseHistory(prev => [purchase, ...prev]);
  };

  const removeFromBoard = (itemId: string) => {
    setPurchasedItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <BoardContext.Provider value={{ 
      purchasedItems, 
      purchaseHistory, 
      addToPurchased,
      removeFromBoard 
    }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};