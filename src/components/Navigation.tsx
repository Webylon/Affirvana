import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Layout as LayoutIcon, Heart, User, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/' },
    { icon: <LayoutIcon size={24} />, label: 'Board', path: '/board' },
    { icon: <Heart size={24} />, label: 'Favorites', path: '/favorites' },
    { icon: <User size={24} />, label: 'Profile', path: '/profile' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <nav
      className={cn(
        "lg:static h-full bg-white border-r border-gray-200",
        "lg:block", // Always visible on desktop
        // Mobile styles
        "fixed top-16 left-0 z-40 w-64 transition-transform duration-300 ease-in-out transform",
        !isOpen && "lg:translate-x-0 -translate-x-full" // Only transform on mobile
      )}
    >
      <div className="p-4">
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        {menuItems.map(({ icon, label, path }) => (
          <button
            key={path}
            onClick={() => handleNavigation(path)}
            className={`
              flex items-center w-full px-4 py-3 mb-2 rounded-lg transition-all
              ${location.pathname === path 
                ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-purple-500'}
            `}
          >
            <span className="w-6 h-6 flex items-center justify-center mr-3">
              {icon}
            </span>
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;