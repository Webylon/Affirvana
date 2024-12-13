import React from 'react';

const Prints: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Print Orders</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Your print orders and history will appear here.</p>
      </div>
    </div>
  );
};

export default Prints;