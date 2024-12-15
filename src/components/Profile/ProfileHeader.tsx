import React, { useState, useEffect } from 'react';
import { User, Edit2, Check, X } from 'lucide-react';
import { useBalance } from '../../context/BalanceContext';
import { formatBalance } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../services/auth/supabaseAuth';
import toast from 'react-hot-toast';

const ProfileHeader: React.FC = () => {
  const { balance } = useBalance();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        const currentUser = await getCurrentUser();
        if (currentUser?.name) {
          setDisplayName(currentUser.name);
          setTempName(currentUser.name);
        }
      }
    };
    
    fetchUserProfile();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user || !tempName.trim()) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ name: tempName.trim() })
        .eq('id', user.id);

      if (error) throw error;

      setDisplayName(tempName.trim());
      setIsEditing(false);
      toast.success('Name updated successfully');
    } catch (error) {
      console.error('Error updating name:', error);
      toast.error('Failed to update name');
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
                alt={displayName || 'User avatar'}
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
                    placeholder="Enter your name"
                  />
                  <button
                    onClick={handleSave}
                    className="p-1 hover:bg-purple-50 rounded-full"
                    title="Save"
                    disabled={!tempName.trim()}
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
                  <h1 className="text-2xl font-bold text-gray-900">
                    {displayName || 'Guest User'}
                  </h1>
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
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="mt-1 text-lg font-medium text-purple-600">
              Balance: {formatBalance(balance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;