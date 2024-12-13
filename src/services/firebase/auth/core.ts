import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { createUser, updateUserProfile } from '../collections/users';
import { AuthError } from './errors';
import { withRetry } from './retry';
import { checkNetworkConnection, waitForNetwork } from './network';

export const signIn = async (email: string, password: string) => {
  try {
    await ensureNetworkConnection();
    const userCredential = await withRetry(() => 
      signInWithEmailAndPassword(auth, email, password)
    );
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new AuthError(error.code);
  }
};

export const signUp = async (email: string, password: string, displayName: string) => {
  try {
    await ensureNetworkConnection();
    const userCredential = await withRetry(() => 
      createUserWithEmailAndPassword(auth, email, password)
    );

    // Create user profile
    await createUserProfile(userCredential.user, displayName);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new AuthError(error.code);
  }
};

export const signOut = async () => {
  try {
    await withRetry(() => firebaseSignOut(auth));
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new AuthError(error.code);
  }
};

export const updateUserDisplayName = async (user: User, displayName: string) => {
  try {
    await ensureNetworkConnection();
    await withRetry(async () => {
      await updateProfile(user, { displayName });
      await updateUserProfile(user.uid, { 
        displayName,
        updatedAt: new Date()
      });
    });
    return true;
  } catch (error: any) {
    console.error('Error updating display name:', error);
    throw new AuthError(error.code);
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

const createUserProfile = async (user: User, displayName: string) => {
  await updateProfile(user, { displayName });
  await createUser(user.uid, {
    email: user.email!,
    displayName,
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
};

const ensureNetworkConnection = async () => {
  const isOnline = await checkNetworkConnection();
  if (!isOnline) {
    const networkRestored = await waitForNetwork();
    if (!networkRestored) {
      throw new AuthError('auth/network-request-failed', 
        'Unable to connect to the network. Please check your internet connection.');
    }
  }
};