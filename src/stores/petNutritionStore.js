// stores/petNutritionStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabaseClient';

/**
 * Pet Nutrition Store
 * Manages all pet nutrition data including profiles, ingredients, and recipes
 */
export const usePetNutritionStore = defineStore('petNutrition', () => {
  // ============================================
  // STATE
  // ============================================
  const nutritionProfiles = ref([]);
  const ingredients = ref([]);
  const recipes = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // ============================================
  // COMPUTED
  // ============================================
  const totalIngredients = computed(() => ingredients.value.length);
  const totalRecipes = computed(() => recipes.value.length);

  // ============================================
  // NUTRITION PROFILES
  // ============================================
  
  /**
   * Fetch all pet nutrition profiles
   * @returns {Promise<Object>} { success: boolean, data?: Array, error?: string }
   */
  const fetchNutritionProfiles = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('pet_nutrition_profiles')
        .select('*')
        .order('kind', { ascending: true });

      if (fetchError) throw fetchError;

      nutritionProfiles.value = data || [];
      return { success: true, data };
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching nutrition profiles:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get nutrition profile for specific pet
   * @param {string} kind - Pet kind (dog/cat)
   * @param {string} lifeStage - Life stage (puppy/kitten/adult/senior)
   * @returns {Promise<Object>} { success: boolean, data?: Object, error?: string }
   */
  const getNutritionProfile = async (kind, lifeStage) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('pet_nutrition_profiles')
        .select('*')
        .eq('kind', kind.toLowerCase())
        .eq('life_stage', lifeStage.toLowerCase())
        .single();

      if (fetchError) throw fetchError;

      return { success: true, data };
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching nutrition profile:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  // ============================================
  // FOOD INGREDIENTS
  // ============================================

  /**
   * Fetch all food ingredients
   * @returns {Promise<Object>} { success: boolean, data?: Array, error?: string }
   */
  const fetchIngredients = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('food_ingredients')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      ingredients.value = data || [];
      return { success: true, data };
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching ingredients:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create a new ingredient
   * @param {Object} ingredient - Ingredient data
   * @returns {Promise<Object>} { success: boolean, data?: Object, error?: string }
   */
  const createIngredient = async (ingredient) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: createError } = await supabase
        .from('food_ingredients')
        .insert([ingredient])
        .select()
        .single();

      if (createError) throw createError;

      ingredients.value.push(data);
      return { success: true, data };
    } catch (err) {
      error.value = err.message;
      console.error('Error creating ingredient:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update an ingredient
   * @param {string} id - Ingredient ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} { success: boolean, data?: Object, error?: string }
   */
  const updateIngredient = async (id, updates) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await supabase
        .from('food_ingredients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      const index = ingredients.value.findIndex(ing => ing.id === id);
      if (index !== -1) {
        ingredients.value[index] = data;
      }

      return { success: true, data };
    } catch (err) {
      error.value = err.message;
      console.error('Error updating ingredient:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete an ingredient
   * @param {string} id - Ingredient ID
   * @returns {Promise<Object>} { success: boolean, error?: string }
   */
  const deleteIngredient = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const { error: deleteError } = await supabase
        .from('food_ingredients')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      ingredients.value = ingredients.value.filter(ing => ing.id !== id);
      return { success: true };
    } catch (err) {
      error.value = err.message;
      console.error('Error deleting ingredient:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  // ============================================
  // RECIPES
  // ============================================

  /**
   * Fetch all recipes with their ingredients
   * @param {string} userId - Optional user ID to filter recipes
   * @returns {Promise<Object>} { success: boolean, data?: Array, error?: string }
   */
  const fetchRecipes = async (userId = null) => {
    loading.value = true;
    error.value = null;

    try {
      let query = supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients (
            id,
            quantity_grams,
            food_ingredients (
              id,
              name,
              calories_per_100g,
              protein_g_per_100g,
              fat_g_per_100g,
              carbohydrates_g_per_100g,
              fiber_g_per_100g,
              calcium_mg_per_100g,
              phosphorus_mg_per_100g,
              vitamin_a_iu_per_100g,
              vitamin_d_iu_per_100g,
              vitamin_e_mg_per_100g
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      recipes.value = data || [];
      return { success: true, data };
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching recipes:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get a single recipe by ID with ingredients
   * @param {string} recipeId - Recipe ID
   * @returns {Promise<Object>} { success: boolean, data?: Object, error?: string }
   */
  const getRecipe = async (recipeId) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients (
            id,
            quantity_grams,
            food_ingredients (
              id,
              name,
              calories_per_100g,
              protein_g_per_100g,
              fat_g_per_100g,
              carbohydrates_g_per_100g,
              fiber_g_per_100g,
              calcium_mg_per_100g,
              phosphorus_mg_per_100g,
              vitamin_a_iu_per_100g,
              vitamin_d_iu_per_100g,
              vitamin_e_mg_per_100g
            )
          )
        `)
        .eq('id', recipeId)
        .single();

      if (fetchError) throw fetchError;

      return { success: true, data };
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching recipe:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create a new recipe
   * @param {Object} recipe - Recipe data (name, description, pet_id, user_id)
   * @returns {Promise<Object>} { success: boolean, data?: Object, error?: string }
   */
  const createRecipe = async (recipe) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: createError } = await supabase
        .from('recipes')
        .insert([recipe])
        .select()
        .single();

      if (createError) throw createError;

      return { success: true, data };
    } catch (err) {
      error.value = err.message;
      console.error('Error creating recipe:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update a recipe
   * @param {string} recipeId - Recipe ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} { success: boolean, data?: Object, error?: string }
   */
  const updateRecipe = async (recipeId, updates) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', recipeId)
        .select()
        .single();

      if (updateError) throw updateError;

      return { success: true, data };
    } catch (err) {
      error.value = err.message;
      console.error('Error updating recipe:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete a recipe
   * @param {string} recipeId - Recipe ID
   * @returns {Promise<Object>} { success: boolean, error?: string }
   */
  const deleteRecipe = async (recipeId) => {
    loading.value = true;
    error.value = null;

    try {
      // Delete recipe ingredients first (cascade should handle this, but being explicit)
      const { error: deleteIngredientsError } = await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', recipeId);

      if (deleteIngredientsError) throw deleteIngredientsError;

      // Delete recipe
      const { error: deleteError } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId);

      if (deleteError) throw deleteError;

      recipes.value = recipes.value.filter(recipe => recipe.id !== recipeId);
      return { success: true };
    } catch (err) {
      error.value = err.message;
      console.error('Error deleting recipe:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  // ============================================
  // RECIPE INGREDIENTS
  // ============================================

  /**
   * Add an ingredient to a recipe
   * @param {string} recipeId - Recipe ID
   * @param {string} ingredientId - Ingredient ID
   * @param {number} quantityGrams - Quantity in grams
   * @returns {Promise<Object>} { success: boolean, data?: Object, error?: string }
   */
  const addIngredientToRecipe = async (recipeId, ingredientId, quantityGrams) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: insertError } = await supabase
        .from('recipe_ingredients')
        .insert([{
          recipe_id: recipeId,
          ingredient_id: ingredientId,
          quantity_grams: quantityGrams
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      return { success: true, data };
    } catch (err) {
      error.value = err.message;
      console.error('Error adding ingredient to recipe:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update recipe ingredient quantity
   * @param {string} recipeIngredientId - Recipe ingredient junction ID
   * @param {number} quantityGrams - New quantity in grams
   * @returns {Promise<Object>} { success: boolean, data?: Object, error?: string }
   */
  const updateRecipeIngredient = async (recipeIngredientId, quantityGrams) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await supabase
        .from('recipe_ingredients')
        .update({ quantity_grams: quantityGrams })
        .eq('id', recipeIngredientId)
        .select()
        .single();

      if (updateError) throw updateError;

      return { success: true, data };
    } catch (err) {
      error.value = err.message;
      console.error('Error updating recipe ingredient:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Remove an ingredient from a recipe
   * @param {string} recipeIngredientId - Recipe ingredient junction ID
   * @returns {Promise<Object>} { success: boolean, error?: string }
   */
  const removeIngredientFromRecipe = async (recipeIngredientId) => {
    loading.value = true;
    error.value = null;

    try {
      const { error: deleteError } = await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('id', recipeIngredientId);

      if (deleteError) throw deleteError;

      return { success: true };
    } catch (err) {
      error.value = err.message;
      console.error('Error removing ingredient from recipe:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Calculate total nutritional values for a recipe
   * @param {Array} recipeIngredients - Array of recipe ingredients with food_ingredients data
   * @returns {Object} Total nutritional values
   */
  const calculateRecipeNutrition = (recipeIngredients) => {
    if (!recipeIngredients || recipeIngredients.length === 0) {
      return {
        total_weight_grams: 0,
        calories: 0,
        protein_g: 0,
        fat_g: 0,
        carbohydrates_g: 0,
        fiber_g: 0,
        calcium_mg: 0,
        phosphorus_mg: 0,
        vitamin_a_iu: 0,
        vitamin_d_iu: 0,
        vitamin_e_mg: 0
      };
    }

    const totals = {
      total_weight_grams: 0,
      calories: 0,
      protein_g: 0,
      fat_g: 0,
      carbohydrates_g: 0,
      fiber_g: 0,
      calcium_mg: 0,
      phosphorus_mg: 0,
      vitamin_a_iu: 0,
      vitamin_d_iu: 0,
      vitamin_e_mg: 0
    };

    recipeIngredients.forEach(recipeIng => {
      const quantity = recipeIng.quantity_grams;
      const ing = recipeIng.food_ingredients;
      const multiplier = quantity / 100; // Convert per 100g to actual quantity

      totals.total_weight_grams += quantity;
      totals.calories += (ing.calories_per_100g || 0) * multiplier;
      totals.protein_g += (ing.protein_g_per_100g || 0) * multiplier;
      totals.fat_g += (ing.fat_g_per_100g || 0) * multiplier;
      totals.carbohydrates_g += (ing.carbohydrates_g_per_100g || 0) * multiplier;
      totals.fiber_g += (ing.fiber_g_per_100g || 0) * multiplier;
      totals.calcium_mg += (ing.calcium_mg_per_100g || 0) * multiplier;
      totals.phosphorus_mg += (ing.phosphorus_mg_per_100g || 0) * multiplier;
      totals.vitamin_a_iu += (ing.vitamin_a_iu_per_100g || 0) * multiplier;
      totals.vitamin_d_iu += (ing.vitamin_d_iu_per_100g || 0) * multiplier;
      totals.vitamin_e_mg += (ing.vitamin_e_mg_per_100g || 0) * multiplier;
    });

    // Round all values to 2 decimal places
    Object.keys(totals).forEach(key => {
      totals[key] = Math.round(totals[key] * 100) / 100;
    });

    return totals;
  };

  /**
   * Compare recipe nutrition with pet requirements
   * @param {Object} recipeNutrition - Calculated recipe nutrition
   * @param {Object} requirements - Pet nutrition requirements
   * @param {number} petWeight - Pet weight in kg
   * @returns {Object} Comparison results with percentages
   */
  const compareNutrition = (recipeNutrition, requirements, petWeight) => {
    if (!requirements || !petWeight) {
      return null;
    }

    // Calculate daily requirements based on pet weight
    const dailyRequirements = {
      calories: requirements.calories_per_kg * petWeight,
      protein_g: requirements.protein_percent_min * petWeight * 10, // Rough estimate
      fat_g: requirements.fat_percent_min * petWeight * 10,
      calcium_mg: requirements.calcium_percent_min * petWeight * 1000,
      phosphorus_mg: requirements.phosphorus_percent_min * petWeight * 1000
    };

    // Calculate percentages
    const comparison = {
      calories: {
        actual: recipeNutrition.calories,
        required: dailyRequirements.calories,
        percentage: (recipeNutrition.calories / dailyRequirements.calories) * 100,
        status: getStatus(recipeNutrition.calories, dailyRequirements.calories)
      },
      protein: {
        actual: recipeNutrition.protein_g,
        required: dailyRequirements.protein_g,
        percentage: (recipeNutrition.protein_g / dailyRequirements.protein_g) * 100,
        status: getStatus(recipeNutrition.protein_g, dailyRequirements.protein_g)
      },
      fat: {
        actual: recipeNutrition.fat_g,
        required: dailyRequirements.fat_g,
        percentage: (recipeNutrition.fat_g / dailyRequirements.fat_g) * 100,
        status: getStatus(recipeNutrition.fat_g, dailyRequirements.fat_g)
      },
      calcium: {
        actual: recipeNutrition.calcium_mg,
        required: dailyRequirements.calcium_mg,
        percentage: (recipeNutrition.calcium_mg / dailyRequirements.calcium_mg) * 100,
        status: getStatus(recipeNutrition.calcium_mg, dailyRequirements.calcium_mg)
      },
      phosphorus: {
        actual: recipeNutrition.phosphorus_mg,
        required: dailyRequirements.phosphorus_mg,
        percentage: (recipeNutrition.phosphorus_mg / dailyRequirements.phosphorus_mg) * 100,
        status: getStatus(recipeNutrition.phosphorus_mg, dailyRequirements.phosphorus_mg)
      }
    };

    return comparison;
  };

  /**
   * Helper function to determine nutritional status
   * @param {number} actual - Actual value
   * @param {number} required - Required value
   * @returns {string} Status: 'excellent', 'good', 'fair', 'poor'
   */
  const getStatus = (actual, required) => {
    const percentage = (actual / required) * 100;
    if (percentage >= 90 && percentage <= 110) return 'excellent';
    if (percentage >= 80 && percentage < 90) return 'good';
    if (percentage >= 70 && percentage < 80) return 'fair';
    return 'poor';
  };

  /**
   * Reset store state
   */
  const resetStore = () => {
    nutritionProfiles.value = [];
    ingredients.value = [];
    recipes.value = [];
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    nutritionProfiles,
    ingredients,
    recipes,
    loading,
    error,
    
    // Computed
    totalIngredients,
    totalRecipes,
    
    // Nutrition Profiles
    fetchNutritionProfiles,
    getNutritionProfile,
    
    // Ingredients
    fetchIngredients,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    
    // Recipes
    fetchRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    
    // Recipe Ingredients
    addIngredientToRecipe,
    updateRecipeIngredient,
    removeIngredientFromRecipe,
    
    // Utilities
    calculateRecipeNutrition,
    compareNutrition,
    resetStore
  };
});
