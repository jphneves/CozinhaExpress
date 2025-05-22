import React, { createContext, ReactNode, useContext, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (email: string, senha: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, senha: string) => {
    // Aqui você pode plugar um backend depois
    if (email && senha) setIsAuthenticated(true);
  };

  const register = async (email: string, senha: string) => {
    // Aqui você pode plugar um backend depois
    if (email && senha) setIsAuthenticated(true);
  };

  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro do AuthProvider');
  return ctx;
} 