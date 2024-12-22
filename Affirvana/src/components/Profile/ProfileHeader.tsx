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
        setTempName(displayName); // Reset on error
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(displayName);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
            <User size={40} className="text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="text-2xl font-bold text-gray-900 border-b-2 border-purple-600 focus:outline-none"
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
                  <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
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
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Available Balance</p>
          <p className="text-2xl font-bold text-purple-600">{formatBalance(balance)}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;