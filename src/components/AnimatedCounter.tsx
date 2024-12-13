import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      setDisplayValue(value);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match animation duration

      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  return (
    <span 
      className={`${className} ${
        isAnimating ? 'animate-bounce scale-125' : ''
      } transition-all duration-300`}
    >
      {displayValue}
    </span>
  );
};

export default AnimatedCounter;