export const generateRandomRating = () => {
  // Generate ratings between 3.5 and 5.0
  const rating = 3.5 + Math.random() * 1.5;
  // Generate between 50 and 1000 ratings
  const ratingCount = Math.floor(50 + Math.random() * 950);
  
  return {
    rating: Number(rating.toFixed(1)),
    ratingCount
  };
};