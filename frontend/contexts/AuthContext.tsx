'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import { setToken, setUser, getUser, isAuthenticated, logout } from '@/lib/auth';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<any>;
  register: (userData: RegisterData) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      // First check if user data exists in localStorage
      const savedUser = getUser();
      if (savedUser && isAuthenticated()) {
        setUserState(savedUser);
        setLoading(false);
        
        // Verify token is still valid in background
        try {
          const userData = await authAPI.me();
          if (userData.user) {
            setUserState(userData.user);
            setUser(userData.user);
          }
        } catch (error) {
          // Token is invalid, logout
          logout();
          setUserState(null);
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authAPI.login(credentials);
    setToken(response.token);
    setUser(response.user);
    setUserState(response.user);
    return response;
  };

  const register = async (userData: RegisterData) => {
    const response = await authAPI.register(userData);
    setToken(response.token);
    setUser(response.user);
    setUserState(response.user);
    return response;
  };

  const logoutUser = () => {
    logout();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout: logoutUser,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}