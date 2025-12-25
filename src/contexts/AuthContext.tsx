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

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  };

  const fetchSubscription = async (userId: string) => {
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
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  const refreshSubscription = async () => {
    if (user) {
      const subData = await fetchSubscription(user.id);
      setSubscription(subData);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        Promise.all([
          fetchProfile(session.user.id),
          fetchSubscription(session.user.id),
        ]).then(([profileData, subData]) => {
          setProfile(profileData);
          setSubscription(subData);
          setLoading(false);
        }).catch((error) => {
          console.error('Error loading user data:', error);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Error getting session:', error);
      setLoading(false);
    });

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        (async () => {
          try {
            const [profileData, subData] = await Promise.all([
              fetchProfile(session.user.id),
              fetchSubscription(session.user.id),
            ]);
            setProfile(profileData);
            setSubscription(subData);
            setLoading(false);
          } catch (error) {
            console.error('Error in auth state change:', error);
            setLoading(false);
          }
        })();
      } else {
        setProfile(null);
        setSubscription(null);
        setLoading(false);
      }
    });

    return () => authSubscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSubscription(null);
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
