'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { User, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se há um token ao carregar o app
    const token = Cookies.get('token');
    if (token) {
      api
        .get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser({ id: response.data.id, email: response.data.email, name: response.data.name });
        })
        .catch(() => {
          Cookies.remove('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    const { access_token } = response.data;
    Cookies.set('token', access_token, { expires: 1 }); // Expira em 1 dia
    const profileResponse = await api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    setUser(profileResponse.data);
    router.push('/dashboard');
  };

  const register = async (credentials: RegisterCredentials) => {
    await api.post('/auth/register', credentials);
    // Após registro, fazer login automaticamente
    await login({ email: credentials.email, password: credentials.password });
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}