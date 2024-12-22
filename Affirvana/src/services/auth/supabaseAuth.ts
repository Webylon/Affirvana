import { supabase } from '@/lib/supabase';
import { AuthResponse } from './types';

export const signUp = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Signup failed');

  try {
    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        name,
        balance: 2500000
      }])
      .select()
      .single();

    if (profileError) throw profileError;

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        name: profile.name,
        balance: profile.balance
      }
    };
  } catch (error) {
    console.error('Profile creation failed:', error);
    throw new Error('Failed to create user profile');
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Sign in failed');

  try {
    // Get or create profile
    let profile = await getOrCreateProfile(authData.user.id, authData.user.user_metadata?.name || email);

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        name: profile.name,
        balance: profile.balance
      }
    };
  } catch (error) {
    console.error('Profile retrieval failed:', error);
    throw new Error('Failed to get user profile');
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) return null;

  try {
    const profile = await getOrCreateProfile(user.id, user.user_metadata?.name || user.email!);

    return {
      id: user.id,
      email: user.email!,
      name: profile.name,
      balance: profile.balance
    };
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

const getOrCreateProfile = async (userId: string, defaultName: string) => {
  // Try to get existing profile
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!fetchError && profile) {
    return profile;
  }

  // Create profile if it doesn't exist
  const { data: newProfile, error: createError } = await supabase
    .from('profiles')
    .insert([{
      id: userId,
      name: defaultName,
      balance: 2500000
    }])
    .select()
    .single();

  if (createError) throw createError;
  return newProfile;
};