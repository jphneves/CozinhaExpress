import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { useColorScheme } from '../../hooks/useColorScheme';
import { styles } from '../../styles/UsuarioStyles';

// URL do backend para chamadas de API
const BACKEND_URL = 'https://cozinhaexpress-backend-production.up.railway.app';

// Componente principal para exibir opções do usuário
export default function UsuarioScreen() {
  const { logout, user } = useAuth(); // Obtém funções e dados de autenticação do hook useAuth
  const colorScheme = useColorScheme() ?? 'light'; // Obtém o esquema de cores (claro ou escuro) do dispositivo
  const theme = Colors[colorScheme]; // Define o tema de cores com base no esquema

  // Função para alterar a senha do usuário
  const changePassword = () => {
    Alert.prompt(
      'Alterar Senha',
      'Digite sua senha atual:',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Próximo',
          onPress: (currentPassword) => {
            if (!currentPassword) {
              Alert.alert('Erro', 'Por favor, insira sua senha atual.');
              return;
            }
            Alert.prompt(
              'Alterar Senha',
              'Digite sua nova senha:',
              [
                {
                  text: 'Cancelar',
                  style: 'cancel',
                },
                {
                  text: 'Confirmar',
                  onPress: async (newPassword) => {
                    if (!newPassword) {
                      Alert.alert('Erro', 'Por favor, insira sua nova senha.');
                      return;
                    }
                    try {
                      const response = await fetch(`${BACKEND_URL}/api/user/change-password`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: user?.email, currentPassword, newPassword }),
                      });
                      const result = await response.json();
                      if (response.ok) {
                        Alert.alert('Sucesso', 'Senha alterada com sucesso!');
                      } else {
                        Alert.alert('Erro', result.error || 'Não foi possível alterar a senha.');
                      }
                    } catch (error) {
                      Alert.alert('Erro', 'Ocorreu um erro ao tentar alterar a senha.');
                      console.error(error);
                    }
                  },
                  style: 'default',
                },
              ],
              'secure-text'
            );
          },
          style: 'default',
        },
      ],
      'secure-text'
    );
  };

  // Função para excluir a conta do usuário
  const deleteAccount = () => {
    Alert.prompt(
      'Excluir Conta',
      'Digite sua senha para confirmar a exclusão da conta. Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async (password) => {
            if (!password) {
              Alert.alert('Erro', 'Por favor, insira sua senha.');
              return;
            }
            try {
              const response = await fetch(`${BACKEND_URL}/api/user/delete-account`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user?.email, password }),
              });
              const result = await response.json();
              if (response.ok) {
                Alert.alert('Sucesso', 'Conta excluída com sucesso. Você será deslogado.', [
                  { text: 'OK', onPress: logout }
                ]);
              } else {
                Alert.alert('Erro', result.error || 'Não foi possível excluir a conta.');
              }
            } catch (error) {
              Alert.alert('Erro', 'Ocorreu um erro ao tentar excluir a conta.');
              console.error(error);
            }
          },
          style: 'destructive',
        },
      ],
      'secure-text'
    );
  };

  // Renderiza a interface com opções do usuário
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.titulo, { color: theme.tint }]}>Opções do Usuário</Text>
      <Text style={[styles.email, { color: theme.text }]}>Email: {user?.email || 'Não disponível'}</Text>
      <Pressable style={[styles.btnLogout, { backgroundColor: theme.button, shadowColor: theme.shadow }]} onPress={logout}>
        <Text style={[styles.btnLogoutTxt, { color: theme.buttonText }]}>Sair da conta</Text>
      </Pressable>
      <Pressable style={[styles.btnAction, { backgroundColor: theme.button, shadowColor: theme.shadow }]} onPress={changePassword}>
        <Text style={[styles.btnActionTxt, { color: theme.buttonText }]}>Alterar Senha</Text>
      </Pressable>
      <Pressable style={[styles.btnDelete, { backgroundColor: '#FF0000', shadowColor: theme.shadow }]} onPress={deleteAccount}>
        <Text style={[styles.btnDeleteTxt, { color: theme.buttonText }]}>Excluir Conta</Text>
      </Pressable>
    </View>
  );
} 