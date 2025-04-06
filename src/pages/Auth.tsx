
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LogIn, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // User is already logged in, redirect to home
        navigate('/');
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">MediMate</CardTitle>
          <CardDescription className="text-center">
            Sign in to save your medication reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button 
            onClick={handleGoogleSignIn} 
            disabled={loading} 
            className="w-full"
            variant="outline"
          >
            <LogIn className="mr-2 h-4 w-4" />
            {loading ? "Connecting..." : "Continue with Google"}
          </Button>
          
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or
            </span>
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
          
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="w-full mt-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to App (View Only Mode)
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sign in is only required for saving data.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
