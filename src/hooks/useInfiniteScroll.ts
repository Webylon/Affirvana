import { useRef, useState, useCallback } from 'react';

interface ScrollState {
  isScrolling: boolean;
  startX: number;
  scrollLeft: number;
}

export const useInfiniteScroll = (containerRef: React.RefObject<HTMLDivElement>) => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    isScrolling: false,
    startX: 0,
    scrollLeft: 0
  });
  const [isHovered, setIsHovered] = useState(false);

    
    setScrollState({
      isScrolling: true,
      startX: clientX - containerRef.current.offsetLeft,
      scrollLeft: containerRef.current.scrollLeft
    });
  }, []);

  const stopScroll = useCallback(() => {
    setScrollState(prev => ({ ...prev, isScrolling: false }));
    if (!isHovered) {
      setTimeout(() => setIsAutoScrolling(true), 1000);
    }

  const handleScroll = useCallback((clientX: number) => {
    if (!scrollState.isScrolling || !containerRef.current) return;

    const x = clientX - containerRef.current.offsetLeft;
    const walk = (x - scrollState.startX) * 2;
    containerRef.current.scrollLeft = scrollState.scrollLeft - walk;
  }, [scrollState.isScrolling, scrollState.startX, scrollState.scrollLeft]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, [scrollState.isScrolling]);

  return { handleMouseEnter, handleMouseLeave, isHovered };
};

  return {
    isAutoScrolling,
    scrollSpeed,
    startScroll,
    stopScroll,
    handleScroll,
    handleMouseEnter,
    handleMouseLeave,
    setIsAutoScrolling,
    setScrollSpeed,
    isHovered
  };
};