import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
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
  login: (phone: string) => void;
  signup: (input: SignupInput) => void;
  logout: () => void;
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

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRoleState] = useState<Role>('farmer');

  const login = useCallback((phone: string) => {
    const account: User = { ...demoUser, phone: phone.trim() || demoUser.phone };
    setUser(account);
    setActiveRoleState(account.role);
  }, []);

  const signup = useCallback((input: SignupInput) => {
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
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setActiveRoleState('farmer');
  }, []);

  const updateLocation = useCallback((state: string, district: string) => {
    setUser((current) => current ? { ...current, state, district } : current);
  }, []);

  const value = useMemo(
    () => ({
      user,
      activeRole,
      isAuthenticated: user !== null,
      login,
      signup,
      logout,
      setActiveRole: setActiveRoleState,
      updateLocation
    }),
    [user, activeRole, login, signup, logout, updateLocation]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}