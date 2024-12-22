import { useState, useEffect } from 'react';

export function useLoadingDelay(isLoading: boolean, delay: number = 800) {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      timer = setTimeout(() => {
        setShowLoading(true);
      }, delay);
    } else {
      setShowLoading(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading, delay]);

  return showLoading;
}