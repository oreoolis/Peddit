<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { usePetNutritionStore } from '@/stores/petNutritionStore';
import { usePetStore } from '@/stores/petStore';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';

// ============================================
// STORES
// ============================================
const nutritionStore = usePetNutritionStore();
const petStore = usePetStore();
const authStore = useAuthStore();

const { userId } = storeToRefs(authStore);
const { pets } = storeToRefs(petStore);
const { 
  nutritionProfiles, 
  ingredients, 
  recipes, 
  loading 
} = storeToRefs(nutritionStore);

// ============================================
// PET INFORMATION STATE
// ============================================
const selectedPet = ref(null);
const petKind = ref('dog');
const petLifeStage = ref('adult');
const petWeight = ref(10);
const nutritionRequirements = ref(null);

// ============================================
// RECIPE STATE
// ============================================
const currentRecipe = ref(null);
const recipeName = ref('');
const recipeDescription = ref('');
const selectedIngredients = ref([]);
const selectedIngredientId = ref('');
const ingredientQuantity = ref(100);
const recipeNutrition = ref(null);
const nutritionComparison = ref(null);

// ============================================
// UI STATE
// ============================================
const activeTab = ref('pet-info');
const showRecipeForm = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// ============================================
// COMPUTED
// ============================================
const canCreateRecipe = computed(() => {
  return recipeName.value.trim() && selectedIngredients.value.length > 0;
});

const availableIngredients = computed(() => {
  return ingredients.value.filter(ing => 
    !selectedIngredients.value.some(si => si.ingredient.id === ing.id)
  );
});

// ============================================
// LIFECYCLE
// ============================================
onMounted(async () => {
  await Promise.all([
    nutritionStore.fetchNutritionProfiles(),
    nutritionStore.fetchIngredients(),
    petStore.fetchPets(userId.value)
  ]);
});

// Watch for pet selection changes
watch(selectedPet, async (newPet) => {
  if (newPet) {
    petKind.value = newPet.kind;
    petWeight.value = newPet.weight_kg || 10;
    await fetchNutritionRequirements();
  }
});

// Watch for manual changes to kind/life stage
watch([petKind, petLifeStage], async () => {
  await fetchNutritionRequirements();
});

// Recalculate nutrition when ingredients change
watch(selectedIngredients, () => {
  calculateNutrition();
}, { deep: true });

// ============================================
// METHODS
// ============================================

/**
 * Fetch nutrition requirements for current pet
 */
const fetchNutritionRequirements = async () => {
  const result = await nutritionStore.getNutritionProfile(
    petKind.value,
    petLifeStage.value
  );
  
  if (result.success) {
    nutritionRequirements.value = result.data;
    calculateComparison();
  }
};

/**
 * Add ingredient to recipe
 */
const addIngredient = () => {
  if (!selectedIngredientId.value || ingredientQuantity.value <= 0) {
    showError('Please select an ingredient and enter a valid quantity');
    return;
  }

  const ingredient = ingredients.value.find(i => i.id === selectedIngredientId.value);
  if (!ingredient) return;

  selectedIngredients.value.push({
    ingredient,
    quantity: ingredientQuantity.value
  });

  // Reset form
  selectedIngredientId.value = '';
  ingredientQuantity.value = 100;
};

/**
 * Remove ingredient from recipe
 */
const removeIngredient = (index) => {
  selectedIngredients.value.splice(index, 1);
};

/**
 * Update ingredient quantity
 */
const updateQuantity = (index, newQuantity) => {
  if (newQuantity > 0) {
    selectedIngredients.value[index].quantity = parseFloat(newQuantity);
  }
};

/**
 * Calculate total nutrition for current recipe
 */
const calculateNutrition = () => {
  if (selectedIngredients.value.length === 0) {
    recipeNutrition.value = null;
    nutritionComparison.value = null;
    return;
  }

  // Transform selectedIngredients to match store format
  const recipeIngredientsFormat = selectedIngredients.value.map(si => ({
    quantity_grams: si.quantity,
    food_ingredients: si.ingredient
  }));

  recipeNutrition.value = nutritionStore.calculateRecipeNutrition(recipeIngredientsFormat);
  calculateComparison();
};

/**
 * Calculate comparison with requirements
 */
const calculateComparison = () => {
  if (!recipeNutrition.value || !nutritionRequirements.value) {
    nutritionComparison.value = null;
    return;
  }

  nutritionComparison.value = nutritionStore.compareNutrition(
    recipeNutrition.value,
    nutritionRequirements.value,
    petWeight.value
  );
};

/**
 * Create a new recipe
 */
const createRecipe = async () => {
  if (!canCreateRecipe.value) {
    showError('Please provide a recipe name and add at least one ingredient');
    return;
  }

  try {
    // Create recipe
    const recipeResult = await nutritionStore.createRecipe({
      name: recipeName.value,
      description: recipeDescription.value,
      pet_id: selectedPet.value?.id || null,
      user_id: userId.value
    });

    if (!recipeResult.success) {
      showError(recipeResult.error);
      return;
    }

    const recipeId = recipeResult.data.id;

    // Add all ingredients to recipe
    for (const si of selectedIngredients.value) {
      await nutritionStore.addIngredientToRecipe(
        recipeId,
        si.ingredient.id,
        si.quantity
      );
    }

    showSuccess('Recipe created successfully!');
    
    // Reset form
    recipeName.value = '';
    recipeDescription.value = '';
    selectedIngredients.value = [];
    showRecipeForm.value = false;

    // Refresh recipes
    await nutritionStore.fetchRecipes(userId.value);
  } catch (err) {
    showError('Failed to create recipe: ' + err.message);
  }
};

/**
 * Load an existing recipe
 */
const loadRecipe = async (recipe) => {
  const result = await nutritionStore.getRecipe(recipe.id);
  
  if (result.success) {
    currentRecipe.value = result.data;
    recipeName.value = result.data.name;
    recipeDescription.value = result.data.description || '';
    
    // Transform recipe ingredients to selectedIngredients format
    selectedIngredients.value = result.data.recipe_ingredients.map(ri => ({
      ingredient: ri.food_ingredients,
      quantity: ri.quantity_grams
    }));
    
    showRecipeForm.value = true;
    activeTab.value = 'recipe';
  }
};

/**
 * Delete a recipe
 */
const deleteRecipe = async (recipeId) => {
  if (!confirm('Are you sure you want to delete this recipe?')) return;

  const result = await nutritionStore.deleteRecipe(recipeId);
  
  if (result.success) {
    showSuccess('Recipe deleted successfully');
    await nutritionStore.fetchRecipes(userId.value);
  } else {
    showError(result.error);
  }
};

/**
 * Show success message
 */
const showSuccess = (message) => {
  successMessage.value = message;
  setTimeout(() => successMessage.value = '', 3000);
};

/**
 * Show error message
 */
const showError = (message) => {
  errorMessage.value = message;
  setTimeout(() => errorMessage.value = '', 5000);
};

/**
 * Get status color for nutritional comparison
 */
const getStatusColor = (status) => {
  const colors = {
    excellent: '#10b981',
    good: '#f59e0b',
    fair: '#f97316',
    poor: '#ef4444'
  };
  return colors[status] || '#6b7280';
};

/**
 * Get status label
 */
const getStatusLabel = (status) => {
  const labels = {
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Needs Improvement'
  };
  return labels[status] || 'Unknown';
};
</script>

<template>
  <div class="nutrition-test-page">
    <div class="container py-4">
      <!-- Header -->
      <div class="page-header mb-4">
        <h1 class="page-title">
          <i class="bi bi-clipboard-data me-2"></i>
          Pet Nutrition Management System
        </h1>
        <p class="page-subtitle">
          Create custom recipes and analyze nutritional values for your pets
        </p>
      </div>

      <!-- Messages -->
      <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
        <i class="bi bi-check-circle me-2"></i>
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="bi bi-exclamation-triangle me-2"></i>
        {{ errorMessage }}
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Loading nutrition data...</p>
      </div>

      <!-- Main Content -->
      <div v-else class="row">
        <!-- Left Column: Pet Info & Requirements -->
        <div class="col-lg-4 mb-4">
          <!-- Pet Information Card -->
          <div class="card info-card mb-3">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-heart-fill me-2"></i>
                Pet Information
              </h5>
            </div>
            <div class="card-body">
              <!-- Select Existing Pet -->
              <div class="mb-3" v-if="pets && pets.length > 0">
                <label class="form-label fw-semibold">Select Your Pet</label>
                <select v-model="selectedPet" class="form-select">
                  <option :value="null">-- Or enter manually --</option>
                  <option v-for="pet in pets" :key="pet.id" :value="pet">
                    {{ pet.name }} ({{ pet.kind }})
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Pet Kind</label>
                <select v-model="petKind" class="form-select">
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Life Stage</label>
                <select v-model="petLifeStage" class="form-select">
                  <option value="puppy" v-if="petKind === 'dog'">Puppy</option>
                  <option value="kitten" v-if="petKind === 'cat'">Kitten</option>
                  <option value="adult">Adult</option>
                  <option value="senior">Senior</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Weight (kg)</label>
                <input 
                  type="number" 
                  v-model.number="petWeight" 
                  class="form-control"
                  min="0.1"
                  step="0.1"
                  @change="calculateComparison"
                >
              </div>
            </div>
          </div>

          <!-- Nutrition Requirements Card -->
          <div class="card info-card" v-if="nutritionRequirements">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-clipboard-check me-2"></i>
                Daily Requirements
              </h5>
            </div>
            <div class="card-body">
              <div class="requirement-item">
                <span class="requirement-label">Calories:</span>
                <span class="requirement-value">
                  {{ Math.round(nutritionRequirements.calories_per_kg * petWeight) }} kcal
                </span>
              </div>
              <div class="requirement-item">
                <span class="requirement-label">Protein (min):</span>
                <span class="requirement-value">
                  {{ nutritionRequirements.protein_percent_min }}%
                </span>
              </div>
              <div class="requirement-item">
                <span class="requirement-label">Fat (min):</span>
                <span class="requirement-value">
                  {{ nutritionRequirements.fat_percent_min }}%
                </span>
              </div>
              <div class="requirement-item">
                <span class="requirement-label">Calcium (min):</span>
                <span class="requirement-value">
                  {{ nutritionRequirements.calcium_percent_min }}%
                </span>
              </div>
              <div class="requirement-item">
                <span class="requirement-label">Phosphorus (min):</span>
                <span class="requirement-value">
                  {{ nutritionRequirements.phosphorus_percent_min }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Recipe Builder -->
        <div class="col-lg-8">
          <!-- Recipe Builder Card -->
          <div class="card recipe-card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="bi bi-journal-text me-2"></i>
                Recipe Builder
              </h5>
              <button 
                class="btn btn-primary btn-sm"
                @click="showRecipeForm = !showRecipeForm"
              >
                <i class="bi" :class="showRecipeForm ? 'bi-x' : 'bi-plus'"></i>
                {{ showRecipeForm ? 'Cancel' : 'New Recipe' }}
              </button>
            </div>
            <div class="card-body">
              <!-- Recipe Form -->
              <div v-if="showRecipeForm" class="recipe-form mb-4">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Recipe Name</label>
                  <input 
                    type="text" 
                    v-model="recipeName" 
                    class="form-control"
                    placeholder="e.g., Chicken & Rice Dinner"
                  >
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">Description (Optional)</label>
                  <textarea 
                    v-model="recipeDescription" 
                    class="form-control"
                    rows="2"
                    placeholder="Describe your recipe..."
                  ></textarea>
                </div>

                <!-- Add Ingredient Section -->
                <div class="add-ingredient-section mb-3">
                  <h6 class="fw-semibold mb-2">Add Ingredients</h6>
                  <div class="row g-2">
                    <div class="col-md-6">
                      <select v-model="selectedIngredientId" class="form-select">
                        <option value="">-- Select Ingredient --</option>
                        <option 
                          v-for="ing in availableIngredients" 
                          :key="ing.id" 
                          :value="ing.id"
                        >
                          {{ ing.name }}
                        </option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <input 
                        type="number" 
                        v-model.number="ingredientQuantity" 
                        class="form-control"
                        placeholder="Grams"
                        min="1"
                      >
                    </div>
                    <div class="col-md-2">
                      <button 
                        class="btn btn-success w-100"
                        @click="addIngredient"
                      >
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Selected Ingredients List -->
                <div v-if="selectedIngredients.length > 0" class="ingredients-list mb-3">
                  <h6 class="fw-semibold mb-2">Recipe Ingredients</h6>
                  <div class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Ingredient</th>
                          <th>Quantity (g)</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(si, index) in selectedIngredients" :key="index">
                          <td>{{ si.ingredient.name }}</td>
                          <td>
                            <input 
                              type="number" 
                              :value="si.quantity"
                              @input="updateQuantity(index, $event.target.value)"
                              class="form-control form-control-sm"
                              style="width: 100px;"
                              min="1"
                            >
                          </td>
                          <td>
                            <button 
                              class="btn btn-danger btn-sm"
                              @click="removeIngredient(index)"
                            >
                              <i class="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Create Recipe Button -->
                <button 
                  class="btn btn-primary"
                  :disabled="!canCreateRecipe"
                  @click="createRecipe"
                >
                  <i class="bi bi-save me-2"></i>
                  Save Recipe
                </button>
              </div>

              <!-- Existing Recipes List -->
              <div v-if="!showRecipeForm && recipes.length > 0">
                <h6 class="fw-semibold mb-3">Your Recipes</h6>
                <div class="row">
                  <div 
                    v-for="recipe in recipes" 
                    :key="recipe.id"
                    class="col-md-6 mb-3"
                  >
                    <div class="card recipe-item">
                      <div class="card-body">
                        <h6 class="card-title">{{ recipe.name }}</h6>
                        <p class="card-text text-muted small">
                          {{ recipe.description || 'No description' }}
                        </p>
                        <div class="d-flex gap-2">
                          <button 
                            class="btn btn-sm btn-outline-primary"
                            @click="loadRecipe(recipe)"
                          >
                            <i class="bi bi-eye"></i> View
                          </button>
                          <button 
                            class="btn btn-sm btn-outline-danger"
                            @click="deleteRecipe(recipe.id)"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="!showRecipeForm && recipes.length === 0" class="text-center py-4">
                <i class="bi bi-journal-x" style="font-size: 3rem; color: #cbd5e0;"></i>
                <p class="text-muted mt-2">No recipes yet. Create your first recipe!</p>
              </div>
            </div>
          </div>

          <!-- Nutrition Analysis Card -->
          <div class="card analysis-card" v-if="recipeNutrition && nutritionComparison">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-bar-chart-fill me-2"></i>
                Nutritional Analysis
              </h5>
            </div>
            <div class="card-body">
              <!-- Recipe Totals -->
              <div class="nutrition-totals mb-4">
                <h6 class="fw-semibold mb-3">Recipe Totals</h6>
                <div class="row g-2">
                  <div class="col-6 col-md-4">
                    <div class="stat-box">
                      <div class="stat-label">Total Weight</div>
                      <div class="stat-value">{{ recipeNutrition.total_weight_grams }}g</div>
                    </div>
                  </div>
                  <div class="col-6 col-md-4">
                    <div class="stat-box">
                      <div class="stat-label">Calories</div>
                      <div class="stat-value">{{ Math.round(recipeNutrition.calories) }} kcal</div>
                    </div>
                  </div>
                  <div class="col-6 col-md-4">
                    <div class="stat-box">
                      <div class="stat-label">Protein</div>
                      <div class="stat-value">{{ recipeNutrition.protein_g.toFixed(1) }}g</div>
                    </div>
                  </div>
                  <div class="col-6 col-md-4">
                    <div class="stat-box">
                      <div class="stat-label">Fat</div>
                      <div class="stat-value">{{ recipeNutrition.fat_g.toFixed(1) }}g</div>
                    </div>
                  </div>
                  <div class="col-6 col-md-4">
                    <div class="stat-box">
                      <div class="stat-label">Carbs</div>
                      <div class="stat-value">{{ recipeNutrition.carbohydrates_g.toFixed(1) }}g</div>
                    </div>
                  </div>
                  <div class="col-6 col-md-4">
                    <div class="stat-box">
                      <div class="stat-label">Fiber</div>
                      <div class="stat-value">{{ recipeNutrition.fiber_g.toFixed(1) }}g</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Comparison Bars -->
              <div class="nutrition-comparison">
                <h6 class="fw-semibold mb-3">Requirement Comparison</h6>
                
                <div 
                  v-for="(nutrient, key) in nutritionComparison" 
                  :key="key"
                  class="comparison-item mb-3"
                >
                  <div class="d-flex justify-content-between mb-1">
                    <span class="fw-semibold text-capitalize">{{ key }}</span>
                    <span class="text-muted">
                      {{ nutrient.actual.toFixed(1) }} / {{ nutrient.required.toFixed(1) }}
                      ({{ Math.round(nutrient.percentage) }}%)
                    </span>
                  </div>
                  <div class="progress" style="height: 25px;">
                    <div 
                      class="progress-bar"
                      :style="{ 
                        width: Math.min(nutrient.percentage, 100) + '%',
                        backgroundColor: getStatusColor(nutrient.status)
                      }"
                      role="progressbar"
                    >
                      {{ getStatusLabel(nutrient.status) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nutrition-test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 2rem;
}

.page-header {
  text-align: center;
  padding: 2rem 0 1rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #718096;
  margin: 0;
}

/* Cards */
.info-card,
.recipe-card,
.analysis-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: none;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0 !important;
  border: none;
}

.card-header h5 {
  font-size: 1.1rem;
  font-weight: 600;
}

/* Requirements */
.requirement-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.requirement-item:last-child {
  border-bottom: none;
}

.requirement-label {
  font-weight: 500;
  color: #4a5568;
}

.requirement-value {
  font-weight: 600;
  color: #2d3748;
}

/* Recipe Items */
.recipe-item {
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.recipe-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

/* Stat Boxes */
.stat-box {
  background: #f7fafc;
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
  border: 2px solid #e2e8f0;
}

.stat-label {
  font-size: 0.75rem;
  color: #718096;
  text-transform: uppercase;
  font-weight: 600;
  display: block;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

/* Comparison */
.comparison-item {
  padding: 0.5rem 0;
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
  transition: width 0.6s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.75rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }
}
</style>
