import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthResponse, ApiResponse } from '../types';
import apiClient from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('marketmind_token');
    const savedUser = localStorage.getItem('marketmind_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('marketmind_token');
        localStorage.removeItem('marketmind_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', {
      email,
      password,
    });

    const data = response.data.data;
    const userData: User = {
      id: data.userId,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
    };

    setToken(data.token);
    setUser(userData);
    localStorage.setItem('marketmind_token', data.token);
    localStorage.setItem('marketmind_user', JSON.stringify(userData));
  };

  const register = async (fullName: string, email: string, password: string) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', {
      fullName,
      email,
      password,
    });

    const data = response.data.data;
    const userData: User = {
      id: data.userId,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
    };

    setToken(data.token);
    setUser(userData);
    localStorage.setItem('marketmind_token', data.token);
    localStorage.setItem('marketmind_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('marketmind_token');
    localStorage.removeItem('marketmind_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
