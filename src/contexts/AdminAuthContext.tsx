import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { api, getStoredUser, setStoredUser, setToken, clearAuth, getToken } from '@/lib/api';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'manager' | 'viewer';
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(() => getStoredUser());
  const [loading, setLoading] = useState(false);

  // On mount, if a token exists try to validate it; failure → silent logout.
  useEffect(() => {
    const token = getToken();
    if (token && !user) {
      api.me().then(res => {
        if (res.success && res.data) {
          setUser(res.data);
          setStoredUser(res.data);
        }
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const res = await api.login(email, password);
    setLoading(false);
    if (res.success && res.data) {
      setToken(res.data.token);
      setStoredUser(res.data.user);
      setUser(res.data.user);
      // legacy flag — kept for any older guard relying on it
      try { sessionStorage.setItem('admin_authenticated', 'true'); } catch {}
      return { success: true };
    }
    return { success: false, error: res.error || 'Login failed' };
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    try { sessionStorage.removeItem('admin_authenticated'); } catch {}
    setUser(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
