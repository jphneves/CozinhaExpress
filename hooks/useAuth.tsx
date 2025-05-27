import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// URL do seu backend - SUBSTITUA PELO SEU IP LOCAL ou 10.0.2.2 para emulador Android
const BACKEND_URL = 'https://cozinhaexpress-backend-production.up.railway.app'; // Ex: 'http://192.168.1.5:3000' ou 'http://10.0.2.2:3000'
const TOKEN_KEY = '@CozinhaExpress:AuthToken'; // Chave para salvar o token

interface User {
  id: string;
  email: string;
  // Adicione outros campos do usuário que sua API retorna, exceto a senha
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Para saber se ainda está carregando o estado inicial de auth
  login: (email: string, senha: string) => Promise<void>;
  register: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Começa como true

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
          // Se você tem um token, idealmente você faria uma requisição
          // para o backend para validar o token e pegar os dados do usuário.
          // Por simplicidade aqui, vamos assumir que o token é válido
          // e que os dados do usuário (ou o próprio token) são o suficiente.
          // Se o backend retornar os dados do usuário no login, você pode salvar o objeto User.
          // Aqui, para o exemplo, vamos simular que o token é o próprio e-mail para demonstração,
          // mas em um app real, seria um JWT e você decodificaria ou buscaria dados do usuário.
          
          // Tenta pegar dados do usuário se você salvou o objeto User
          const userDataString = await AsyncStorage.getItem('@CozinhaExpress:User');
          if (userDataString) {
            const userData: User = JSON.parse(userDataString);
            setUser(userData);
            setIsAuthenticated(true);
          } else if (token) {
            // Se só tem o token, você precisaria de um endpoint para pegar dados do usuário
            // ou considerar autenticado apenas com o token.
            // Exemplo simplificado:
            // setUser({ id: 'from-token', email: 'user@fromtoken.com' }); // Dados mockados
            // setIsAuthenticated(true);
            // Por ora, se temos um token mas não dados de usuário, vamos deslogar pra forçar novo login
            // ou você implementaria a chamada para /me ou /profile
            console.warn("Token encontrado, mas dados de usuário não. Implementar validação de token e busca de usuário.");
            // await logout(); // Descomente se quiser forçar logout se não houver dados de usuário
          }
        }
      } catch (e) {
        console.error('Falha ao carregar token do AsyncStorage', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const resposta = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      const resultado = await resposta.json();

      if (!resposta.ok || resultado.error) {
        throw new Error(resultado.error || 'Erro ao fazer login');
      }

      // Assumindo que o backend retorna { token: 'seu_jwt_aqui', user: { id, email, ... } }
      // Ou apenas { user: { id, email, ... } } e você não usa token JWT ainda.
      // Ou apenas um token que você vai usar para as próximas requisições.

      if (resultado.token) { // Se seu backend retornar um token JWT
        await AsyncStorage.setItem(TOKEN_KEY, resultado.token);
      }
      // Salva dados do usuário se retornados
      if (resultado.usuario) {
        const userData: User = resultado.usuario;
        setUser(userData);
        await AsyncStorage.setItem('@CozinhaExpress:User', JSON.stringify(userData)); // Salva dados do usuário
        setIsAuthenticated(true);
      } else if (resultado.id && resultado.email && resultado.senha) { // Se retorna o usuário diretamente (ajustado para incluir senha, como no seu objeto de usuário)
         const userData: User = { id: resultado.id, email: resultado.email }; // Criar objeto User sem a senha
         setUser(userData);
         await AsyncStorage.setItem('@CozinhaExpress:User', JSON.stringify(userData));
         setIsAuthenticated(true);
      }
      else {
        // Se não há token nem dados de usuário claros, algo está errado com a resposta da API
        console.error("Login bem sucedido, mas sem token ou dados de usuário na resposta:", resultado);
        throw new Error("Resposta da API de login incompleta.");
      }

    } catch (error) {
      console.error('Erro na função login do AuthProvider:', error);
      throw error; // Re-throw para ser tratado no AuthScreen
    }
  };

  const register = async (email: string, senha: string) => {
    try {
      const resposta = await fetch(`${BACKEND_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      const resultado = await resposta.json();

      if (!resposta.ok || resultado.error) {
        throw new Error(resultado.error || 'Erro ao cadastrar usuário');
      }
      
      // Opcional: Fazer login automaticamente após o cadastro
      // await login(email, senha); 
      // Ou apenas mostrar uma mensagem de sucesso e deixar o usuário logar.
      console.log('Cadastro bem-sucedido, usuário precisa fazer login:', resultado);

    } catch (error) {
      console.error('Erro na função register do AuthProvider:', error);
      throw error; // Re-throw para ser tratado no AuthScreen
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem('@CozinhaExpress:User'); // Remove dados do usuário
      setUser(null);
      setIsAuthenticated(false);
    } catch (e) {
      console.error('Falha ao remover token do AsyncStorage', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 