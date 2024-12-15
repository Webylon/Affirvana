import { AuthError, Provider } from '@supabase/supabase-js';
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

export const createOrUpdateProfile = async (userId: string, email: string, name?: string): Promise<User> => {
  try {
    // First try to get the existing profile
    const { data: profiles, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId);

    if (fetchError) {
      console.error('Error fetching user profile:', fetchError);
      throw fetchError;
    }

    const existingProfile = profiles && profiles.length > 0 ? profiles[0] : null;

    // Ensure we have a valid name, using the provided name or a fallback
    const profileName = name || (existingProfile?.name || email.split('@')[0]);

    const userProfile = {
      id: userId,
      email,
      name: profileName,
      balance: 2500000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (existingProfile) {
      // Update existing profile if name has changed
      if (name && name !== existingProfile.name) {
        try {
          const { data: updatedProfiles, error: updateError } = await supabase
            .from('users')
            .update({
              name: profileName,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId)
            .select();

          if (updateError) {
            if (updateError.message.includes('schema cache')) {
              console.warn('Schema cache error during update, using existing profile');
              return { ...existingProfile, name: profileName };
            }
            throw updateError;
          }

          return updatedProfiles[0];
        } catch (error: any) {
          if (error.message.includes('schema cache')) {
            console.warn('Schema cache error during update, using existing profile');
            return { ...existingProfile, name: profileName };
          }
          throw error;
        }
      }
      return existingProfile;
    }

    // If no profile exists, create one
    console.log('Creating new user profile:', { ...userProfile, email: '***' });
    
    try {
      // First attempt to create the profile
      const { data: newProfiles, error: createError } = await supabase
        .from('users')
        .insert([userProfile])
        .select();

      if (createError) {
        if (createError.message.includes('schema cache')) {
          // If we get a schema cache error, wait briefly and try again
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Second attempt after schema cache error
          const { data: retryProfiles, error: retryError } = await supabase
            .from('users')
            .insert([userProfile])
            .select();

          if (retryError) {
            if (retryError.message.includes('schema cache')) {
              // If still getting schema cache error, return the profile as is
              console.warn('Schema cache error persists, returning default profile');
              return userProfile as User;
            }
            throw retryError;
          }

          if (!retryProfiles || retryProfiles.length === 0) {
            console.warn('No profile returned after retry, returning default profile');
            return userProfile as User;
          }

          return retryProfiles[0];
        }
        throw createError;
      }

      if (!newProfiles || newProfiles.length === 0) {
        console.warn('No profile returned after creation, returning default profile');
        return userProfile as User;
      }

      console.log('Successfully created user profile');
      return newProfiles[0];
    } catch (error: any) {
      if (error.message.includes('schema cache')) {
        console.warn('Schema cache error during creation, returning default profile');
        return userProfile as User;
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in createOrUpdateProfile:', error);
    // Return default profile as fallback
    return {
      id: userId,
      email,
      name: name || email.split('@')[0],
      balance: 2500000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as User;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profiles, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id);

    if (error) {
      console.error('Error getting current user:', error);
      throw error;
    }

    // Get name from auth metadata
    const metadataName = user.user_metadata?.name || user.user_metadata?.full_name;

    if (!profiles || profiles.length === 0) {
      // If no profile exists, create one with metadata name
      try {
        return await createOrUpdateProfile(
          user.id,
          user.email!,
          metadataName
        );
      } catch (createError) {
        console.error('Error creating profile in getCurrentUser:', createError);
        throw createError;
      }
    }

    const profile = profiles[0];
    
    // If profile exists but name is missing, update it with metadata name
    if (!profile.name && metadataName) {
      try {
        const { data: updatedProfile } = await supabase
          .from('users')
          .update({ name: metadataName })
          .eq('id', user.id)
          .select()
          .single();
          
        if (updatedProfile) {
          return updatedProfile;
        }
      } catch (updateError) {
        console.error('Error updating profile name:', updateError);
      }
    }

    // Return profile with name from metadata if profile name is missing
    return {
      ...profile,
      name: profile.name || metadataName || profile.email.split('@')[0]
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    console.log('Attempting sign in for email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      const errorMessage = handleAuthError(error);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (!data.user) {
      console.error('No user data returned from authentication');
      const errorMessage = 'No user data returned from authentication';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    console.log('Sign in successful, fetching user profile...');
    // Get or create user profile
    const userProfile = await getCurrentUser();
    console.log('User profile retrieved:', userProfile);
    
    return {
      user: userProfile,
      session: data.session,
      error: null,
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    toast.error(error.message || 'An error occurred during sign in');
    return {
      user: null,
      session: null,
      error: error.message,
    };
  }
};

export const signInWithProvider = async (provider: Provider): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      const errorMessage = handleAuthError(error);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (!data) {
      console.warn('No data returned from OAuth sign in');
      toast.error('Authentication failed. Please try again.');
      throw new Error('No data returned from OAuth sign in');
    }
  } catch (error) {
    console.error('Error signing in with provider:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  try {
    // First, sign up the user with their name in metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name, // Store name in auth metadata
          full_name: name
        }
      }
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

    // Then create their profile with the name
    try {
      const profile = await createOrUpdateProfile(data.user.id, email, name);
      
      // Verify the profile was created with the name
      if (!profile.name) {
        // If profile creation didn't set the name, try updating it directly
        const { error: updateError } = await supabase
          .from('users')
          .update({ name: name })
          .eq('id', data.user.id);
          
        if (updateError) {
          console.error('Error updating profile name:', updateError);
        }
      }

      toast.success('Successfully signed up! Please check your email to confirm your account.');
      return { user: { ...profile, name }, session: data.session };
    } catch (profileError) {
      console.error('Error creating user profile:', profileError);
      // Even if profile creation fails, return the user with their name
      return {
        user: {
          id: data.user.id,
          email,
          name,
          balance: 2500000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        session: data.session
      };
    }
  } catch (error) {
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    toast.success('Successfully signed out!');
  } catch (error) {
    console.error('Error signing out:', error);
    toast.error('Failed to sign out');
    throw error;
  }
};
