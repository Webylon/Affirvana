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