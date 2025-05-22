import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [erro, setErro] = useState('');

  const autenticar = async () => {
    const validacao = schema.safeParse({ email, senha });
    if (!validacao.success) {
      setErro(validacao.error.errors[0].message);
      return;
    }
    setErro('');
    try {
      if (modo === 'login') {
        await login(email, senha);
      } else {
        await register(email, senha);
      }
    } catch (e) {
      setErro('Erro ao autenticar');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{modo === 'login' ? 'Login' : 'Cadastro'}</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      <Pressable style={styles.btn} onPress={autenticar}>
        <Text style={styles.btnTxt}>{modo === 'login' ? 'Entrar' : 'Cadastrar'}</Text>
      </Pressable>
      <Pressable onPress={() => setModo(modo === 'login' ? 'cadastro' : 'login')}>
        <Text style={styles.link}>{modo === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  btn: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  btnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    color: '#2980b9',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  erro: {
    color: '#e74c3c',
    marginBottom: 8,
    fontSize: 15,
  },
}); 