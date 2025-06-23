import { Ionicons } from '@expo/vector-icons';
import 'cross-fetch/polyfill';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { z } from 'zod';
import { Colors } from '../constants/Colors';
import { useAuth } from '../hooks/useAuth';
import { useColorScheme } from '../hooks/useColorScheme';
import { styles } from '../styles/AuthScreenStyles';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  // nome: z.string().optional(), // REMOVER
});

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