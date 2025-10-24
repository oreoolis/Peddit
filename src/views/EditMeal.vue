<script setup>
import AddIngredientModal from '@/components/PetViewComponents/AddIngredientModal.vue';
import IngredientCard from '@/components/PetViewComponents/IngredientCard.vue';
import { ref, onMounted, watch, computed } from 'vue';
import searchBar from '@/components/atoms/searchBar.vue';
import Button from '@/components/atoms/Button.vue';
import NutritionalOutputCard from '@/components/molecules/NutritionalOutputCard.vue';
import { usePetNutritionStore } from '@/stores/petNutritionStore';
import { usePetStore } from '@/stores/petStore';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';

// stores
const nutritionStore = usePetNutritionStore();
const petStore = usePetStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute(); // get id from route params

const { ingredients, loading } = storeToRefs(nutritionStore);

// current meal information
const currentMeal = ref(nutritionStore.getRecipe(route.query.meal));

// dynamic updating form values
const recipeName = currentMeal.recipe_name;
const recipeDescription = currentMeal.description;
const notes = currentMeal.notes;
const selectedIngredients = currentMeal.recipe_ingredients;
const showSuccess = ref(false);

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
    const multiplier = item.amount / 100; // Convert per 100g to actual amount

    if (nutrition.protein?.value) totals.protein += nutrition.protein.value * multiplier;
    if (nutrition.fat?.value) totals.fat += nutrition.fat.value * multiplier;
    if (nutrition.iron?.value) totals.iron += nutrition.iron.value * multiplier;
    if (nutrition.zinc?.value) totals.zinc += nutrition.zinc.value * multiplier;
    if (nutrition.calcium?.value) totals.calcium += nutrition.calcium.value * multiplier;
  });

  // Return in the format your component expects
  return {
    protein: { name: "Protein", value: totals.protein.toFixed(2) },
    fat: { name: "Fat", value: totals.fat.toFixed(2) },
    iron: { name: "Iron", value: totals.iron.toFixed(2) },
    zinc: { name: "Zinc", value: totals.zinc.toFixed(2) },
    calcium: { name: "Calcium", value: totals.calcium.toFixed(2) }
  };
});

// set date to conform with supabase standard
const formatDate = () => {
  const ms = Date.now();                   // epoch ms
  const d = new Date(ms);                  // Date object

  const pad = (n, l = 2) => String(n).padStart(l, "0");
  const yyyy = d.getUTCFullYear();
  const MM = pad(d.getUTCMonth() + 1);
  const dd = pad(d.getUTCDate());
  const HH = pad(d.getUTCHours());
  const mm = pad(d.getUTCMinutes());
  const ss = pad(d.getUTCSeconds());
  const SSS = pad(d.getUTCMilliseconds(), 3);

  // Date only has ms precision; microseconds beyond ms default to 000
  const uuu = "000";                       // microseconds beyond ms
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}.${SSS}${uuu}+00`;
}

// static form values
const form = ref({
  recipe_name: recipeName,
  description: recipeDescription,
  notes: notes,
  created_at: formatDate(),
  updated_at: formatDate(),
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
  form.value = {
    recipe_name: '',
    description: '',
    notes: '',
    created_at: Date.now(),
    updated_at: Date.now(),
  };
  selectedIngredients.value = [];
  nutritionStore.resetStore();
  showSuccess.value = false;
}

const handleSubmit = async () => {
  if (!form.value.recipe_name) {
    alert('Please fill in recipe name.');
    return;
  }

  const recipeRes = await nutritionStore.createRecipe({
    author_id: authStore.userId,
    recipe_name: form.value.recipe_name,
    description: form.value.description,
    notes: form.value.notes
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

  showSuccess.value = true;
  resetForm();
  router.push({
    path: '/pet',
    state: { showOpSuccess: true, message: form.value.recipe_name + "has been created!" }
  });


  // Hide success message after 3 seconds
  setTimeout(() => {
    showSuccess.value = false;
  }, 3000)

}

onMounted(async () => {
  await nutritionStore.fetchIngredients();
})

</script>

<template>
  <div class="add-meal-plan d-flex justify-content-center align-items-center min-vh-100">
    <div class="meal-form container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-9">
          <h1 class="headingFont display-4 fw-semibold mb-5 text-start">Create Meal Plan</h1>
          <form class="bodyFont" @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label for="mealName" class="form-label headingFont fw-bold h5">Meal Name</label>
              <searchBar id="mealName" type="text" v-model="form.recipe_name" placeholder="Salmon Delight"></searchBar>
            </div>
            <div class="mb-4">
              <label for="mealDescription" class="form-label headingFont fw-bold h5">Meal Description</label>
              <searchBar class="mt-3 " id="mealDescription" v-model="form.description" type="textarea"
                placeholder="A delicious and healthy meal..."></searchBar>
            </div>
            <div class="mb-4">
              <label for="mealDescription" class="form-label headingFont fw-bold h5">Notes</label>
              <searchBar class="mt-3 " id="mealDescription" v-model="form.notes" type="textarea"
                placeholder="A delicious and healthy meal..."></searchBar>
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
            <!-- protein, carbs, fat, vitamin c, iron -->
            <NutritionalOutputCard :nutrients="nutrients"></NutritionalOutputCard>
            <!-- Submit Button -->
            <Button class="w-100 justify-content-center py-3" label="Create Meal Plan"></Button>
          </form>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <AddIngredientModal class="mb-5" v-model:show="showIngredientModal" @error="console.error"
        :ingredients="ingredients" @addIngredient="addIngredient" />
    </Teleport>
  </div>
</template>

<style scoped>
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