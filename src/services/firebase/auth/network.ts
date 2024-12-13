import { getAuth } from 'firebase/auth';

export const checkNetworkConnection = async (): Promise<boolean> => {
  try {
    // Check basic internet connectivity
    if (!navigator.onLine) {
      throw new Error('No internet connection');
    }

    // Additional network check - try to fetch a small resource
    const response = await fetch('https://www.google.com/favicon.ico', {
      mode: 'no-cors',
      cache: 'no-cache'
    });
    
    if (!response.ok && response.type !== 'opaque') {
      throw new Error('Network check failed');
    }

    // Test Firebase connection
    const auth = getAuth();
    await auth.app.checkDestroyed();
    
    return true;
  } catch (error) {
    console.error('Network check failed:', error);
    return false;
  }
};

export const waitForNetwork = async (
  timeout: number = 30000,
  checkInterval: number = 1000
): Promise<boolean> => {
  const startTime = Date.now();
  
  // Set up network status listener
  return new Promise((resolve) => {
    const checkConnection = async () => {
      if (await checkNetworkConnection()) {
        cleanup();
        resolve(true);
        return;
      }
      
      if (Date.now() - startTime >= timeout) {
        cleanup();
        resolve(false);
        return;
      }
    };

    const onOnline = () => {
      checkConnection();
    };

    const cleanup = () => {
      window.removeEventListener('online', onOnline);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };

    // Listen for online events
    window.addEventListener('online', onOnline);
    
    // Also check periodically
    const intervalId = setInterval(checkConnection, checkInterval);
    
    // Initial check
    checkConnection();
  });
};