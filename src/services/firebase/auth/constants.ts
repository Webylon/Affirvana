import { GoogleAuthProvider } from 'firebase/auth';

// Initialize Google Auth Provider with custom parameters
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// List of authorized domains for development and production
export const AUTHORIZED_DOMAINS = [
  'localhost', 
  'stackblitz.com', 
  'webcontainer.io'
];

// Error messages for different authentication scenarios
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/popup-blocked': 'The sign-in popup was blocked. Please allow popups for this website or try again.',
  'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
  'auth/unauthorized-domain': 'This domain is not authorized for Google Sign-in. Please try again later or use email/password.',
  'auth/invalid-email': 'The email address is invalid.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'Invalid email or password.',
  'auth/wrong-password': 'Invalid email or password.',
  'auth/email-already-in-use': 'This email is already registered. Please sign in or use a different email.',
  'auth/weak-password': 'Password should be at least 6 characters long.',
  'auth/network-request-failed': 'Network error. Please check your internet connection.',
  'auth/too-many-requests': 'Too many unsuccessful attempts. Please try again later.',
  'default': 'An error occurred during authentication. Please try again.'
};