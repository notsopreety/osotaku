import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, LogInIcon, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

// Default client ID for the app
const DEFAULT_CLIENT_ID = '35488';

const Login = () => {
  const { login, clientId, setClientId, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Set default client ID on mount if not already set
  useEffect(() => {
    if (!clientId) {
      setClientId(DEFAULT_CLIENT_ID);
    }
  }, [clientId, setClientId]);

  // If already logged in, redirect to profile
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        {/* Logo */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-2xl shadow-primary/20">
            <img src="/logo.webp" alt="OsOtaku" className="w-17 h-17 rounded-lg object-cover" />
          </div>
          <h1 className="text-3xl font-bold mb-2">OsOtaku</h1>
          <p className="text-muted-foreground">
            Track, discover, and share your anime journey
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-lg">
          <CardContent className="pt-6 space-y-4">
            <Button
              size="lg"
              className="w-full gap-3 h-14 text-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25"
              onClick={login}
            >
              <LogInIcon className="w-6 h-6" />
              Continue with AniList
            </Button>
            
            <p className="text-center text-xs text-muted-foreground">
              You'll be redirected to AniList to authorize access
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <FeatureItem icon="📋" label="Sync List" />
          <FeatureItem icon="❤️" label="Favorites" />
          <FeatureItem icon="📊" label="Stats" />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Powered by{' '}
          <a
            href="https://anilist.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            AniList
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </motion.div>
    </div>
  );
};

function FeatureItem({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="p-3 rounded-lg bg-card/50">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export default Login;
