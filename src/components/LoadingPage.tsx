import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <LoadingSpinner size={40} />
      <p className="mt-4 text-gray-600 animate-pulse">Loading...</p>
    </div>
  );
};

export default LoadingPage;