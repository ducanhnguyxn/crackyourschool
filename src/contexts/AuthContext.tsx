import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  is_pro: boolean;
  subscription_status: string | null;
  pdf_count: number;
  questions_used_this_month: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, userEmail?: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, is_pro, subscription_status, pdf_count, questions_used_this_month, questions_reset_date')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" - profile might not exist yet
        console.error('Error fetching profile:', error);
        // Set a default profile so the app can continue even if fetch fails
        setProfile({
          id: userId,
          is_pro: false,
          subscription_status: null,
          pdf_count: 0,
          questions_used_this_month: 0,
        });
        return;
      }

      if (data) {
        // Check if we need to reset question count (new month)
        const resetDate = data.questions_reset_date ? new Date(data.questions_reset_date) : null;
        const now = new Date();
        const needsReset = !resetDate || 
          (resetDate.getMonth() !== now.getMonth() || resetDate.getFullYear() !== now.getFullYear());

        if (needsReset && !data.is_pro) {
          // Reset question count for new month
          const { data: updatedProfile } = await supabase
            .from('user_profiles')
            .update({ 
              questions_used_this_month: 0,
              questions_reset_date: now.toISOString()
            })
            .eq('id', userId)
            .select('id, is_pro, subscription_status, pdf_count, questions_used_this_month, questions_reset_date')
            .single();
          
          if (updatedProfile) {
            setProfile(updatedProfile);
            return;
          }
        }
        
        setProfile(data);
      } else {
        // Create default profile if it doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert({ id: userId, email: userEmail })
          .select('id, is_pro, subscription_status, pdf_count, questions_used_this_month, questions_reset_date')
          .single();
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
          // Even if profile creation fails, set a default profile object so the app can continue
          setProfile({
            id: userId,
            is_pro: false,
            subscription_status: null,
            pdf_count: 0,
            questions_used_this_month: 0,
          });
        } else if (newProfile) {
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Always set a default profile on error so the app can continue
      setProfile({
        id: userId,
        is_pro: false,
        subscription_status: null,
        pdf_count: 0,
        questions_used_this_month: 0,
      });
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Set a timeout to prevent infinite loading (max 5 seconds)
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timeout - setting loading to false');
        setLoading(false);
      }
    }, 5000);

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      
      clearTimeout(timeoutId);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email);
      } else {
        // Ensure profile is null when no user
        setProfile(null);
      }
      setLoading(false);
    }).catch((error) => {
      if (!mounted) return;
      
      clearTimeout(timeoutId);
      console.error('Error getting session:', error);
      setLoading(false); // Always set loading to false, even on error
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

