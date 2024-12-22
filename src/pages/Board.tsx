import React, { useState } from 'react';
import { Download, Loader2, Trash2 } from 'lucide-react';
import { useBoard } from '../context/BoardContext';
import { formatPrice } from '../utils/formatters';
import { downloadImage } from '../utils/download';
import { LuxuryItem } from '../types';
import DeleteDialog from '../components/DeleteDialog';

const Board: React.FC = () => {
  const { purchasedItems, removeFromBoard } = useBoard();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<LuxuryItem | null>(null);

  const handleDownload = async (item: LuxuryItem) => {
    try {
      setDownloading(item.id);
      await downloadImage(item);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = (item: LuxuryItem) => {
    setDeleteItem(item);
  };

  const confirmDelete = () => {
    if (deleteItem) {
      removeFromBoard(deleteItem.id);
      setDeleteItem(null);
    }
  };

  if (purchasedItems.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your Board</h2>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">You haven't purchased any items yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Board</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchasedItems.map((item) => (
          <div key={`${item.id}-${crypto.randomUUID()}`} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleDownload(item)}
                  disabled={downloading === item.id}
                  className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors disabled:opacity-50"
                  title="Download image"
                >
                  {downloading === item.id ? (
                    <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                  ) : (
                    <Download className="w-5 h-5 text-purple-600" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  title="Delete item"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-purple-600 font-bold">{formatPrice(item.price)}</p>
              <p className="text-sm text-gray-600 mt-2">{item.description}</p>
              <div className="mt-4">
                <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DeleteDialog
        isOpen={deleteItem !== null}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Board;