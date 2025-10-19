// stores/petNutritionStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabaseClient';

/**
 * Pet Nutrition Store
 * Manages all pet nutrition data including profiles, ingredients, and recipes
 * Schema uses JSONB for nutrition data
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
   * Table: nutrition_profiles (not pet_nutrition_profiles)
   */
  const fetchNutritionProfiles = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('nutrition_profiles')
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
   * Life stages: 'adult_maintenance', 'growth_and_reproduction'
   */
  const getNutritionProfile = async (kind, lifeStage) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('nutrition_profiles')
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
   * Nutrition data is in JSONB format
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
   * Schema: recipes table with author_id, recipe_name
   */
  const fetchRecipes = async (authorId = null) => {
    loading.value = true;
    error.value = null;

    try {
      let query = supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients (
            id,
            quantity_g,
            food_ingredients (
              id,
              name,
              type,
              nutrition
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (authorId) {
        query = query.eq('author_id', authorId);
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
            quantity_g,
            food_ingredients (
              id,
              name,
              type,
              nutrition
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
   * Schema uses: recipe_name, author_id, description, notes
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
   */
  const deleteRecipe = async (recipeId) => {
    loading.value = true;
    error.value = null;

    try {
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
   * Schema uses: quantity_g (not quantity_grams)
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
          quantity_g: quantityGrams
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
   */
  const updateRecipeIngredient = async (recipeIngredientId, quantityGrams) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await supabase
        .from('recipe_ingredients')
        .update({ quantity_g: quantityGrams })
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
  // UTILITY FUNCTIONS - JSONB AWARE
  // ============================================

  /**
   * Calculate total nutritional values for a recipe
   * Handles JSONB nutrition data from ingredients
   */
  const calculateRecipeNutrition = (recipeIngredients) => {
    if (!recipeIngredients || recipeIngredients.length === 0) {
      return {
        total_weight_g: 0,
        protein_g: 0,
        fat_g: 0,
        fiber_g: 0,
        calcium_g: 0,
        phosphorus_g: 0,
        iron_mg: 0,
        zinc_mg: 0,
        vitamin_a_iu: 0,
        vitamin_d_iu: 0,
        vitamin_e_iu: 0,
        taurine_g: 0
      };
    }

    const totals = {
      total_weight_g: 0,
      protein_g: 0,
      fat_g: 0,
      fiber_g: 0,
      calcium_g: 0,
      phosphorus_g: 0,
      iron_mg: 0,
      zinc_mg: 0,
      vitamin_a_iu: 0,
      vitamin_d_iu: 0,
      vitamin_e_iu: 0,
      taurine_g: 0
    };

    recipeIngredients.forEach(recipeIng => {
      const quantity = recipeIng.quantity_g;
      const nutrition = recipeIng.food_ingredients.nutrition;
      const multiplier = quantity / 100; // Convert per 100g to actual quantity

      totals.total_weight_g += quantity;

      // Extract values from JSONB
      if (nutrition.protein?.value) totals.protein_g += nutrition.protein.value * multiplier;
      if (nutrition.fat?.value) totals.fat_g += nutrition.fat.value * multiplier;
      if (nutrition.fiber?.value) totals.fiber_g += nutrition.fiber.value * multiplier;
      
      // Handle g to mg conversion for calcium
      if (nutrition.calcium?.value) {
        const unit = nutrition.calcium.unit;
        totals.calcium_g += unit === 'g' ? nutrition.calcium.value * multiplier : (nutrition.calcium.value / 1000) * multiplier;
      }
      
      // Handle g to mg conversion for phosphorus
      if (nutrition.phosphorus?.value) {
        const unit = nutrition.phosphorus.unit;
        totals.phosphorus_g += unit === 'g' ? nutrition.phosphorus.value * multiplier : (nutrition.phosphorus.value / 1000) * multiplier;
      }
      
      if (nutrition.iron?.value) totals.iron_mg += nutrition.iron.value * multiplier;
      if (nutrition.zinc?.value) totals.zinc_mg += nutrition.zinc.value * multiplier;
      if (nutrition.vitamin_a?.value) totals.vitamin_a_iu += nutrition.vitamin_a.value * multiplier;
      if (nutrition.vitamin_d?.value) totals.vitamin_d_iu += nutrition.vitamin_d.value * multiplier;
      if (nutrition.vitamin_e?.value) totals.vitamin_e_iu += nutrition.vitamin_e.value * multiplier;
      if (nutrition.taurine?.value) totals.taurine_g += nutrition.taurine.value * multiplier;
    });

    // Round all values to 2 decimal places
    Object.keys(totals).forEach(key => {
      totals[key] = Math.round(totals[key] * 100) / 100;
    });

    return totals;
  };

  /**
   * Compare recipe nutrition with pet requirements
   * Uses new schema with min_* columns
   */
  const compareNutrition = (recipeNutrition, requirements, petWeight) => {
    if (!requirements || !petWeight) {
      return null;
    }

    // Extract minimum requirements from schema
    const comparison = {
      protein: {
        actual: recipeNutrition.protein_g,
        required: requirements.min_protein_g || 0,
        percentage: requirements.min_protein_g ? (recipeNutrition.protein_g / requirements.min_protein_g) * 100 : 0,
        status: getStatus(recipeNutrition.protein_g, requirements.min_protein_g)
      },
      fat: {
        actual: recipeNutrition.fat_g,
        required: requirements.min_fat_g || 0,
        percentage: requirements.min_fat_g ? (recipeNutrition.fat_g / requirements.min_fat_g) * 100 : 0,
        status: getStatus(recipeNutrition.fat_g, requirements.min_fat_g)
      },
      calcium: {
        actual: recipeNutrition.calcium_g,
        required: requirements.min_calcium_g || 0,
        percentage: requirements.min_calcium_g ? (recipeNutrition.calcium_g / requirements.min_calcium_g) * 100 : 0,
        status: getStatus(recipeNutrition.calcium_g, requirements.min_calcium_g)
      },
      phosphorus: {
        actual: recipeNutrition.phosphorus_g,
        required: requirements.min_phosphorus_g || 0,
        percentage: requirements.min_phosphorus_g ? (recipeNutrition.phosphorus_g / requirements.min_phosphorus_g) * 100 : 0,
        status: getStatus(recipeNutrition.phosphorus_g, requirements.min_phosphorus_g)
      }
    };

    return comparison;
  };

  /**
   * Helper function to determine nutritional status
   */
  const getStatus = (actual, required) => {
    if (!required || required === 0) return 'unknown';
    const percentage = (actual / required) * 100;
    if (percentage >= 90 && percentage <= 120) return 'excellent';
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
