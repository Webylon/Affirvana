import { AuthError } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { AuthResponse, User } from '../../types/auth';

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
      .upsert(
        {
          id: userId,
          email,
          name: name || email.split('@')[0], // Fallback to email username if no name provided
          currency: 'USD',
          notifications: true,
          theme: 'light',
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (createError) {
      console.error('Error creating user profile:', createError);
      throw new Error('Failed to create user profile');
    }

    if (!newProfile) {
      throw new Error('Failed to create user profile');
    }

    return newProfile;
  } catch (error) {
    console.error('Error in createOrUpdateProfile:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session?.user) return null;

    try {
      // Get the user's metadata which might contain the name
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Pass the name from auth metadata if available
      return await createOrUpdateProfile(
        session.user.id,
        session.user.email!,
        authUser?.user_metadata?.name
      );
    } catch (error) {
      console.error('Error getting/creating profile:', error);
      return null;
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;
    if (!session) throw new Error('No session returned after sign in');

    try {
      // Get the user's metadata which might contain the name
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const profile = await createOrUpdateProfile(
        session.user.id,
        email,
        authUser?.user_metadata?.name
      );

      return {
        user: profile,
        session,
      };
    } catch (error) {
      console.error('Error getting/creating profile:', error);
      throw new Error('Failed to fetch or create user profile');
    }
  } catch (error) {
    console.error('Error signing in:', error);
    if (error instanceof AuthError) {
      throw new Error(handleAuthError(error));
    }
    throw error;
  }
};

export const signUp = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  try {
    const { data: { session }, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name, // Store name in auth metadata
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) throw authError;
    if (!session) {
      // If no session, the user needs to confirm their email
      return {
        user: null,
        session: null,
        error: 'Please check your email to confirm your account',
      };
    }

    try {
      const profile = await createOrUpdateProfile(session.user.id, email, name);
      return {
        user: profile,
        session,
      };
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new Error('Failed to create user profile');
    }
  } catch (error) {
    console.error('Error signing up:', error);
    if (error instanceof AuthError) {
      throw new Error(handleAuthError(error));
    }
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
