import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    marginBottom: 8,
  },
  imagem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoria: {
    fontSize: 14,
    marginBottom: 4,
  },
  descricao: {
    fontSize: 14,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  imagemModal: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  nomeModal: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoriaModal: {
    fontSize: 16,
    marginBottom: 16,
  },
  instrucoes: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  ingrediente: {
    fontSize: 16,
    lineHeight: 22,
  },
  fecharBtn: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  fecharBtnTxt: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buscaContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  inputBusca: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  btnBusca: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnBuscaTxt: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  limparBusca: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
}); 