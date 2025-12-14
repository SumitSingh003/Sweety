import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '@/lib/api';
import { AuthUser } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);

    if (savedToken && savedUser) {
      setToken(savedToken);
      const parsedUser = JSON.parse(savedUser) as AuthUser;
      setUser(parsedUser);
      setIsAdmin(parsedUser.role === 'ADMIN');
    }

    setIsLoading(false);
  }, []);

  const persistAuth = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsAdmin(newUser.role === 'ADMIN');
  };

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data } = await authApi.register(email, password, fullName);
      persistAuth(data.accessToken, data.user);
      return { error: null };
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Registration failed';
      return { error: new Error(message) };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await authApi.login(email, password);
      persistAuth(data.accessToken, data.user);
      return { error: null };
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Sign-in failed';
      return { error: new Error(message) };
    }
  };

  const signOut = async () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, isLoading, signUp, signIn, signOut }}>
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
