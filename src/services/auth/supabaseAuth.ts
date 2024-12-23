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
    // Create initial profile
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        name,
        balance: 2500000
      });

    if (insertError) {
      console.error('Profile creation error:', insertError);
    }

    return {
      user: null,
      message: 'Please check your email inbox to verify your account. Don\'t forget to check your spam folder!'
    };
  } catch (error) {
    console.error('Profile creation failed:', error);
    return {
      user: null,
      message: 'Please check your email inbox to verify your account. Don\'t forget to check your spam folder!'
    };
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  if (!user) throw new Error('Sign in failed');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    user: {
      id: user.id,
      email: user.email!,
      name: profile?.name || user.email!.split('@')[0],
      balance: profile?.balance || 2500000
    }
  };
};

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) return null;

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email!,
      name: profile?.name || user.email!.split('@')[0],
      balance: profile?.balance || 2500000
    };
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};