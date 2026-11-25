import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AUTH_STORAGE_KEY = 'hm_admin_auth_v1';

const DEFAULT_ADMIN = {
  email: 'admin@homeandmore.ng',
  password: 'admin1234',
  name: 'Super Admin',
  role: 'admin',
  avatar: '/images/stock/photo-1507003211169-0a1dd7228f2d.jpg',
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Could not persist auth state', e);
    }
  }, [user]);

  const login = useCallback(async (email, password) => {
    setAuthError(null);
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '').trim();

    // Check credentials
    if (
      cleanEmail === DEFAULT_ADMIN.email.toLowerCase() &&
      cleanPassword === DEFAULT_ADMIN.password
    ) {
      const loggedInUser = {
        email: DEFAULT_ADMIN.email,
        name: DEFAULT_ADMIN.name,
        role: DEFAULT_ADMIN.role,
        avatar: DEFAULT_ADMIN.avatar,
        token: `hm_token_${Date.now()}`,
      };
      setUser(loggedInUser);
      return { success: true };
    } else {
      const err = 'Invalid email address or password. Please check your credentials.';
      setAuthError(err);
      return { success: false, error: err };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAuthError(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
        authError,
        setAuthError,
        defaultAdminEmail: DEFAULT_ADMIN.email,
        defaultAdminPassword: DEFAULT_ADMIN.password,
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
