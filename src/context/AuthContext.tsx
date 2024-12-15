import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthResponse } from '../types/auth';
import { signIn, signUp, signOut, getCurrentUser } from '../services/auth/supabaseAuth';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUserAndSession = async (session: Session | null) => {
    try {
      if (session) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setSession(session);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user information');
    }
  };

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        await updateUserAndSession(session);
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast.error('Error initializing authentication');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setLoading(true);
      
      try {
        switch (event) {
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
          case 'USER_UPDATED':
            await updateUserAndSession(session);
            break;
          case 'SIGNED_OUT':
            setUser(null);
            setSession(null);
            toast.success('Successfully signed out!');
            break;
          default:
            console.log('Unhandled auth event:', event);
        }
      } catch (error) {
        console.error('Error handling auth state change:', error);
        toast.error('Error updating authentication state');
      } finally {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await signIn(email, password);
      
      if (response.error) {
        toast.error(response.error);
        return response;
      }
      
      if (response.user) {
        setUser(response.user);
        setSession(response.session);
        toast.success('Successfully signed in!');
      }
      
      return response;
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      return {
        user: null,
        session: null,
        error: error.message || 'Failed to sign in'
      };
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const response = await signUp(email, password, name);
      return response;
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};