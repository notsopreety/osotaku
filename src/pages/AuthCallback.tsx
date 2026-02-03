import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// This page handles the OAuth callback redirect
const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // The AuthContext handles extracting the token from the hash
    // After a short delay, redirect to profile or home
    const timer = setTimeout(() => {
      const hash = window.location.hash;
      if (hash.includes('access_token')) {
        navigate('/profile');
      } else {
        navigate('/login');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">Completing login...</p>
    </div>
  );
};

export default AuthCallback;
