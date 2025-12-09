import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
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
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
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
            .select('id, is_pro, subscription_status, pdf_count, questions_used_this_month')
            .single();
          
          if (updatedProfile) {
            setProfile(updatedProfile);
            return;
          }
        }
        
        setProfile(data);
      } else {
        // Create default profile if it doesn't exist
        const { data: newProfile } = await supabase
          .from('user_profiles')
          .insert({ id: userId, email: userEmail })
          .select('id, is_pro, subscription_status, pdf_count, questions_used_this_month')
          .single();
        if (newProfile) setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email);
      }
      setLoading(false);
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

    return () => subscription.unsubscribe();
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

