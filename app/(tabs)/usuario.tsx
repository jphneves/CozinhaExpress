import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function UsuarioScreen() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Opções do Usuário</Text>
      <Pressable style={styles.btnLogout} onPress={logout}>
        <Text style={styles.btnLogoutTxt}>Sair da conta</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  btnLogout: {
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  btnLogoutTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 