import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BACKEND_URL } from '../../constants/Api';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { styles } from '../../styles/IndexStyles';

// Componente principal para exibir a lista de receitas
export default function TelaReceitas() {
  // Estados para gerenciar a lista de receitas, carregamento, modal de detalhes e busca
  const [receitas, setReceitas] = useState<any[]>([]); // Armazena a lista de receitas obtidas da API
  const [carregando, setCarregando] = useState(true); // Indica se os dados estão sendo carregados
  const [modalVisible, setModalVisible] = useState(false); // Controla a visibilidade do modal de detalhes da receita
  const [receitaSelecionada, setReceitaSelecionada] = useState<any | null>(null); // Armazena a receita selecionada para exibir no modal
  const [busca, setBusca] = useState(''); // Armazena o texto de busca por ingrediente
  const [buscando, setBuscando] = useState(false); // Indica se uma busca por ingrediente está ativa
  const colorScheme = useColorScheme() ?? 'light'; // Obtém o esquema de cores (claro ou escuro) do dispositivo
  const theme = Colors[colorScheme]; // Define o tema de cores com base no esquema

  // Efeito para carregar receitas padrão ao iniciar o componente
  /* useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
      .then(res => res.json())
      .then(data => {
        setReceitas(data.meals || []); // Atualiza o estado com a lista de receitas
        setCarregando(false); // Finaliza o estado de carregamento
      })
      .catch(() => setCarregando(false)); // Em caso de erro, finaliza o carregamento
  }, []); */

  // Função para abrir o modal com os detalhes de uma receita selecionada
  const abrirDetalhes = (receita: any) => {
    setReceitaSelecionada(receita); // Define a receita selecionada
    setModalVisible(true); // Mostra o modal
  };

  // Função para fechar o modal de detalhes
  const fecharModal = () => {
    setModalVisible(false); // Esconde o modal
    setReceitaSelecionada(null); // Limpa a receita selecionada
  };

  // Função para buscar receitas por ingrediente
  const buscarPorIngrediente = () => {
    if (!busca.trim()) return; // Se o campo de busca estiver vazio, não faz nada
    setCarregando(true); // Inicia o estado de carregamento
    setBuscando(true); // Marca que uma busca está ativa
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(busca)}`)
      .then(res => res.json())
      .then(data => {
        if (data.meals) {
          // Buscar detalhes completos de cada receita encontrada, passando pelo backend para tradução
          Promise.all(
            data.meals.map((meal: any) =>
              fetch(`${BACKEND_URL}/api/recipe/${meal.idMeal}`)
                .then(res => {
                  if (!res.ok) {
                    // Tenta ler o corpo da resposta como texto para ver o erro do servidor
                    res.text().then(text => console.error(`Erro do servidor para ${meal.idMeal}:`, text));
                    throw new Error(`HTTP error! status: ${res.status}`);
                  }
                  return res.json();
                })
                .catch((error) => {
                  console.warn(`Falha ao buscar receita traduzida para ${meal.idMeal}. Usando original. Erro:`, error);
                  return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                      .then(res => res.json())
                      .then(d => d.meals[0]);
                })
            )
          ).then(receitasDetalhadas => {
            setReceitas(receitasDetalhadas); // Atualiza a lista com as receitas detalhadas
            setCarregando(false); // Finaliza o carregamento
          });
        } else {
          setReceitas([]); // Se não houver resultados, limpa a lista
          setCarregando(false); // Finaliza o carregamento
        }
      })
      .catch(() => setCarregando(false)); // Em caso de erro, finaliza o carregamento
  };

  // Função para buscar receitas padrão (todas) e traduzi-las
  const buscarReceitasPadrao = () => {
    setCarregando(true); // Inicia o estado de carregamento
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
      .then(res => res.json())
      .then(data => {
        if (data.meals) {
          Promise.all(
            data.meals.map((meal: any) =>
              fetch(`${BACKEND_URL}/api/recipe/${meal.idMeal}`)
                .then(res => {
                  if (!res.ok) {
                    // Tenta ler o corpo da resposta como texto para ver o erro do servidor
                    res.text().then(text => console.error(`Erro do servidor para ${meal.idMeal}:`, text));
                    throw new Error(`HTTP error! status: ${res.status}`);
                  }
                  return res.json();
                })
                .catch((error) => {
                  console.warn(`Falha ao traduzir receita ${meal.idMeal}. Exibindo original. Erro:`, error);
                  return meal; // O objeto 'meal' de 'search.php' já tem os detalhes.
                })
            )
          ).then(receitasTraduzidas => {
            setReceitas(receitasTraduzidas || []); // Atualiza a lista com as receitas padrão
            setCarregando(false); // Finaliza o carregamento
          })
        } else {
          setReceitas([]);
          setCarregando(false);
        }
      })
      .catch(() => setCarregando(false)); // Em caso de erro, finaliza o carregamento
  };

  // Efeito para carregar receitas padrão ao iniciar o componente
  useEffect(() => {
    buscarReceitasPadrao(); // Chama a função para buscar receitas padrão
  }, []);

  // Exibe uma tela de carregamento enquanto os dados estão sendo buscados
  if (carregando) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.titulo, { color: theme.tint }]}>CozinhaExpress</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.tint} />
          <Text style={[styles.loadingText, { color: theme.text }]}>Carregando receitas...</Text>
        </View>
      </View>
    );
  }

  // Renderiza a interface principal com a lista de receitas e o campo de busca
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.titulo, { color: theme.tint }]}>CozinhaExpress</Text>
      <View style={styles.buscaContainer}>
        <TextInput
          style={[
            styles.inputBusca,
            { borderColor: theme.inputBorder, backgroundColor: theme.card, color: theme.text },
          ]}
          placeholder="Buscar por ingrediente"
          placeholderTextColor={theme.text + '99'}
          value={busca}
          onChangeText={setBusca}
          onSubmitEditing={buscarPorIngrediente}
          returnKeyType="search"
        />
        <Pressable style={[styles.btnBusca, { backgroundColor: theme.button }]} onPress={buscarPorIngrediente}>
          <Text style={[styles.btnBuscaTxt, { color: theme.buttonText }]}>Buscar</Text>
        </Pressable>
      </View>
      {buscando && (
        <Pressable onPress={() => {
          setBuscando(false); // Desativa o estado de busca
          setBusca(''); // Limpa o campo de busca
          buscarReceitasPadrao(); // Recarrega as receitas padrão
        }}>
          <Text style={[styles.limparBusca, { color: theme.icon }]}>Limpar busca</Text>
        </Pressable>
      )}
      <FlatList
        data={receitas} // Lista de receitas a ser exibida
        keyExtractor={item => item.idMeal} // Chave única para cada item da lista
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.item, { backgroundColor: theme.card, shadowColor: theme.shadow }]} onPress={() => abrirDetalhes(item)}>
            <Image source={{ uri: item.strMealThumb }} style={styles.imagem} />
            <View style={styles.info}>
              <Text style={[styles.nome, { color: theme.tint }]}>{item.strMeal}</Text>
              <Text style={[styles.categoria, { color: theme.icon }]}>{item.strCategory} | {item.strArea}</Text>
              <Text style={[styles.descricao, { color: theme.text }]} numberOfLines={3}>{item.strInstructions}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Modal
        visible={modalVisible} // Controla a visibilidade do modal
        animationType="slide" // Tipo de animação ao abrir o modal
        transparent={true} // Fundo transparente para o modal
        onRequestClose={fecharModal} // Fecha o modal ao clicar no botão de voltar (Android)
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background, shadowColor: theme.shadow }]}>
            <ScrollView>
              {receitaSelecionada && (
                <>
                  <Image source={{ uri: receitaSelecionada.strMealThumb }} style={styles.imagemModal} />
                  <Text style={[styles.nomeModal, { color: theme.tint }]}>{receitaSelecionada.strMeal}</Text>
                  <Text style={[styles.categoriaModal, { color: theme.icon }]}>{receitaSelecionada.strCategory} | {receitaSelecionada.strArea}</Text>
                  <Text style={[styles.tituloSecao, { color: theme.text }]}>Instruções</Text>
                  <Text style={[styles.instrucoes, { color: theme.text }]}>{receitaSelecionada.strInstructions}</Text>
                  <Text style={[styles.tituloSecao, { color: theme.text }]}>Ingredientes</Text>
                  {Array.from({ length: 20 }).map((_, i) => {
                    const ingrediente = receitaSelecionada[`strIngredient${i+1}`];
                    const medida = receitaSelecionada[`strMeasure${i+1}`];
                    if (ingrediente && ingrediente.trim()) {
                      return (
                        <Text key={i} style={[styles.ingrediente, { color: theme.text }]}>{`- ${ingrediente} ${medida ? `(${medida})` : ''}`}</Text>
                      );
                    }
                    return null;
                  })}
                </>
              )}
            </ScrollView>
            <Pressable style={[styles.fecharBtn, { backgroundColor: theme.button }]} onPress={fecharModal}>
              <Text style={[styles.fecharBtnTxt, { color: theme.buttonText }]}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}