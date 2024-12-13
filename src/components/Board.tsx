import React from 'react';

const Board: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Affirmation Board</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Your purchased items will appear here.</p>
      </div>
    </div>
  );
};

export default Board;