import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  billing_status: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionData {
  status: string;
  customer_id: string | null;
  subscription_id: string | null;
  current_period_end: number | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  subscription: SubscriptionData | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonctions de fetch isolées
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) console.error('Error fetching profile:', error);
      return data;
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  };

  const fetchSubscription = async (userId: string) => {
    try {
      const { data: customer } = await supabase
        .from('stripe_customers')
        .select('customer_id')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .maybeSingle();

      if (!customer?.customer_id) {
        return { status: 'none', customer_id: null, subscription_id: null, current_period_end: null };
      }

      const { data: sub } = await supabase
        .from('stripe_subscriptions')
        .select('status, subscription_id, current_period_end')
        .eq('customer_id', customer.customer_id)
        .maybeSingle();

      return {
        status: sub?.status || 'none',
        customer_id: customer.customer_id,
        subscription_id: sub?.subscription_id || null,
        current_period_end: sub?.current_period_end || null,
      };
    } catch (err) {
      console.error('Unexpected error fetching subscription:', err);
      return null;
    }
  };

  // 1. Gestionnaire de Session (Simple et Rapide)
  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) setLoading(false); // Stop loading immediately if no user
    });

    // Listener for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setProfile(null);
        setSubscription(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Gestionnaire de Données (Réagit au changement de 'user')
  useEffect(() => {
    let isMounted = true;

    async function loadUserData() {
      if (user) {
        // Ne pas remettre loading à true ici pour éviter le clignotement
        // ou les conflits pendant les updates
        try {
          const [profileData, subData] = await Promise.all([
            fetchProfile(user.id),
            fetchSubscription(user.id),
          ]);
          
          if (isMounted) {
            setProfile(profileData);
            setSubscription(subData);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          if (isMounted) setLoading(false);
        }
      }
    }

    loadUserData();

    return () => { isMounted = false; };
  }, [user?.id]); // Ne se déclenche que si l'ID utilisateur change

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSubscription(null);
    setUser(null);
    setSession(null);
  };

  const refreshProfile = async () => {
    if (user) {
      const data = await fetchProfile(user.id);
      setProfile(data);
    }
  };

  const refreshSubscription = async () => {
    if (user) {
      const data = await fetchSubscription(user.id);
      setSubscription(data);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        subscription,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
        refreshSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}