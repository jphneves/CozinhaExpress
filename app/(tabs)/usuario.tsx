import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function UsuarioScreen() {
  const { logout } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.titulo, { color: theme.tint }]}>Opções do Usuário</Text>
      <Pressable style={[styles.btnLogout, { backgroundColor: theme.button, shadowColor: theme.shadow }]} onPress={logout}>
        <Text style={[styles.btnLogoutTxt, { color: theme.buttonText }]}>Sair da conta</Text>
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
    marginBottom: 32,
    letterSpacing: 1,
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
  },
  btnLogoutTxt: {
    fontWeight: 'bold',
    fontSize: 19,
    letterSpacing: 0.5,
  },
}); 