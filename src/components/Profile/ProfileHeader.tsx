import React, { useState } from 'react';
import { User, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBalance } from '../../context/BalanceContext';
import { formatBalance } from '../../utils/formatters';
import { updateProfile } from '../../services/profile';

const ProfileHeader: React.FC = () => {
  const { user } = useAuth();
  const { balance } = useBalance();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [tempName, setTempName] = useState(displayName);

  const handleSave = async () => {
    if (user && tempName !== displayName) {
      try {
        await updateProfile(user.id, { name: tempName });
        setDisplayName(tempName);
      } catch (error) {
        console.error('Failed to update name:', error);
        setTempName(displayName);
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(displayName);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* User Info Section */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <User size={32} className="text-purple-600" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="text-xl sm:text-2xl font-bold text-gray-900 border-b-2 border-purple-600 focus:outline-none max-w-[200px]"
                    autoFocus
                  />
                  <button
                    onClick={handleSave}
                    className="p-1 hover:bg-purple-50 rounded-full"
                    title="Save"
                  >
                    <Check size={20} className="text-green-600" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-1 hover:bg-purple-50 rounded-full"
                    title="Cancel"
                  >
                    <X size={20} className="text-red-600" />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                    {displayName}
                  </h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 hover:bg-purple-50 rounded-full"
                    title="Edit name"
                  >
                    <Edit2 size={16} className="text-gray-400" />
                  </button>
                </>
              )}
            </div>
            <p className="text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Balance Section */}
        <div className="flex-shrink-0 bg-purple-50 rounded-lg px-4 py-2 sm:text-right">
          <p className="text-sm text-gray-500">Available Balance</p>
          <p className="text-lg sm:text-2xl font-bold text-purple-600">
            {formatBalance(balance)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;