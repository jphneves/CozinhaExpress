import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  },
  erro: {
    marginBottom: 16,
  },
  btn: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    padding: 10,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  input: {
    width: '100%',
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
}); 