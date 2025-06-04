import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { useColorScheme } from '../../hooks/useColorScheme';

const BACKEND_URL = 'https://cozinhaexpress-backend-production.up.railway.app';

export default function UsuarioScreen() {
  const { logout, user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    letterSpacing: 1,
  },
  email: {
    fontSize: 18,
    marginBottom: 32,
    textAlign: 'center',
  },
  btnLogout: {
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 12,
    marginTop: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
    width: '80%',
  },
  btnLogoutTxt: {
    fontWeight: 'bold',
    fontSize: 19,
    letterSpacing: 0.5,
  },
  btnAction: {
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 12,
    marginTop: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
    width: '80%',
  },
  btnActionTxt: {
    fontWeight: 'bold',
    fontSize: 19,
    letterSpacing: 0.5,
  },
  btnDelete: {
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 12,
    marginTop: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
    width: '80%',
  },
  btnDeleteTxt: {
    fontWeight: 'bold',
    fontSize: 19,
    letterSpacing: 0.5,
  },
}); 