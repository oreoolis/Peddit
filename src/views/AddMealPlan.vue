<script setup>
import AddIngredientModal from '@/components/PetViewComponents/AddIngredientModal.vue';
import IngredientCard from '@/components/PetViewComponents/IngredientCard.vue';
import { ref, onMounted } from 'vue';
import TextInput from '@/components/atoms/TextInput.vue';
import searchBar from '@/components/atoms/searchBar.vue';
import Button from '@/components/atoms/Button.vue';
import NutritionalOutputCard from '@/components/molecules/NutritionalOutputCard.vue';

// 1. Define a reactive object to hold all form data
const form = ref({
  mealName: '',
  mealDescription: '',
  notes: '',
  createdAt: '',
  updatedAt: '',
  ingredients: []
});

const showIngredientModal = ref(false);

const openIngredientModal = () => {
  showIngredientModal.value = true;
}

</script>

<template>
  <div class="add-meal-plan d-flex justify-content-center align-items-center min-vh-100">
    <div class="meal-form container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-9">
          <h1 class="headingFont display-4 fw-semibold mb-5 text-start">Create Meal Plan</h1>
          <form class="bodyFont">      
            <div class="mb-4">
              <label for="mealName" class="form-label headingFont fw-bold h5">Meal Name</label>
              <searchBar id="mealName" type="text" v-model="form.mealName" placeholder="Salmon Delight"></searchBar>
            </div>
            <div class="mb-4">
              <label for="mealDescription" class="form-label headingFont fw-bold h5">Meal Description</label>
              <searchBar class="mt-3 " id="mealDescription" v-model="form.mealDescription" type="textarea"
                placeholder="A delicious and healthy meal..."></searchBar>
            </div>
            <div class="mb-4">
              <label for="mealDescription" class="form-label headingFont fw-bold h5">Notes</label>
              <searchBar class="mt-3 " id="mealDescription" v-model="form.mealDescription" type="textarea"
                placeholder="A delicious and healthy meal..."></searchBar>
            </div>

            <!-- Ingredients Section -->
            <div class="mb-4">
              <h5 class="headingFont fw-bold mb-3">Ingredients</h5>
              <div class="ingredient-grid">
                <IngredientCard />
                <IngredientCard />
                <IngredientCard />
                <IngredientCard />
                <button class="icon-btn add-btn shadow my-auto mx-auto" @click.prevent="openIngredientModal"
                  type="button">
                  <div class="add-icon"></div>
                  <div class="btn-txt">New Item</div>
                </button>
              </div>
            </div>

            <!-- Nutritional Output Card -->
            <NutritionalOutputCard></NutritionalOutputCard>
            <!-- Submit Button -->
            <Button class="w-100 justify-content-center py-3" label="Create Meal Plan"></Button>
          </form>
        </div>
      </div>
    </div>
    <AddIngredientModal class="mb-5" v-model:show="showIngredientModal" @error="console.error" />
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