import React, { useState, useEffect } from 'react';
import { User, Edit2, Check, X } from 'lucide-react';
import { useBalance } from '../../context/BalanceContext';
import { formatBalance } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const ProfileHeader: React.FC = () => {
  const { balance } = useBalance();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || 'Guest User');
  const [tempName, setTempName] = useState(displayName);

  useEffect(() => {
    if (user?.name) {
      setDisplayName(user.name);
      setTempName(user.name);
    }
  }, [user?.name]);

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ name: tempName })
        .eq('id', user.id);

      if (error) throw error;

      setDisplayName(tempName);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating name:', error);
      // Revert to original name on error
      setTempName(displayName);
      setIsEditing(false);
    }
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
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <User size={40} className="text-purple-600" />
            )}
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
                  {user && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 hover:bg-purple-50 rounded-full"
                      title="Edit name"
                    >
                      <Edit2 size={16} className="text-gray-400" />
                    </button>
                  )}
                </>
              )}
            </div>
            <p className="text-gray-500">{user?.email || 'guest@example.com'}</p>
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