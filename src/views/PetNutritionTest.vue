<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { usePetNutritionStore } from '@/stores/petNutritionStore';
import { usePetStore } from '@/stores/petStore';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { useDebounceFn } from '@vueuse/core';

// Components
import BasePageHeader from '@/components/atoms/BasePageHeader.vue';
import PetInfoCard from '@/components/molecules/nutrition/PetInfoCard.vue';
import NutritionRequirementsCard from '@/components/molecules/nutrition/NutritionRequirementsCard.vue';
import RecipeNutritionTotals from '@/components/molecules/nutrition/RecipeNutritionTotals.vue';
import NutritionComparisonBars from '@/components/molecules/nutrition/NutritionComparisonBars.vue';
import BaseButton from '@/components/atomic/BaseButton.vue';
import BaseIcon from '@/components/atomic/BaseIcon.vue';

// Stores
const nutritionStore = usePetNutritionStore();
const petStore = usePetStore();
const authStore = useAuthStore();

const { userId } = storeToRefs(authStore);
const { pets } = storeToRefs(petStore);
const { nutritionProfiles, ingredients, recipes, loading } = storeToRefs(nutritionStore);

// Pet Information State
const selectedPet = ref(null);
const petKind = ref('dog');
const petLifeStage = ref('adult_maintenance');
const petWeight = ref(10);
const nutritionRequirements = ref(null);

// Recipe State
const currentRecipe = ref(null);
const recipeName = ref('');
const recipeDescription = ref('');
const selectedIngredients = ref([]);
const ingredientSearchQuery = ref('');
const showIngredientDropdown = ref(false);
const ingredientQuantity = ref(100);
const recipeNutrition = ref(null);
const nutritionComparison = ref(null);

// UI State
const activeTab = ref('pet-info');
const showRecipeForm = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// Computed
const canCreateRecipe = computed(() => {
  return recipeName.value.trim() && selectedIngredients.value.length > 0;
});

const availableIngredients = computed(() => {
  return ingredients.value.filter(ing => 
    !selectedIngredients.value.some(si => si.ingredient.id === ing.id)
  );
});

const filteredIngredients = computed(() => {
  const query = ingredientSearchQuery.value.toLowerCase().trim();
  if (!query) return availableIngredients.value.slice(0, 10);
  
  return availableIngredients.value
    .filter(ing => ing.name.toLowerCase().includes(query))
    .slice(0, 10);
});

// Lifecycle
onMounted(async () => {
  await Promise.all([
    nutritionStore.fetchNutritionProfiles(),
    nutritionStore.fetchIngredients(),
  ]);
  
  if (userId.value) {
    await nutritionStore.fetchRecipes(userId.value);
    await petStore.fetchPets(userId.value);
  }
  
  await fetchNutritionRequirements();
});

// Watchers
watch(userId, async (newUserId) => {
  if (newUserId) {
    await nutritionStore.fetchRecipes(newUserId);
    await petStore.fetchPets(newUserId);
  }
});

watch(selectedPet, async (newPet) => {
  if (newPet) {
    petKind.value = newPet.kind;
    petWeight.value = newPet.weight_kg || 5;
    await fetchNutritionRequirements();
  }
});

watch([petKind, petLifeStage], async () => {
  await fetchNutritionRequirements();
});

watch(selectedIngredients, () => {
  calculateNutrition();
}, { deep: true });

// Methods
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

const selectIngredient = (ingredient) => {
  selectedIngredients.value.push({
    ingredient,
    quantity: ingredientQuantity.value
  });
  
  ingredientSearchQuery.value = '';
  showIngredientDropdown.value = false;
  ingredientQuantity.value = 100;
};

const handleSearchInput = useDebounceFn(() => {
  showIngredientDropdown.value = ingredientSearchQuery.value.length > 0;
}, 300);

const removeIngredient = (index) => {
  selectedIngredients.value.splice(index, 1);
};

const updateQuantity = (index, newQuantity) => {
  if (newQuantity > 0) {
    selectedIngredients.value[index].quantity = parseFloat(newQuantity);
  }
};

const calculateNutrition = () => {
  if (selectedIngredients.value.length === 0) {
    recipeNutrition.value = null;
    nutritionComparison.value = null;
    return;
  }

  const recipeIngredientsFormat = selectedIngredients.value.map(si => ({
    quantity_g: si.quantity,
    food_ingredients: si.ingredient
  }));

  recipeNutrition.value = nutritionStore.calculateRecipeNutrition(recipeIngredientsFormat);
  calculateComparison();
};

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

const createRecipe = async () => {
  if (!canCreateRecipe.value) {
    showError('Please provide a recipe name and add at least one ingredient');
    return;
  }

  if (!userId.value) {
    showError('Please login to save recipes');
    return;
  }

  try {
    const recipeResult = await nutritionStore.createRecipe({
      recipe_name: recipeName.value,
      description: recipeDescription.value,
      author_id: userId.value
    });

    if (!recipeResult.success) {
      showError(recipeResult.error);
      return;
    }

    const recipeId = recipeResult.data.id;

    for (const si of selectedIngredients.value) {
      await nutritionStore.addIngredientToRecipe(
        recipeId,
        si.ingredient.id,
        si.quantity
      );
    }

    showSuccess('Recipe created successfully!');
    
    recipeName.value = '';
    recipeDescription.value = '';
    selectedIngredients.value = [];
    showRecipeForm.value = false;

    await nutritionStore.fetchRecipes(userId.value);
  } catch (err) {
    showError('Failed to create recipe: ' + err.message);
  }
};

const loadRecipe = async (recipe) => {
  const result = await nutritionStore.getRecipe(recipe.id);
  
  if (result.success) {
    currentRecipe.value = result.data;
    recipeName.value = result.data.recipe_name;
    recipeDescription.value = result.data.description || '';
    
    selectedIngredients.value = result.data.recipe_ingredients.map(ri => ({
      ingredient: ri.food_ingredients,
      quantity: ri.quantity_g
    }));
    
    showRecipeForm.value = true;
    activeTab.value = 'recipe';
  }
};

const deleteRecipe = async (recipeId) => {
  if (!confirm('Are you sure you want to delete this recipe?')) return;

  const result = await nutritionStore.deleteRecipe(recipeId);
  
  if (result.success) {
    showSuccess('Recipe deleted successfully');
    if (userId.value) {
      await nutritionStore.fetchRecipes(userId.value);
    }
  } else {
    showError(result.error);
  }
};

const showSuccess = (message) => {
  successMessage.value = message;
  setTimeout(() => successMessage.value = '', 3000);
};

const showError = (message) => {
  errorMessage.value = message;
  setTimeout(() => errorMessage.value = '', 5000);
};
</script>

<template>
  <div class="nutrition-test-page">
    <div class="container py-4">
      <!-- Header -->
      <BasePageHeader 
        title="Pet Nutrition Management System" 
        subtitle="Create custom recipes and analyze nutritional values for your pets"
        icon="clipboard-data"
      />

      <!-- Messages -->
      <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
        <BaseIcon name="check-circle" size="sm" class="me-2" />
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
        <BaseIcon name="exclamation-triangle" size="sm" class="me-2" />
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
          <PetInfoCard 
            :pets="pets"
            v-model:selected-pet="selectedPet"
            v-model:pet-kind="petKind"
            v-model:pet-life-stage="petLifeStage"
            v-model:pet-weight="petWeight"
            class="mb-3"
          />

          <NutritionRequirementsCard 
            v-if="nutritionRequirements"
            :nutrition-requirements="nutritionRequirements"
          />
        </div>

        <!-- Right Column: Recipe Builder -->
        <div class="col-lg-8">
          <!-- Recipe Builder Card -->
          <div class="card recipe-card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <BaseIcon name="journal-text" size="md" class="me-2" />
                Recipe Builder
              </h5>
              <BaseButton 
                variant="primary" 
                size="sm"
                :icon="showRecipeForm ? 'x' : 'plus'"
                @click="showRecipeForm = !showRecipeForm"
              >
                {{ showRecipeForm ? 'Cancel' : 'New Recipe' }}
              </BaseButton>
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
                      <div class="autocomplete-wrapper">
                        <input 
                          type="text"
                          v-model="ingredientSearchQuery"
                          @input="handleSearchInput"
                          @focus="showIngredientDropdown = ingredientSearchQuery.length > 0"
                          @blur="setTimeout(() => showIngredientDropdown = false, 200)"
                          class="form-control"
                          placeholder="Search ingredients..."
                        >
                        <div 
                          v-if="showIngredientDropdown && filteredIngredients.length > 0" 
                          class="autocomplete-dropdown"
                        >
                          <div 
                            v-for="ing in filteredIngredients" 
                            :key="ing.id"
                            @click="selectIngredient(ing)"
                            class="autocomplete-item"
                          >
                            {{ ing.name }}
                          </div>
                        </div>
                      </div>
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
                      <div class="text-muted small text-center mt-2">
                        {{ filteredIngredients.length }} results
                      </div>
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
                            <BaseButton 
                              variant="danger" 
                              size="sm"
                              icon="trash"
                              @click="removeIngredient(index)"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <BaseButton 
                  variant="primary"
                  icon="save"
                  :disabled="!canCreateRecipe"
                  @click="createRecipe"
                >
                  Save Recipe
                </BaseButton>
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
                        <h6 class="card-title">{{ recipe.recipe_name }}</h6>
                        <p class="card-text text-muted small">
                          {{ recipe.description || 'No description' }}
                        </p>
                        <div class="d-flex gap-2">
                          <BaseButton 
                            variant="outline-primary" 
                            size="sm"
                            icon="eye"
                            @click="loadRecipe(recipe)"
                          >
                            View
                          </BaseButton>
                          <BaseButton 
                            variant="outline-danger" 
                            size="sm"
                            icon="trash"
                            @click="deleteRecipe(recipe.id)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="!showRecipeForm && recipes.length === 0" class="text-center py-4">
                <BaseIcon name="journal-x" size="xl" variant="muted" />
                <p class="text-muted mt-2">
                  No recipes yet. {{ userId ? 'Create your first recipe!' : 'Login to create and save recipes.' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Nutrition Analysis Card -->
          <div class="card analysis-card" v-if="recipeNutrition && nutritionComparison">
            <div class="card-header">
              <h5 class="mb-0">
                <BaseIcon name="bar-chart-fill" size="md" class="me-2" />
                Nutritional Analysis
              </h5>
            </div>
            <div class="card-body">
              <RecipeNutritionTotals :nutrition="recipeNutrition" />
              <NutritionComparisonBars :comparison="nutritionComparison" />
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

/* Autocomplete */
.autocomplete-wrapper {
  position: relative;
}

.autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 4px;
}

.autocomplete-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f7fafc;
  transition: background-color 0.2s;
}

.autocomplete-item:last-child {
  border-bottom: none;
}

.autocomplete-item:hover {
  background-color: #f7fafc;
}

/* Cards */
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

.recipe-item {
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.recipe-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}
</style>
