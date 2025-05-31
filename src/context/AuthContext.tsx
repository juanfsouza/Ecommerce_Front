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
    const token = Cookies.get('token');
    console.log('Verificando token no AuthContext:', token);
    if (token) {
      api
        .get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log('Perfil do usuário carregado:', response.data);
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Erro ao carregar perfil:', error);
          Cookies.remove('token');
          setUser(null); // Apenas limpa o estado, sem redirecionamento
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    console.log('Tentando login com:', credentials);
    const response = await api.post('/auth/login', credentials);
    const { access_token } = response.data;
    Cookies.set('token', access_token, { expires: 1 });
    const profileResponse = await api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    setUser(profileResponse.data);
    console.log('Usuário logado, redirecionando para /');
    router.push('/'); // Redireciona para a página inicial
  };

  const register = async (credentials: RegisterCredentials) => {
    console.log('Tentando registro com:', credentials);
    const response = await api.post('/auth/register', credentials);
    console.log('Registro concluído, redirecionando para /login');
    router.push('/login'); // Redireciona para a página de login
  };

  const logout = () => {
    console.log('Logout iniciado');
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