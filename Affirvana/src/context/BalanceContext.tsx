import React, { createContext, useContext, useState } from 'react';
import { INITIAL_BALANCE } from '../constants/financial';

interface BalanceContextType {
  balance: number;
  deductFromBalance: (amount: number) => boolean;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(INITIAL_BALANCE);

  const deductFromBalance = (amount: number): boolean => {
    if (amount > balance) {
      return false;
    }
    setBalance(prev => prev - amount);
    return true;
  };

  return (
    <BalanceContext.Provider value={{ balance, deductFromBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};