import { connectAuthEmulator, Auth } from 'firebase/auth';

export const setupAuthEmulator = (auth: Auth) => {
  if (import.meta.env.DEV) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      console.log('Connected to Firebase Auth Emulator');
    } catch (error) {
      console.error('Failed to connect to Auth Emulator:', error);
    }
  }
};