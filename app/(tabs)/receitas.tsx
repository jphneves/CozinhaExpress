import React, { useEffect, useState } from 'react';
import { FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TelaReceitas() {
  const [receitas, setReceitas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [receitaSelecionada, setReceitaSelecionada] = useState<any | null>(null);
  const [busca, setBusca] = useState('');
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
      .then(res => res.json())
      .then(data => {
        setReceitas(data.meals || []);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  const abrirDetalhes = (receita: any) => {
    setReceitaSelecionada(receita);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setReceitaSelecionada(null);
  };

  const buscarPorIngrediente = () => {
    if (!busca.trim()) return;
    setCarregando(true);
    setBuscando(true);
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(busca)}`)
      .then(res => res.json())
      .then(data => {
        if (data.meals) {
          // Buscar detalhes completos de cada receita encontrada
          Promise.all(
            data.meals.map((meal: any) =>
              fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                .then(res => res.json())
                .then(d => d.meals[0])
            )
          ).then(receitasDetalhadas => {
            setReceitas(receitasDetalhadas);
            setCarregando(false);
          });
        } else {
          setReceitas([]);
          setCarregando(false);
        }
      })
      .catch(() => setCarregando(false));
  };

  // Função para buscar receitas padrão (todas)
  const buscarReceitasPadrao = () => {
    setCarregando(true);
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
      .then(res => res.json())
      .then(data => {
        setReceitas(data.meals || []);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  };

  useEffect(() => {
    buscarReceitasPadrao();
  }, []);

  if (carregando) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>CozinhaExpress</Text>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>CozinhaExpress</Text>
      <View style={styles.buscaContainer}>
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar por ingrediente"
          value={busca}
          onChangeText={setBusca}
          onSubmitEditing={buscarPorIngrediente}
          returnKeyType="search"
        />
        <Pressable style={styles.btnBusca} onPress={buscarPorIngrediente}>
          <Text style={styles.btnBuscaTxt}>Buscar</Text>
        </Pressable>
      </View>
      {buscando && (
        <Pressable onPress={() => {
          setBuscando(false);
          setBusca('');
          buscarReceitasPadrao();
        }}>
          <Text style={styles.limparBusca}>Limpar busca</Text>
        </Pressable>
      )}
      <FlatList
        data={receitas}
        keyExtractor={item => item.idMeal}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => abrirDetalhes(item)}>
            <Image source={{ uri: item.strMealThumb }} style={styles.imagem} />
            <View style={styles.info}>
              <Text style={styles.nome}>{item.strMeal}</Text>
              <Text style={styles.categoria}>{item.strCategory} | {item.strArea}</Text>
              <Text style={styles.descricao} numberOfLines={3}>{item.strInstructions}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {receitaSelecionada && (
                <>
                  <Image source={{ uri: receitaSelecionada.strMealThumb }} style={styles.imagemModal} />
                  <Text style={styles.nomeModal}>{receitaSelecionada.strMeal}</Text>
                  <Text style={styles.categoriaModal}>{receitaSelecionada.strCategory} | {receitaSelecionada.strArea}</Text>
                  <Text style={styles.tituloSecao}>Instruções</Text>
                  <Text style={styles.instrucoes}>{receitaSelecionada.strInstructions}</Text>
                  <Text style={styles.tituloSecao}>Ingredientes</Text>
                  {Array.from({ length: 20 }).map((_, i) => {
                    const ingrediente = receitaSelecionada[`strIngredient${i+1}`];
                    const medida = receitaSelecionada[`strMeasure${i+1}`];
                    if (ingrediente && ingrediente.trim()) {
                      return (
                        <Text key={i} style={styles.ingrediente}>{`- ${ingrediente} ${medida ? `(${medida})` : ''}`}</Text>
                      );
                    }
                    return null;
                  })}
                </>
              )}
            </ScrollView>
            <Pressable style={styles.fecharBtn} onPress={fecharModal}>
              <Text style={styles.fecharBtnTxt}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#888',
    marginBottom: 4,
  },
  descricao: {
    fontSize: 14,
    color: '#444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    maxHeight: '85%',
    elevation: 5,
  },
  imagemModal: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  nomeModal: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoriaModal: {
    fontSize: 16,
    color: '#888',
    marginBottom: 12,
    textAlign: 'center',
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  instrucoes: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
  },
  ingrediente: {
    fontSize: 15,
    color: '#333',
    marginLeft: 8,
  },
  fecharBtn: {
    marginTop: 16,
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  fecharBtnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  inputBusca: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  btnBusca: {
    backgroundColor: '#27ae60',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnBuscaTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  limparBusca: {
    color: '#e74c3c',
    marginBottom: 8,
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
});