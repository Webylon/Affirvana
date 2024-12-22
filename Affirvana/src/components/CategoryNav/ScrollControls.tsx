import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollControlsProps {
  onScrollLeft: () => void;
  onScrollRight: () => void;
  showLeftButton: boolean;
  showRightButton: boolean;
}

const ScrollControls: React.FC<ScrollControlsProps> = ({
  onScrollLeft,
  onScrollRight,
  showLeftButton,
  showRightButton
}) => {
  return (
    <>
      <button
        type="button"
        aria-label="Scroll left"
        onClick={onScrollLeft}
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-all ${
          showLeftButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronLeft size={24} className="text-gray-600" />
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={onScrollRight}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-all ${
          showRightButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronRight size={24} className="text-gray-600" />
      </button>
    </>
  );
};

export default React.memo(ScrollControls);