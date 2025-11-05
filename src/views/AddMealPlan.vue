<script setup>
import AddIngredientModal from '@/components/PetViewComponents/AddIngredientModal.vue';
import IngredientCard from '@/components/PetViewComponents/IngredientCard.vue';
import { ref, onMounted, watch, computed } from 'vue';
import searchBar from '@/components/atoms/searchBar.vue';
import button from '@/components/atoms/button.vue';
import NutritionalOutputCard from '@/components/molecules/NutritionalOutputCard.vue';
import { usePetNutritionStore } from '@/stores/petNutritionStore';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useToastStore } from '@/stores/toastStore';
import { useUserStore } from '@/stores/userStore';
import dogImage from '@/assets/Pixel Art/dog (1).png';
import catImage from '@/assets/Pixel Art/cat (5).png';


// stores
const nutritionStore = usePetNutritionStore();
const toastStore = useToastStore();
const authStore = useAuthStore();
const router = useRouter();
const userStore = useUserStore();


const { ingredients, loading } = storeToRefs(nutritionStore);

// dynamic updating form values
const petKind = ref('');
const recipeName = ref('');
const recipeDescription = ref('');
const notes = ref('');
const selectedIngredients = ref([]);
const showSuccess = ref(false);
const petNutritionProfile = ref(null);

// total nutrients

// Remove the individual total refs and the static nutrients ref
// Replace with a single computed that derives from selectedIngredients

const nutrients = computed(() => {
  const totals = {
    protein: 0,
    fat: 0,
    iron: 0,
    zinc: 0,
    calcium: 0
  };

  // Calculate totals from selected ingredients
  selectedIngredients.value.forEach(item => {
    const nutrition = item.ingredient.nutrition;
    const multiplier = item.amount / 100;

    if (nutrition.protein?.value) totals.protein += nutrition.protein.value * multiplier;
    if (nutrition.fat?.value) totals.fat += nutrition.fat.value * multiplier;
    if (nutrition.iron?.value) totals.iron += nutrition.iron.value * multiplier;
    if (nutrition.zinc?.value) totals.zinc += nutrition.zinc.value * multiplier;
    if (nutrition.calcium?.value) totals.calcium += nutrition.calcium.value * multiplier;
  });

  // Add comparison with requirements if profile is loaded
  const comparisonData = petNutritionProfile.value ? {
    proteinRequired: petNutritionProfile.value.min_protein_g,
    fatRequired: petNutritionProfile.value.min_fat_g,
    ironRequired: petNutritionProfile.value.min_iron_mg,
    zincRequired: petNutritionProfile.value.min_zinc_mg,
    calciumRequired: petNutritionProfile.value.min_calcium_g
  } : null;

  return {
    protein: {
      name: "Protein",
      value: totals.protein.toFixed(2),
      required: comparisonData?.proteinRequired
    },
    fat: {
      name: "Fat",
      value: totals.fat.toFixed(2),
      required: comparisonData?.fatRequired
    },
    iron: {
      name: "Iron",
      value: totals.iron.toFixed(2),
      required: comparisonData?.ironRequired
    },
    zinc: {
      name: "Zinc",
      value: totals.zinc.toFixed(2),
      required: comparisonData?.zincRequired
    },
    calcium: {
      name: "Calcium",
      value: totals.calcium.toFixed(2),
      required: comparisonData?.calciumRequired
    }
  };
});

const showIngredientModal = ref(false);

const openIngredientModal = () => {
  showIngredientModal.value = true;
}

const addIngredient = (data) => {
  selectedIngredients.value.push({
    ingredient: data.ingredient,
    amount: data.amount,
    id: Date.now()
  });
}

const removeIngredient = (id) => {
  selectedIngredients.value = selectedIngredients.value.filter(item => item.id !== id);
}


const resetForm = () => {
  petKind.value = '';
  recipeName.value = '';
  recipeDescription.value = '';
  notes.value = '';
  selectedIngredients.value = [];
  petNutritionProfile.value = null;
  showSuccess.value = false;
}

const handleSubmit = async () => {
  if (!recipeName.value) {
    alert('Please fill in recipe name.');
    return;
  }

  if (!petKind.value) {
    alert("Please select a species.");
    return;
  }

  const recipeRes = await nutritionStore.createRecipe({
    author_id: authStore.userId,
    pet_kind: petKind.value,
    recipe_name: recipeName.value,
    description: recipeDescription.value,
    notes: notes.value
  });

  if (!recipeRes.success) {
    showSuccess.value = false;
    return;
  }

  const recipeId = recipeRes.data.id;

  for (let selIng of selectedIngredients.value) {
    await nutritionStore.addIngredientToRecipe(
      recipeId,
      selIng.ingredient.id,
      selIng.amount
    );
  }

  // Add ALL ingredients to shopping list at once as an ARRAY
  if (selectedIngredients.value.length > 0) {
    const formattedIngredients = selectedIngredients.value.map(selIng => ({
      food_ingredients: selIng.ingredient,
      quantity_g: selIng.amount
    }));

    await userStore.addUnformattedToShoppingList(formattedIngredients);
  }


  showSuccess.value = true;
  resetForm();

  toastStore.showToast("Meal has been created!");
  router.push({
    path: '/pet'
  });


  // Hide success message after 3 seconds
  setTimeout(() => {
    showSuccess.value = false;
  }, 3000)

}

const selectPetKind = async (kind) => {
  petKind.value = kind;
  // Ensure nutrition profiles are loaded before accessing
  if (!nutritionStore.nutritionProfiles?.length && nutritionStore.fetchNutritionProfiles) {
    await nutritionStore.fetchNutritionProfiles();
  }
  // Fetch nutrition profile immediately after selection (returns row or null)
  const profile = nutritionStore.getNutritionProfile(
    kind,
    // set adult as default (mapped to 'adult_maintenance' in store)
    'adult'
  );

  if (profile) {
    petNutritionProfile.value = profile;
  } else {
    console.error('Failed to load nutrition profile for', kind);
  }
}

const nutrientMaxValues = computed(() => {
  if (!petNutritionProfile.value) {
    return null;
  }

  return {
    'Protein': petNutritionProfile.value.nutrition.protein,
    'Fat': petNutritionProfile.value.nutrition.fat,
    'Iron': petNutritionProfile.value.nutrition.iron,
    'Zinc': petNutritionProfile.value.nutrition.zinc,
    'Calcium': petNutritionProfile.value.nutrition.calcium
  };
});


onMounted(async () => {
  // Ensure required data is loaded
  await Promise.all([
    nutritionStore.fetchNutritionProfiles(),
    nutritionStore.fetchIngredients()
  ]);
})

</script>

<template>
  <div class="container-fluid">
    <form @submit.prevent="handleSubmit" class="pet-form">
      <!-- Pet Species Selector -->
      <div class="pet-selector mt-4 mb-5">
        <div class="row d-flex justify-content-evenly">
          <div class="col-lg-8">
            <h1 class="headingFont display-3 text-start fw-semibold">Create Meal Plan</h1>
          </div>
        </div>
        <div class="row justify-content-center mt-3 mb-3 g-3">
          <div class="col-12 col-sm-6 col-md-5 col-lg-4 d-flex justify-content-center">
            <div @click="selectPetKind('dog')" class="dog-breed-card" :style="{
              backgroundImage: `url('${dogImage}')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }" :class="{ 'selected-pet': petKind === 'dog', 'dimmed-pet': petKind === 'cat' }"
              id="dog-breed-card">
              <p class="pet-title brandFont text-light display-1">Dog</p>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-5 col-lg-4 d-flex justify-content-center">
            <div @click="selectPetKind('cat')" class="cat-breed-card" :style="{
              backgroundImage: `url('${catImage}')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }" :class="{ 'selected-pet': petKind === 'cat', 'dimmed-pet': petKind === 'dog' }"
              id="cat-breed-card">
              <p class="pet-title brandFont text-light display-1">Cat</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Form Inputs -->
      <div class="input-forms container-fluid">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="mb-4">
              <label for="mealName" class="form-label headingFont fw-bold h5">Meal Name</label>
              <searchBar id="mealName" type="text" v-model="recipeName" placeholder="Salmon Delight"></searchBar>
            </div>
            <div class="mb-4">
              <label for="mealDescription" class="form-label headingFont fw-bold h5">Meal Description</label>
              <searchBar class="mt-3" id="mealDescription" v-model="recipeDescription" type="textarea"
                placeholder="A delicious and healthy meal..."></searchBar>
            </div>
            <div class="mb-4">
              <label for="notes" class="form-label headingFont fw-bold h5">Notes</label>
              <searchBar class="mt-3" id="notes" v-model="notes" type="textarea" placeholder="Add any notes here...">
              </searchBar>
            </div>

            <!-- Ingredients Section -->
            <div class="mb-4">
              <h5 class="headingFont fw-bold mb-3">Ingredients</h5>
              <div class="ingredient-grid">
                <IngredientCard v-for="item in selectedIngredients" :key="item.id" :name="item.ingredient.name"
                  :amount="item.amount" @click="removeIngredient(item.id)" />

                <button class="icon-btn add-btn shadow my-auto mx-auto" @click.prevent="openIngredientModal"
                  type="button">
                  <div class="add-icon"></div>
                  <div class="btn-txt">New Item</div>
                </button>
              </div>
            </div>

            <!-- Nutritional Output Card -->
            <NutritionalOutputCard :nutrients="nutrients" :nutrientMaxValues="nutrientMaxValues">
            </NutritionalOutputCard>

            <!-- Form Actions -->
            <div class="form-actions d-flex justify-content-center mt-3">
              <button class="bodyFont d-inline mx-2" color="secondary" type="button" @click="resetForm" label="Reset">
              </button>
              <button class="bodyFont d-inline mx-2" label="Create Meal Plan" type="submit">
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>

    <Teleport to="body">
      <AddIngredientModal class="mb-5" v-model:show="showIngredientModal" @error="console.error"
        :ingredients="ingredients" @addIngredient="addIngredient" />
    </Teleport>
  </div>
</template>


<style scoped>
.dog-breed-card {
  box-sizing: border-box;
  width: 100%;
  height: 300px;
  background-position: center;
  background-size: cover;
  border: 1px solid white;
  box-shadow: 12px 17px 51px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(6px);
  border-radius: 17px;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  font-weight: bolder;
  color: black;
}

.cat-breed-card {
  box-sizing: border-box;
  width: 100%;
  height: 300px;
  background-position: center;
  background-size: cover;
  border: 1px solid white;
  box-shadow: 12px 17px 51px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(6px);
  border-radius: 17px;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  font-weight: bolder;
  color: black;
}

/* Responsive heights using Bootstrap breakpoints */
@media (min-width: 576px) {

  .dog-breed-card,
  .cat-breed-card {
    height: 350px;
  }
}

@media (min-width: 768px) {

  .dog-breed-card,
  .cat-breed-card {
    height: 400px;
  }
}

@media (min-width: 992px) {

  .dog-breed-card,
  .cat-breed-card {
    height: 450px;
  }
}

@media (min-width: 1200px) {

  .dog-breed-card,
  .cat-breed-card {
    height: 500px;
  }
}

.dog-breed-card:hover,
.cat-breed-card:hover {
  border: 1px solid black;
  transform: scale(1.05);
}

.dog-breed-card:active,
.cat-breed-card:active {
  transform: scale(0.95) rotateZ(1.7deg);
}

/* Selected pet card styling */
.selected-pet {
  border: 5px solid #407dff !important;
  box-shadow: 0 0 30px rgba(64, 125, 255, 0.7) !important;
  transform: scale(1.03);
  position: relative;
}

/* Dimmed/unselected pet card */
.dimmed-pet {
  opacity: 0.5;
  filter: grayscale(60%);
  transform: scale(0.97);
}

.dimmed-pet:hover {
  opacity: 0.7;
  filter: grayscale(40%);
  transform: scale(1);
}

/* Center entire page in viewport */
.add-meal-plan {
  position: relative;
}

/* New CSS Grid layout for ingredients */
.ingredient-grid {
  display: grid;
  /* This creates responsive columns. They will be at least 120px wide, 
       but will grow to fill the space evenly. */
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  /* The space between cards */
}

.icon-btn {
  width: 50px;
  height: 50px;
  border: 1px solid #cdcdcd;
  background: white;
  border-radius: 25px;
  overflow: hidden;
  position: relative;
  transition: width 0.2s ease-in-out;
  font-weight: 500;
  font-family: inherit;
}

.add-btn:hover {
  width: 120px;
}

.add-btn::before,
.add-btn::after {
  transition: width 0.2s ease-in-out, border-radius 0.2s ease-in-out;
  content: "";
  position: absolute;
  height: 4px;
  width: 10px;
  top: calc(50% - 2px);
  background: rgb(0, 0, 0);
}

.add-btn::after {
  right: 14px;
  overflow: hidden;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.add-btn::before {
  left: 14px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

.icon-btn:focus {
  outline: none;
}

.btn-txt {
  opacity: 0;
  transition: opacity 0.2s;
}

.add-btn:hover::before,
.add-btn:hover::after {
  width: 4px;
  border-radius: 2px;
}

.add-btn:hover .btn-txt {
  opacity: 1;
}

.add-icon::after,
.add-icon::before {
  transition: all 0.2s ease-in-out;
  content: "";
  position: absolute;
  height: 20px;
  width: 2px;
  top: calc(50% - 10px);
  background: rgb(0, 0, 0);
  overflow: hidden;
}

.add-icon::before {
  left: 22px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

.add-icon::after {
  right: 22px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.add-btn:hover .add-icon::before {
  left: 15px;
  height: 4px;
  top: calc(50% - 2px);
}

.add-btn:hover .add-icon::after {
  right: 15px;
  height: 4px;
  top: calc(50% - 2px);
}

.pet-title {
  text-shadow: 1px 5px 5px black;
}

.pet-breed-card {
  box-sizing: border-box;
  width: 100%;
  height: 300px;
  /* Default height for mobile */
  background-position: center;
  background-size: cover;
  border: 1px solid white;
  box-shadow: 12px 17px 51px rgba(0, 0, 0, 0.22);
  border-radius: 17px;
  cursor: pointer;
  transition: all 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  font-weight: bolder;
}

.dog-breed-card {
  background-image: url("../assets/Pixel Art/dog (1).png");
}

.cat-breed-card {
  background-image: url("../assets/Pixel Art/cat (5).png");
}

@media (min-width: 576px) {
  .pet-breed-card {
    height: 350px;
  }
}

@media (min-width: 992px) {
  .pet-breed-card {
    height: 450px;
  }
}

.pet-breed-card:hover {
  border: 1px solid black;
  transform: scale(1.05);
}

.pet-breed-card:active {
  transform: scale(0.95) rotateZ(1.7deg);
}

.preview-image {
  width: 150px;
  height: 150px;
  border: 2px solid #e0e0e0;
}
</style>
