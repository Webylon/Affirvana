// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000; // 1 second
const MAX_DELAY = 5000; // 5 seconds

// Exponential backoff with jitter
const getRetryDelay = (attempt: number): number => {
  const exponentialDelay = Math.min(
    INITIAL_DELAY * Math.pow(2, attempt),
    MAX_DELAY
  );
  // Add random jitter ±100ms
  return exponentialDelay + Math.random() * 200 - 100;
};

export const withRetry = async <T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      if (attempt === retries || 
          !isRetryableError(error) ||
          error.code === 'auth/cancelled-popup-request' ||
          error.code === 'auth/popup-closed-by-user') {
        throw error;
      }

      const delay = getRetryDelay(attempt);
      console.log(`Retry attempt ${attempt + 1}/${retries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

const isRetryableError = (error: any): boolean => {
  const retryableCodes = [
    'auth/network-request-failed',
    'auth/timeout',
    'auth/internal-error',
    'auth/too-many-requests'
  ];
  
  return retryableCodes.includes(error.code) || 
         error.message?.includes('network') ||
         error.message?.includes('timeout') ||
         error.message?.includes('fetch failed');
};