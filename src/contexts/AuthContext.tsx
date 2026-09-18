import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Role, User } from '../types';

export interface SignupInput {
  name: string;
  phone: string;
  password: string;
  role: Role;
  state: string;
  district: string;
}

interface AuthContextValue {
  user: User | null;
  /** The role the app is currently presenting — may differ from user.role via "View as". */
  activeRole: Role;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<string | null>;
  signup: (input: SignupInput) => Promise<string | null>;
  logout: () => Promise<void>;
  setActiveRole: (role: Role) => void;
  updateLocation: (state: string, district: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** The account used for the quick demo log-in. */
const demoUser: User = {
  id: 'usr-demo',
  name: 'Ramesh Patel',
  phone: '+91 98250 41233',
  role: 'farmer',
  state: 'gujarat',
  district: 'anand'
};

/** Normalize phone to 10-digit format for consistent storage */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(-10);
  return digits.length === 10 ? `+91${digits}` : raw.trim();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRoleState] = useState<Role>('farmer');
  const [isLoading, setIsLoading] = useState(true);

  // ── Session restoration ──────────────────────────────────────
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const meta = session.user.user_metadata ?? {};
          setUser({
            id: session.user.id,
            name: meta.name ?? '',
            phone: meta.phone ?? session.user.phone ?? '',
            role: meta.role ?? 'farmer',
            state: meta.state ?? '',
            district: meta.district ?? '',
          });
          setActiveRoleState(meta.role ?? 'farmer');
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const meta = session.user.user_metadata ?? {};
          setUser({
            id: session.user.id,
            name: meta.name ?? '',
            phone: meta.phone ?? session.user.phone ?? '',
            role: meta.role ?? 'farmer',
            state: meta.state ?? '',
            district: meta.district ?? '',
          });
          setActiveRoleState(meta.role ?? 'farmer');
        } else {
          setUser(null);
          setActiveRoleState('farmer');
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Demo mode: try to restore from localStorage
      const saved = localStorage.getItem('km_demo_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as User;
          setUser(parsed);
          setActiveRoleState(parsed.role);
        } catch { /* ignore */ }
      }
      setIsLoading(false);
    }
  }, []);

  // ── Demo persistence ─────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) {
      if (user) {
        localStorage.setItem('km_demo_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('km_demo_user');
      }
    }
  }, [user]);

  // ── Login ────────────────────────────────────────────────────
  const login = useCallback(async (phone: string, _password: string): Promise<string | null> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        phone: normalizePhone(phone),
        password: _password,
      });
      if (error) return error.message;
      return null;
    }
    // Demo fallback
    const account: User = { ...demoUser, phone: phone.trim() || demoUser.phone };
    setUser(account);
    setActiveRoleState(account.role);
    return null;
  }, []);

  // ── Signup ───────────────────────────────────────────────────
  const signup = useCallback(async (input: SignupInput): Promise<string | null> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signUp({
        phone: normalizePhone(input.phone),
        password: input.password,
        options: {
          data: {
            name: input.name.trim(),
            role: input.role,
            state: input.state,
            district: input.district,
          },
        },
      });
      if (error) return error.message;
      return null;
    }
    // Demo fallback
    const account: User = {
      id: `usr-${Date.now()}`,
      name: input.name.trim(),
      phone: input.phone.trim(),
      role: input.role,
      state: input.state,
      district: input.district
    };
    setUser(account);
    setActiveRoleState(account.role);
    return null;
  }, []);

  // ── Logout ───────────────────────────────────────────────────
  const logout = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setActiveRoleState('farmer');
  }, []);

  // ── Update location ──────────────────────────────────────────
  const updateLocation = useCallback((state: string, district: string) => {
    setUser((current) => current ? { ...current, state, district } : current);
  }, []);

  const value = useMemo(
    () => ({
      user,
      activeRole,
      isAuthenticated: user !== null,
      isLoading,
      login,
      signup,
      logout,
      setActiveRole: setActiveRoleState,
      updateLocation
    }),
    [user, activeRole, isLoading, login, signup, logout, updateLocation]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}