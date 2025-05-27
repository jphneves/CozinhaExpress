import { Ionicons } from '@expo/vector-icons';
import 'cross-fetch/polyfill';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { z } from 'zod';
import { Colors } from '../constants/Colors';
import { useAuth } from '../hooks/useAuth';
import { useColorScheme } from '../hooks/useColorScheme';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  // nome: z.string().optional(), // REMOVER
});

// URL do seu backend - SUBSTITUA PELO SEU IP LOCAL ou 10.0.2.2 para emulador Android
const BACKEND_URL = 'https://cozinhaexpress-backend-production.up.railway.app'; 

async function cadastrarUsuarioApi(email: string, senha: string) {
  const resposta = await fetch(`${BACKEND_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  const resultado = await resposta.json();
  if (!resposta.ok) { // Verifica se a resposta da API foi bem sucedida
    throw new Error(resultado.error || 'Erro ao cadastrar usuário');
  }
  return resultado.usuario;
}

async function loginUsuarioApi(email: string, senha: string) {
  const resposta = await fetch(`${BACKEND_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  const resultado = await resposta.json();
  if (!resposta.ok) { // Verifica se a resposta da API foi bem sucedida
    throw new Error(resultado.error || 'Erro ao fazer login');
  }
  return resultado.usuario; // ou resultado.token se você retornar um token
}

export default function AuthScreen() {
  const { login, register, isLoading: isLoadingAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [erro, setErro] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const senhaMinLength = 6; // conforme schema do zod

  const autenticar = async () => {
    const validacao = schema.safeParse({ email, senha });
    if (!validacao.success) {
      setErro(validacao.error.errors[0].message);
      return;
    }
    setErro('');
    setIsSubmitting(true);
    try {
      if (modo === 'login') {
        await login(email, senha);
      } else {
        await register(email, senha);
        alert('Cadastro realizado com sucesso! Por favor, faça o login.');
        setModo('login');
      }
    } catch (e: any) {
      setErro(e.message || 'Erro ao autenticar');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerBox}>
        <Ionicons name="restaurant" size={38} color={theme.tint} style={{ marginBottom: 6 }} />
        <Text style={styles.appName}>CozinhaExpress</Text>
        <Text style={styles.subTitle}>
          {modo === 'login'
            ? 'Realize seu login para acessar suas receitas e dicas culinárias.'
            : `Realize seu cadastro para começar a salvar e explorar receitas!`}
        </Text>
      </View>
      <View style={styles.formBox}>
        <Text style={[styles.titulo, { color: theme.tint, textAlign: 'center' }]}>
          {modo === 'login' ? 'Login' : 'Cadastro'}
        </Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.inputBorder, backgroundColor: theme.card, color: theme.text },
          ]}
          placeholder="E-mail"
          placeholderTextColor={theme.text + '99'}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isSubmitting}
        />
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.inputBorder, backgroundColor: theme.card, color: theme.text },
          ]}
          placeholder="Senha"
          placeholderTextColor={theme.text + '99'}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          editable={!isSubmitting}
        />
        {modo === 'cadastro' && (
          <Text style={styles.senhaInfo}>
            A senha deve ter pelo menos {senhaMinLength} caracteres.
          </Text>
        )}
      </View>
      {erro ? <Text style={[styles.erro, { color: Colors.light.icon }]}>{erro}</Text> : null}
      <Pressable
        style={[styles.btn, { backgroundColor: theme.button, shadowColor: theme.shadow }, isSubmitting && styles.btnDisabled]}
        onPress={autenticar}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color={theme.buttonText} />
        ) : (
          <Text style={[styles.btnTxt, { color: theme.buttonText }]}>{modo === 'login' ? 'Entrar' : 'Cadastrar'}</Text>
        )}
      </Pressable>
      <Pressable onPress={() => {
        if (isSubmitting) return;
        setModo(modo === 'login' ? 'cadastro' : 'login');
        setErro('');
        setEmail('');
        setSenha('');
      }} disabled={isSubmitting}>
        <Text style={[styles.link, { color: theme.icon }]}>{modo === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  headerBox: {
    alignItems: 'center',
    position: 'absolute',
    top: 36,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 24,
  },
  formBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF7043',
    letterSpacing: 1,
    marginBottom: 2,
  },
  subTitle: {
    fontSize: 14,
    color: '#6D4C41',
    textAlign: 'center',
    marginBottom: 2,
    marginTop: 2,
    fontWeight: '500',
  },
  senhaInfo: {
    fontSize: 12,
    color: '#E53935',
    marginTop: 2,
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 28,
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    maxWidth: 340,
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    fontSize: 17,
    marginBottom: 14,
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 18,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnTxt: {
    fontWeight: 'bold',
    fontSize: 19,
    letterSpacing: 0.5,
  },
  link: {
    textDecorationLine: 'underline',
    fontSize: 16,
    marginTop: 2,
  },
  erro: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: 'bold',
  },
}); 