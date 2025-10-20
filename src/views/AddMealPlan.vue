<script setup>
import AddIngredientModal from '@/components/PetViewComponents/AddIngredientModal.vue';
import IngredientCard from '@/components/PetViewComponents/IngredientCard.vue';
import { ref, onMounted } from 'vue'; // Import onMounted
import TextInput from '@/components/atoms/TextInput.vue';
import searchBar from '@/components/atoms/searchBar.vue';
import Button from '@/components/atoms/Button.vue';
import NutritionalOutputCard from '@/components/molecules/NutritionalOutputCard.vue';

// 1. Define a reactive object to hold all form data
const form = ref({
  kind: '',
  petBreed: '',
  petAge: '',
  mealName: '',
  mealDescription: '',
  ingredients: []
});

const showIngredientModal = ref(false);

const openIngredientModal = () => {
  showIngredientModal.value = true;
}

// --- Refactored Toast Logic ---
const toastElementRef = ref(null); // Template ref for the toast element
const toastMessage = ref('');     // Reactive variable for the toast's message
let toastInstance = null;         // Variable to hold the Bootstrap toast instance

// 2. Safely initialize the toast instance after the component mounts
onMounted(() => {
  if (toastElementRef.value) {
    toastInstance = new bootstrap.Toast(toastElementRef.value);
  }
});

// 3. Create a reliable function to show the toast
const showToast = (text) => {
  if (toastInstance) {
    toastMessage.value = text; // Set the message
    toastInstance.show();      // Show the toast
  } else {
    console.error("Toast instance is not ready.");
  }
}

// This function will now work correctly
const selectPetKind = (kind) => {
  form.value.kind = kind;
  showToast(`You have chosen ${kind.charAt(0).toUpperCase() + kind.slice(1)}!`);
}
</script>

<template>
    <!-- Toast Message -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <!-- 4. Use the template ref and bind the reactive message -->
      <div ref="toastElementRef" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-primary text-light">
          <strong class="me-auto">Peddit</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">{{ toastMessage }}</div>
      </div>
    </div>

    <div class="add-meal-plan d-flex justify-content-center align-items-center min-vh-100">
        <div class="meal-form container py-5">
            <div class="row justify-content-center">
                <div class="col-lg-10 col-xl-9">
                    <!-- Header -->
                    <h1 class="headingFont display-4 fw-semibold mb-5 text-center">Create Meal Plan</h1>
                    <div class="row justify-content-center g-4 mb-4">
                        <div class="col-12 col-md-5">
                            <div @click="selectPetKind('dog')" class="pet-breed-card dog-breed-card">
                            <p class="pet-title brandFont text-light display-1">Dog</p>
                            </div>
                        </div>
                        <div class="col-12 col-md-5">
                            <div @click="selectPetKind('cat')" class="pet-breed-card cat-breed-card">
                            <p class="pet-title brandFont text-light display-1">Cat</p>
                            </div>
                        </div>
                    </div>
                    <form class="bodyFont">
                        <!-- 5. Bind all inputs to the form object using v-model -->
                        <div class="mb-4">
                            <label for="petBreed" class="form-label headingFont fw-bold h5">Pet Breed</label>
                            <searchBar id="petBreed" type="text" v-model="form.petBreed" placeholder="Golden Retriever"></searchBar>
                        </div>                        
                        <div class="mb-4">
                            <label for="petAge" class="form-label headingFont fw-bold h5">Pet Age</label>
                            <searchBar id="petAge" type="number" v-model="form.petAge" placeholder="Age (Years)"></searchBar>
                        </div>                        
                        <div class="mb-4">
                            <label for="mealName" class="form-label headingFont fw-bold h5">Meal Name</label>
                            <searchBar id="mealName" type="text" v-model="form.mealName" placeholder="Salmon Delight"></searchBar>
                        </div>
                        <div class="mb-4">
                            <label for="mealDescription" class="form-label headingFont fw-bold h5">Meal Description</label>
                            <searchBar class="mt-3 " id="mealDescription" v-model="form.mealDescription" type="textarea" placeholder="A delicious and healthy meal..."></searchBar>
                        </div>

                        <!-- Ingredients Section -->
                        <div class="mb-4">
                            <h5 class="headingFont fw-bold mb-3">Ingredients</h5>
                            <div class="ingredient-grid">
                                <IngredientCard />
                                <IngredientCard />
                                <IngredientCard />
                                <IngredientCard />
                                <button 
                                    class="icon-btn add-btn shadow my-auto mx-auto" 
                                    @click.prevent="openIngredientModal" 
                                    type="button"
                                >
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
    gap: 1rem; /* The space between cards */
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
  height: 300px; /* Default height for mobile */
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
  .pet-breed-card { height: 350px; }
}
@media (min-width: 992px) {
  .pet-breed-card { height: 450px; }
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