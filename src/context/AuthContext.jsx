import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LEGACY_AUTH_STORAGE_KEY = 'hm_admin_auth_v1';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000; // 60-second cooldown after 5 failed attempts

const AuthContext = createContext(null);

function mapSupabaseUser(sbUser) {
  if (!sbUser) return null;
  return {
    id: sbUser.id,
    email: sbUser.email || '',
    name: sbUser.user_metadata?.name || 'Store Admin',
    role: sbUser.app_metadata?.role || 'admin',
    avatar: sbUser.user_metadata?.avatar || '',
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);

  // Evict legacy insecure client-side auth token if present
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
    } catch {}
  }, []);

  // Verify real Supabase Auth JWT session on mount & listen for auth state changes
  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured || !supabase) {
      setIsAuthLoading(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) return;
        setUser(mapSupabaseUser(data?.session?.user));
        setIsAuthLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setUser(null);
        setIsAuthLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUser(mapSupabaseUser(session?.user));
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const login = useCallback(
    async (email, password) => {
      setAuthError(null);

      // Client-side brute-force cooldown
      const now = Date.now();
      if (lockedUntil && now < lockedUntil) {
        const secondsLeft = Math.ceil((lockedUntil - now) / 1000);
        const err = `Too many failed sign-in attempts. Please wait ${secondsLeft}s before trying again.`;
        setAuthError(err);
        return { success: false, error: err };
      }

      if (!isSupabaseConfigured || !supabase) {
        const err = 'Authentication service is not configured. Please contact the site administrator.';
        setAuthError(err);
        return { success: false, error: err };
      }

      const cleanEmail = String(email || '').trim().toLowerCase();
      const cleanPassword = String(password || '');

      if (!cleanEmail || !cleanPassword) {
        const err = 'Please enter both your email address and password.';
        setAuthError(err);
        return { success: false, error: err };
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error || !data?.session?.user) {
          const nextAttempts = failedAttempts + 1;
          setFailedAttempts(nextAttempts);
          if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
            setLockedUntil(Date.now() + LOCKOUT_MS);
            setFailedAttempts(0);
          }
          // Generic error message prevents account enumeration
          const err = 'Invalid email address or password.';
          setAuthError(err);
          return { success: false, error: err };
        }

        setFailedAttempts(0);
        setLockedUntil(0);
        setUser(mapSupabaseUser(data.session.user));
        return { success: true };
      } catch {
        const err = 'Unable to sign in right now. Please check your connection and try again.';
        setAuthError(err);
        return { success: false, error: err };
      }
    },
    [failedAttempts, lockedUntil]
  );

  const logout = useCallback(async () => {
    setAuthError(null);
    setUser(null);
    try {
      localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch {}
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAuthLoading,
        login,
        logout,
        authError,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
