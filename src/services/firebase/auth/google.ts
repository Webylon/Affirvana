import { 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  browserPopupRedirectResolver
} from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { createUser, getUser } from '../collections/users';
import { AuthError } from './errors';
import { withRetry } from './retry';
import { googleProvider, AUTHORIZED_DOMAINS } from './constants';
import { checkNetworkConnection, waitForNetwork } from './network';

export const signInWithGoogle = async () => {
  try {
    // Check network connection first
    const isOnline = await checkNetworkConnection();
    if (!isOnline) {
      const networkRestored = await waitForNetwork();
      if (!networkRestored) {
        throw new AuthError('auth/network-request-failed', 
          'Unable to connect to the network. Please check your internet connection.');
      }
    }

    // Verify domain authorization
    const currentDomain = window.location.hostname;
    if (!AUTHORIZED_DOMAINS.includes(currentDomain)) {
      throw new AuthError('auth/unauthorized-domain');
    }

    let result;
    
    try {
      // First attempt: Try popup with retry mechanism
      result = await withRetry(() => 
        signInWithPopup(auth, googleProvider, browserPopupRedirectResolver)
      );
    } catch (popupError: any) {
      console.log('Popup sign-in failed, trying redirect...', popupError);
      
      if (popupError.code === 'auth/popup-blocked' || 
          popupError.code === 'auth/cancelled-popup-request' ||
          popupError.code === 'auth/popup-closed-by-user') {
        
        await signInWithRedirect(auth, googleProvider);
        result = await withRetry(() => 
          getRedirectResult(auth, browserPopupRedirectResolver)
        );
        
        if (!result) {
          throw new AuthError('auth/redirect-failed');
        }
      } else {
        throw popupError;
      }
    }

    if (!result?.user) {
      throw new AuthError('auth/no-user');
    }

    await handleGoogleSignInResult(result);
    return result.user;

  } catch (error: any) {
    console.error('Google sign-in error:', error);
    throw new AuthError(error.code || 'auth/unknown');
  }
};

const handleGoogleSignInResult = async (result: any) => {
  const user = result.user;
  
  try {
    const existingUser = await getUser(user.uid);
    
    if (!existingUser) {
      await createUser(user.uid, {
        email: user.email!,
        displayName: user.displayName || 'User',
        photoURL: user.photoURL || undefined,
        balance: 2500000,
        preferences: {
          currency: 'USD',
          theme: 'light',
          notifications: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  } catch (error: any) {
    throw new AuthError('auth/profile-creation-failed');
  }
};