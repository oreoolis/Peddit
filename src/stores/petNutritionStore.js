// stores/petNutritionStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useStorage } from '@/composables/useStorage';

const { getPublicImage } = useStorage();

/**
 * Pet Nutrition Store
 * Manages all pet nutrition data including profiles, ingredients, and recipes
 * Schema uses JSONB for nutrition data
 */
export const usePetNutritionStore = defineStore('petNutrition', () => {
  // STATE
  const nutritionProfiles = ref([]);
  const ingredients = ref([]);
  const recipes = ref([]);
  const recipePosts = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const recipeQuery = ref('');
  const recipePostQuery = ref('');

  // Getters
  const totalIngredients = computed(() => ingredients.value.length);
  const totalRecipes = computed(() => recipes.value.length);

  const filteredRecipes = computed(() => {
    if (!recipeQuery.value) return recipes.value;
    
    return recipes.value.filter(recipe => 
      recipe.recipe_name.toLowerCase().includes(recipeQuery.value.toLowerCase())
    );
  });

  const filteredRecipePosts = computed(() => {
    if (!recipePostQuery.value) return recipePosts.value;
    
    return recipePosts.value.filter(post => 
      post.recipes.recipe_name.toLowerCase().includes(recipePostQuery.value.toLowerCase())
    );
  });

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
   * Life stages: 'adult_maintenance', 'growth_and_reproduction'
   */
  const getNutritionProfile = async (kind, lifeStage) => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: fetchError } = await supabase
        .from('pet_nutrition_profiles')
        .select('*')
        .eq('kind')
        .eq('life_stage')
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

  // Technically should be in POSTSTORE
  const fetchAllRecipePost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles ( 
            username, 
            display_name,
            avatar_url
            ),
          recipes ( 
            recipe_name, 
            description, 
            price_per_week,
            pet_kind,
            pet_breed,
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
          )
        `)
        // Filter to only get posts that have a recipe
        .not('recipe_id', 'is', null)
        // Order by the newest posts first
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Change the avatar_url into the image URL inside supabase avatars storage bucket
      const transformedPosts = data.map(post => {
          if (post.profiles?.avatar_url) {
              post.profiles.avatar_url = getPublicImage('avatars', post.profiles.avatar_url);
          }
          return post;
      });

      // Parse nutrition to json

      console.log(transformedPosts);

      recipePosts.value = transformedPosts;
    } catch (error) {
      console.error('Error fetching recipe posts:', error.message);
    }
  };

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
          profiles:author_id (
                        username,
                        display_name,
                        avatar_url
          ),
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

      // Change the avatar_url into the image URL inside supabase avatars storage bucket
      const transformedPosts = data.map(recipe => {
          if (recipe.profiles?.avatar_url) {
              recipe.profiles.avatar_url = getPublicImage('avatars', recipe.profiles.avatar_url);
          }
          return recipe;
      });

      if (fetchError) throw fetchError;

      recipes.value = transformedPosts || [];
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
        magnesium_mg: 0,
        iron_mg: 0,
        zinc_mg: 0,
        vitamin_a_iu: 0,
        vitamin_d_iu: 0,
        vitamin_e_iu: 0,
        thiamine_mg: 0,
        riboflavin_mg: 0,
        niacin_mg: 0,
        vitamin_b6_mg: 0,
        vitamin_b12_mg: 0,
        choline_mg: 0,
        taurine_g: 0,
        linoleic_acid_g: 0,
        alpha_linolenic_acid_g: 0,
        epa_dha_g: 0,
        arachidonic_acid_g: 0
      };
    }

    const totals = {
      total_weight_g: 0,
      protein_g: 0,
      fat_g: 0,
      fiber_g: 0,
      calcium_g: 0,
      phosphorus_g: 0,
      magnesium_mg: 0,
      iron_mg: 0,
      zinc_mg: 0,
      vitamin_a_iu: 0,
      vitamin_d_iu: 0,
      vitamin_e_iu: 0,
      thiamine_mg: 0,
      riboflavin_mg: 0,
      niacin_mg: 0,
      vitamin_b6_mg: 0,
      vitamin_b12_mg: 0,
      choline_mg: 0,
      taurine_g: 0,
      linoleic_acid_g: 0,
      alpha_linolenic_acid_g: 0,
      epa_dha_g: 0,
      arachidonic_acid_g: 0
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
      
      if (nutrition.magnesium?.value) totals.magnesium_mg += nutrition.magnesium.value * multiplier;
      if (nutrition.iron?.value) totals.iron_mg += nutrition.iron.value * multiplier;
      if (nutrition.zinc?.value) totals.zinc_mg += nutrition.zinc.value * multiplier;
      if (nutrition.vitamin_a?.value) totals.vitamin_a_iu += nutrition.vitamin_a.value * multiplier;
      if (nutrition.vitamin_d?.value) totals.vitamin_d_iu += nutrition.vitamin_d.value * multiplier;
      if (nutrition.vitamin_e?.value) totals.vitamin_e_iu += nutrition.vitamin_e.value * multiplier;
      if (nutrition.thiamine?.value) totals.thiamine_mg += nutrition.thiamine.value * multiplier;
      if (nutrition.riboflavin?.value) totals.riboflavin_mg += nutrition.riboflavin.value * multiplier;
      if (nutrition.niacin?.value) totals.niacin_mg += nutrition.niacin.value * multiplier;
      if (nutrition.vitamin_b6?.value) totals.vitamin_b6_mg += nutrition.vitamin_b6.value * multiplier;
      if (nutrition.vitamin_b12?.value) totals.vitamin_b12_mg += nutrition.vitamin_b12.value * multiplier;
      if (nutrition.choline?.value) totals.choline_mg += nutrition.choline.value * multiplier;
      if (nutrition.taurine?.value) totals.taurine_g += nutrition.taurine.value * multiplier;
      if (nutrition.linoleic_acid?.value) totals.linoleic_acid_g += nutrition.linoleic_acid.value * multiplier;
      if (nutrition.alpha_linolenic_acid?.value) totals.alpha_linolenic_acid_g += nutrition.alpha_linolenic_acid.value * multiplier;
      if (nutrition.epa_dha?.value) totals.epa_dha_g += nutrition.epa_dha.value * multiplier;
      if (nutrition.arachidonic_acid?.value) totals.arachidonic_acid_g += nutrition.arachidonic_acid.value * multiplier;
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

    const comparison = {};
    
    // Helper to add nutrient comparison
    const addComparison = (key, actualValue, requiredField, unit = '') => {
      const required = requirements[requiredField] || 0;
      if (required > 0) {
        comparison[key] = {
          actual: actualValue || 0,
          required: required,
          unit: unit,
          percentage: (actualValue / required) * 100,
          status: getStatus(actualValue, required)
        };
      }
    };
    
    // Macronutrients
    addComparison('protein', recipeNutrition.protein_g, 'min_protein_g', 'g');
    addComparison('fat', recipeNutrition.fat_g, 'min_fat_g', 'g');
    
    // Fatty Acids
    addComparison('linoleic_acid', recipeNutrition.linoleic_acid_g, 'min_linoleic_acid_g', 'g');
    addComparison('alpha_linolenic_acid', recipeNutrition.alpha_linolenic_acid_g, 'min_alpha_linolenic_acid_g', 'g');
    addComparison('epa_dha', recipeNutrition.epa_dha_g, 'min_epa_dha_g', 'g');
    addComparison('arachidonic_acid', recipeNutrition.arachidonic_acid_g, 'min_arachidonic_acid_g', 'g');
    
    // Minerals
    addComparison('calcium', recipeNutrition.calcium_g, 'min_calcium_g', 'g');
    addComparison('phosphorus', recipeNutrition.phosphorus_g, 'min_phosphorus_g', 'g');
    addComparison('magnesium', recipeNutrition.magnesium_mg, 'min_magnesium_mg', 'mg');
    addComparison('iron', recipeNutrition.iron_mg, 'min_iron_mg', 'mg');
    addComparison('zinc', recipeNutrition.zinc_mg, 'min_zinc_mg', 'mg');
    
    // Vitamins
    addComparison('vitamin_a', recipeNutrition.vitamin_a_iu, 'min_vitamin_a_iu', 'IU');
    addComparison('vitamin_d', recipeNutrition.vitamin_d_iu, 'min_vitamin_d_iu', 'IU');
    addComparison('vitamin_e', recipeNutrition.vitamin_e_iu, 'min_vitamin_e_iu', 'IU');
    addComparison('thiamine', recipeNutrition.thiamine_mg, 'min_thiamine_mg', 'mg');
    addComparison('riboflavin', recipeNutrition.riboflavin_mg, 'min_riboflavin_mg', 'mg');
    addComparison('niacin', recipeNutrition.niacin_mg, 'min_niacin_mg', 'mg');
    addComparison('vitamin_b6', recipeNutrition.vitamin_b6_mg, 'min_vitamin_b6_mg', 'mg');
    addComparison('vitamin_b12', recipeNutrition.vitamin_b12_mg, 'min_vitamin_b12_mg', 'mg');
    addComparison('choline', recipeNutrition.choline_mg, 'min_choline_mg', 'mg');
    
    // Amino Acids
    addComparison('taurine', recipeNutrition.taurine_g, 'min_taurine_g', 'g');

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
    recipeQuery,
    recipePostQuery,
    
    // Computed
    totalIngredients,
    totalRecipes,
    filteredRecipes,
    filteredRecipePosts,
    
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
    fetchAllRecipePost,
    
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
