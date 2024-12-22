import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, User, ShoppingCart, Menu } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useBalance } from '../context/BalanceContext';
import { formatBalance } from '../utils/formatters';
import Cart from './Cart';
import AnimatedCounter from './AnimatedCounter';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { cartItems } = useCart();
  const { balance } = useBalance();
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const favoriteCount = favorites.length;
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <svg width="131" height="23" viewBox="0 0 131 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.12 23H10.08L9.62182 19.0727H6.18545L5.76 23H0.72L4.48364 0.745454H11.3891L15.12 23ZM8.93455 15.1127L7.92 5.32727L6.90545 15.1127H8.93455ZM17.8846 23V0.745454H27.6373V4.83636H22.7609V9.90909H26.7537V13.9018H22.7609V23H17.8846ZM31.033 23V0.745454H40.7857V4.83636H35.9094V9.90909H39.9021V13.9018H35.9094V23H31.033ZM44.1814 0.745454H49.0578V23H44.1814V0.745454ZM58.8057 16.6182H57.9875V23H53.1111V0.778182H59.0675C59.8311 0.778182 60.562 0.887272 61.2602 1.10545C61.9802 1.32364 62.6129 1.65091 63.1584 2.08727C63.7257 2.52364 64.1838 3.05818 64.5329 3.69091C64.882 4.32364 65.0893 5.05455 65.1548 5.88364V11.5127C65.0893 12.3418 64.882 13.0727 64.5329 13.7055C64.1838 14.3382 63.7366 14.8727 63.1911 15.3091L65.8748 23H60.9984L58.8057 16.6182ZM60.2784 6.76727C60.2784 6.35273 60.1911 5.99273 60.0166 5.68727C59.842 5.36 59.5257 5.19636 59.0675 5.19636H57.9875V12.2H59.0675C59.5257 12.2 59.842 12.0473 60.0166 11.7418C60.1911 11.4145 60.2784 11.0436 60.2784 10.6291V6.76727ZM72.3702 23L67.6575 0.745454H72.6975L75.1848 17.1745L77.672 0.745454H82.712L77.9993 23H72.3702ZM97.5614 23H92.5214L92.0632 19.0727H88.6269L88.2014 23H83.1614L86.925 0.745454H93.8305L97.5614 23ZM91.376 15.1127L90.3614 5.32727L89.3469 15.1127H91.376ZM108.999 0.745454H113.842V23H108.999L105.235 11.5127V23H100.326V0.745454H105.235L108.999 11.7745V0.745454ZM130.995 23H125.955L125.497 19.0727H122.06L121.635 23H116.595L120.359 0.745454H127.264L130.995 23ZM124.81 15.1127L123.795 5.32727L122.78 15.1127H124.81Z" fill="black"/>
          </svg>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="hidden sm:block bg-purple-50 rounded-lg px-4 py-2">
            <span className="text-xs text-gray-600">Balance</span>
            <p className="text-sm font-semibold text-purple-600">{formatBalance(balance)}</p>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ShoppingCart size={22} />
              {cartItemCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-purple-600 text-white w-4 h-4 rounded-full flex items-center justify-center">
                  <AnimatedCounter 
                    value={cartItemCount} 
                    className="text-xs"
                  />
                </div>
              )}
            </button>

            <button
              onClick={() => navigate('/favorites')}
              className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Heart size={22} />
              {favoriteCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-purple-600 text-white w-4 h-4 rounded-full flex items-center justify-center">
                  <AnimatedCounter 
                    value={favoriteCount} 
                    className="text-xs"
                  />
                </div>
              )}
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <User size={22} />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;