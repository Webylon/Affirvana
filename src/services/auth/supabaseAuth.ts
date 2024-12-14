import { AuthError } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { AuthResponse, User } from '../../types/auth';
import toast from 'react-hot-toast';

const handleAuthError = (error: AuthError): string => {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Invalid email or password';
    case 'User already registered':
      return 'An account with this email already exists';
    case 'Email not confirmed':
      return 'Please confirm your email address';
    default:
      return error.message;
  }
};

const createOrUpdateProfile = async (userId: string, email: string, name?: string): Promise<User> => {
  try {
    // First try to get the existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
      throw fetchError;
    }

    if (existingProfile) {
      // If name is provided and different from existing, update it
      if (name && name !== existingProfile.name) {
        const { data: updatedProfile, error: updateError } = await supabase
          .from('users')
          .update({ name })
          .eq('id', userId)
          .select()
          .single();

        if (updateError) throw updateError;
        return updatedProfile!;
      }
      return existingProfile;
    }

    // If no profile exists, create one with the provided name or fallback
    const { data: newProfile, error: createError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email,
        name: name || email.split('@')[0], // Use part of email as name if not provided
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) throw createError;
    return newProfile!;
  } catch (error) {
    console.error('Error in createOrUpdateProfile:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return profile;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const errorMessage = handleAuthError(error);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (!data.user) {
      const errorMessage = 'No user data returned from authentication';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    // Get or create user profile
    const profile = await createOrUpdateProfile(data.user.id, data.user.email!);

    toast.success('Successfully signed in!');
    return {
      user: profile,
      session: data.session,
    };
  } catch (error) {
    console.error('Error in signIn:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      const errorMessage = handleAuthError(error);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (!data.user) {
      const errorMessage = 'No user data returned from sign up';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    // Create user profile
    const profile = await createOrUpdateProfile(data.user.id, email, name);

    toast.success('Successfully signed up! Please check your email to confirm your account.');
    return {
      user: profile,
      session: data.session,
    };
  } catch (error) {
    console.error('Error in signUp:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toast.error('Error signing out');
    throw error;
  }
  toast.success('Successfully signed out');
};
