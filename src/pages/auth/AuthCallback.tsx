import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { createOrUpdateProfile } from '../../services/auth/supabaseAuth';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Auth callback error:', sessionError);
          toast.error('Authentication failed. Please try again.');
          throw sessionError;
        }

        if (session?.user) {
          console.log('Session established:', session);
          
          // Create or update user profile
          try {
            const { user } = session;
            await createOrUpdateProfile(
              user.id,
              user.email!,
              user.user_metadata?.full_name || user.user_metadata?.name
            );
            toast.success('Successfully signed in!');
            navigate('/', { replace: true });
          } catch (profileError) {
            console.error('Error creating user profile:', profileError);
            toast.error('Error creating user profile. Please try again.');
            navigate('/login', { replace: true });
          }
        } else {
          console.warn('No session found after callback');
          toast.error('Authentication failed. Please try again.');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        toast.error('An error occurred during authentication.');
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Completing sign in...
          </h2>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
