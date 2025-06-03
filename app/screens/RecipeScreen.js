import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

const RecipeScreen = ({ route }) => {
  const { name } = route.params || { name: 'Arrabiata' }; // Nome da receita de exemplo
  const { t } = useTranslation();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // Verificar cache no AsyncStorage
        const cachedRecipe = await AsyncStorage.getItem(`recipe_${name}`);
        if (cachedRecipe) {
          setRecipe(JSON.parse(cachedRecipe));
          return;
        }

        // Buscar do backend
        const response = await axios.get(`https://cozinhaexpress-backend-production.up.railway.app/api/recipe/${name}`);
        const meal = response.data;

        // Armazenar no cache
        await AsyncStorage.setItem(`recipe_${name}`, JSON.stringify(meal));
        setRecipe(meal);
      } catch (error) {
        console.error('Erro ao buscar receita:', error);
      }
    };
    fetchRecipe();
  }, [name]);

  return (
    <View>
      {recipe ? (
        <>
          <Text>{recipe.strMeal}</Text>
          <Text>{recipe.strInstructions}</Text>
          {Object.keys(recipe)
            .filter((key) => key.startsWith('strIngredient') && recipe[key])
            .map((key, index) => (
              <Text key={index}>{recipe[key]}</Text>
            ))}
        </>
      ) : (
        <Text>Carregando...</Text>
      )}
    </View>
  );
};

export default RecipeScreen; 