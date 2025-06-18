import React, { useState } from 'react';
import { Alert, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { useColorScheme } from '../../hooks/useColorScheme';
import { styles } from '../../styles/UsuarioStyles';

const AUTH_URL = 'https://cozinhaexpress-auth.up.railway.app';

// Componente principal para exibir opções do usuário
export default function UsuarioScreen() {
  const { logout, user } = useAuth(); // Obtém funções e dados de autenticação do hook useAuth
  const colorScheme = useColorScheme() ?? 'light'; // Obtém o esquema de cores (claro ou escuro) do dispositivo
  const theme = Colors[colorScheme]; // Define o tema de cores com base no esquema

  const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);
  const [isDeleteAccountVisible, setDeleteAccountVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword) {
      Alert.alert('Erro', 'Por favor, insira sua senha atual.');
      return;
    }
    if (!newPassword) {
      Alert.alert('Erro', 'Por favor, insira sua nova senha.');
      return;
    }

    try {
      const response = await fetch(`${AUTH_URL}/api/user/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, currentPassword, newPassword }),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Sucesso', 'Senha alterada com sucesso!');
        setChangePasswordVisible(false);
        setCurrentPassword('');
        setNewPassword('');
      } else {
        Alert.alert('Erro', result.error || 'Não foi possível alterar a senha.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar alterar a senha.');
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      Alert.alert('Erro', 'Por favor, insira sua senha.');
      return;
    }

    try {
      const response = await fetch(`${AUTH_URL}/api/user/delete-account`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, password: deletePassword }),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Sucesso', 'Conta excluída com sucesso. Você será deslogado.', [
          { text: 'OK', onPress: logout }
        ]);
        setDeleteAccountVisible(false);
        setDeletePassword('');
      } else {
        Alert.alert('Erro', result.error || 'Não foi possível excluir a conta.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar excluir a conta.');
      console.error(error);
    }
  };

  // Renderiza a interface com opções do usuário
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.titulo, { color: theme.tint }]}>Opções do Usuário</Text>
      <Text style={[styles.email, { color: theme.text }]}>Email: {user?.email || 'Não disponível'}</Text>
      <Pressable style={[styles.btnLogout, { backgroundColor: theme.button, shadowColor: theme.shadow }]} onPress={logout}>
        <Text style={[styles.btnLogoutTxt, { color: theme.buttonText }]}>Sair da conta</Text>
      </Pressable>
      <Pressable 
        style={[styles.btnAction, { backgroundColor: theme.button, shadowColor: theme.shadow }]} 
        onPress={() => setChangePasswordVisible(true)}>
        <Text style={[styles.btnActionTxt, { color: theme.buttonText }]}>Alterar Senha</Text>
      </Pressable>
      <Pressable 
        style={[styles.btnDelete, { backgroundColor: '#FF0000', shadowColor: theme.shadow }]} 
        onPress={() => setDeleteAccountVisible(true)}>
        <Text style={[styles.btnDeleteTxt, { color: theme.buttonText }]}>Excluir Conta</Text>
      </Pressable>

      <Modal
        visible={isChangePasswordVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setChangePasswordVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Alterar Senha</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.text }]}
              placeholder="Senha atual"
              placeholderTextColor={theme.text}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.text }]}
              placeholder="Nova senha"
              placeholderTextColor={theme.text}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.button }]}
                onPress={() => {
                  setChangePasswordVisible(false);
                  setCurrentPassword('');
                  setNewPassword('');
                }}>
                <Text style={[styles.modalButtonText, { color: theme.buttonText }]}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.button }]}
                onPress={handleChangePassword}>
                <Text style={[styles.modalButtonText, { color: theme.buttonText }]}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isDeleteAccountVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeleteAccountVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Excluir Conta</Text>
            <Text style={[styles.modalText, { color: theme.text }]}>
              Esta ação não pode ser desfeita. Digite sua senha para confirmar.
            </Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.text }]}
              placeholder="Senha"
              placeholderTextColor={theme.text}
              secureTextEntry
              value={deletePassword}
              onChangeText={setDeletePassword}
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.button }]}
                onPress={() => {
                  setDeleteAccountVisible(false);
                  setDeletePassword('');
                }}>
                <Text style={[styles.modalButtonText, { color: theme.buttonText }]}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#FF0000' }]}
                onPress={handleDeleteAccount}>
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
} 