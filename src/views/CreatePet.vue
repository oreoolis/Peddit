<script setup>
import { usePetStore } from '@/stores/petStore';
import { useAuthStore } from '@/stores/authStore';
import { usePetInfoApi } from '@/composables/usePetInfoApi';
import { usePetNutritionStore } from '@/stores/petNutritionStore';
import { useToastStore } from '@/stores/toastStore';
import { onMounted, ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/atoms/button.vue';
import searchBar from '@/components/atoms/searchBar.vue';
import BreedSelect from '@/components/molecules/create-edit-pet/BreedSelect.vue';
import MealPlanSelect from '@/components/molecules/create-edit-pet/MealPlanSelect.vue';
import dogImage from '@/assets/Pixel Art/dog (1).png';
import catImage from '@/assets/Pixel Art/cat (5).png';
import ToastStatus from '@/components/molecules/ToastStatus.vue';

const petStore = usePetStore();
const authStore = useAuthStore();
const nutritionStore = usePetNutritionStore();
const toastStore = useToastStore();
const router = useRouter(); // push to next page

const showSuccess = ref(false);

// initial form data
const petKind = ref('dog'); // default value
const { breedNames, error: breedError, isFetching: isFetchingBreeds } = usePetInfoApi(petKind);
const recipes = ref(null);

// dynamically update breed list
const breedNameList = ref([]);

watch([petKind, isFetchingBreeds], () => {
  if (isFetchingBreeds.value) {
    return;
  }
  breedNameList.value = breedNames.value;
})

// default form values
const form = ref({
  name: '',
  kind: petKind.value,
  breed: '',
  gender: 'unknown',
  birthdate: '',
  weight_kg: null,
  neutered: true,
  allergies: '',
  preferred_recipe: null
});

const imageFile = ref(null);
const imagePreview = ref(null);

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const handleImageSelect = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
}

const removeImage = () => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
  imageFile.value = null;
  imagePreview.value = null;
}

const handleSubmit = async () => {
  if (!form.value.name || !form.value.kind) {
    alert('Please fill in required fields');
    return;
  } 

  const result = await petStore.createPet(authStore.userId, { ...form.value, photo_url: null });

  if (result.success) {
    if (imageFile.value) {
      await petStore.uploadPetImage(authStore.userId, result.data.id, imageFile.value);
    }

    showSuccess.value = true;
    resetForm();
    toastStore.showToast("Pet has been created!");
    router.push({
      path: '/pet'
    });

    // Hide success message after 3 seconds
    setTimeout(() => {
      showSuccess.value = false;
    }, 3000)
  } else if (res.error.code === '22003') {
    toastStore.showToast("Error creating pet!", 5000);
    showSuccess.value = false;
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    kind: '',
    breed: '',
    gender: 'unknown',
    birthdate: '',
    weight_kg: null,
    neutered: true,
    allergies: '',
    preferred_recipe: null
  };
  removeImage();
  petStore.clearError();
  showSuccess.value = false;
}

const selectPetKind = (kind) => {
  petKind.value = kind;
  form.value.kind = kind;
}

// filter recipes by petKind
const filteredRecipes = computed(() => {
  if (!recipes.value || !form.value.kind) {
    return null;
  }

  return recipes.value.filter(recipe => recipe.pet_kind === form.value.kind);
});

onMounted(async () => {
  const res = await nutritionStore.fetchRecipes(authStore.userId);
  if (res.success) {
    recipes.value = res.data;
  }
});
</script>

<template>
  <div class="container-fluid">
    <ToastStatus :showOpSuccess="toastStore.showOpSuccess" :message="toastStore.message" />
    <form @submit.prevent="handleSubmit" class="pet-form">
      <!-- Pet Species Selector -->
      <div class="pet-selector mt-4 mb-5">
        <div class="row d-flex justify-content-evenly">
          <div class="col-lg-8">
            <h1 class="headingFont display-3 text-start fw-semibold">Create Your Pet</h1>
          </div>
        </div>
        <div class="row justify-content-center mt-3 mb-3 g-3">
          <div class="col-12 col-sm-6 col-md-5 col-lg-4 d-flex justify-content-center">
            <div @click="selectPetKind('dog')" class="dog-breed-card" :style="{
              backgroundImage: `url('${dogImage}')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }" :class="{ 'selected-pet': petKind === 'dog', 'dimmed-pet': petKind === 'cat' }" id="dog-breed-card">
              <p class="pet-title brandFont text-light display-1">Dog</p>
            </div>

          </div>
          <div class="col-12 col-sm-6 col-md-5 col-lg-4 d-flex justify-content-center">
            <div @click="selectPetKind('cat')" class="cat-breed-card" :style="{
              backgroundImage: `url('${catImage}')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }" :class="{ 'selected-pet': petKind === 'cat', 'dimmed-pet': petKind === 'dog' }" id="cat-breed-card">
              <p class="pet-title brandFont text-light display-1">Cat</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="form.kind == ''" class="text-center mb-3">
        <h3 class="headingFont warning fw-semibold">Please select a species.</h3>
      </div>

      <!-- Form Inputs -->
      <div class="input-forms container-fluid">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <!-- Photo Upload -->
            <div class="mb-3">
              <label for="pet-photo-input" class="form-label headingFont fw-bold h5">Upload Pet Photo</label>
              <input id="pet-photo-input" type="file" accept="image/*" @change="handleImageSelect" class="d-none" />
              <label for="pet-photo-input" class="d-block" style="cursor: pointer;">
                <searchBar :model-value="imageFile ? imageFile.name : ''" placeholder="Click to select an image..."
                  readonly>
                  <template #icon><i class="bi bi-upload"></i></template>
                </searchBar>
              </label>
            </div>

            <!-- Image Preview -->
            <div v-if="imagePreview" class="text-center p-3 border border-2 border-dashed rounded bg-light mb-3">
              <h6 class="preview-title">Preview</h6>
              <div class="position-relative d-inline-block">
                <img :src="imagePreview" alt="Preview" class="preview-image rounded object-fit-cover" />
                <button type="button" @click="removeImage"
                  class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle">×</button>
              </div>
              <p class="text-muted small mt-1 mb-0">{{ imageFile?.name }} ({{ formatFileSize(imageFile?.size) }})</p>
            </div>

            <!-- Other Inputs -->
            <div class="mb-3">
              <label class="form-label headingFont fw-bold h5">Pet Name</label>
              <searchBar type="text" placeholder="Frosty" v-model="form.name" />
            </div>
            <div class="mb-3">
              <label class="form-label headingFont fw-bold h5">Gender</label>
              <div class="radio-inputs bodyFont mt-2">
                <label class="radio"><input checked name="radio" type="radio" value="male" v-model="form.gender" /><span
                    class="name">Male</span></label>
                <label class="radio"><input name="radio" type="radio" value="female" v-model="form.gender" /><span
                    class="name">Female</span></label>
                <label class="radio"><input name="radio" type="radio" value="unknown" v-model="form.gender" /><span
                    class="name">Unknown</span></label>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label headingFont fw-bold h5">Birthday</label>
              <searchBar type="date" placeholder="Select Date" v-model="form.birthdate" />
            </div>
            <div class="mb-3">
              <label class="form-label headingFont fw-bold h5">Breed</label>
              <BreedSelect defaultLabel="Select Breed..." :breedOptions="breedNameList" :isSearchable="true"
                v-model="form.breed" />
            </div>
            <div class="mb-3">
              <label class="form-label headingFont fw-bold h5">Weight</label>
              <searchBar type="number" placeholder="Weight (KG)" v-model="form.weight_kg" />
            </div>
            <div class="mb-3">
              <label class="form-label headingFont fw-bold h5">Allergies (Optional)</label>
              <searchBar type="text" placeholder="e.g. Pollen, Dust" v-model="form.allergies" />
            </div>
            <div class="mb-3">
              <label class="form-label headingFont fw-bold h5">Selected Meal</label>
              <MealPlanSelect defaultLabel="Select Meal Plan..." :mealOptions="filteredRecipes" :isSearchable="true"
                v-model="form.preferred_recipe" />
            </div>


            <div class="mb-3 input-group-lg">
              <label for="" class="form-label headingFont fw-bold h5">Neutered:</label>
              <div class="radio-inputs bodyFont mt-2">
                <label class="radio">
                  <input checked name="neutered" type="radio" :value="true" id="n_yes" v-model="form.neutered" />
                  <span class="name">Yes</span>
                </label>
                <label class="radio">
                  <input name="neutered" type="radio" :value="false" id="n_no" v-model="form.neutered" />
                  <span class="name">No</span>
                </label>
              </div>
            </div>

          </div>

          <div class="form-actions d-flex justify-content-center">
            <Button class=" bodyFont d-inline mx-2" color="secondary" type="button" @click="resetForm" label="Reset"
              :disabled="petStore.loading">
            </Button>
            <Button class="bodyFont d-inline mx-2" :label="petStore.loading ? 'Creating...' : 'Add Pet'" type="submit"
              :disabled="petStore.loading || !form.name || !form.kind">
              <span v-if="petStore.loading" class="spinner"></span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style>
/* --- Pet Breed Selection Cards --- */
.pet-title {
  text-shadow: 1px 5px 5px black;
}

.dog-breed-card {
  box-sizing: border-box;
  width: 100%;
  max-width: 600px;
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
  margin: 0 auto;
}

.cat-breed-card {
  box-sizing: border-box;
  width: 100%;
  max-width: 600px;
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
  margin: 0 auto;
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
  border: 5px solid var(--bs-primary) !important;
  box-shadow: 0 0 30px var(--bs-primary, 0.7) !important;
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


/* --- Custom Radio Buttons for Gender --- */
.radio-inputs {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  border-radius: 1rem;
  background: #f0f0f0;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1), -5px -5px 15px rgba(255, 255, 255, 0.9);
  padding: 0.5rem;
  width: 300px;
  gap: 0.5rem;
}

.radio-inputs .radio {
  flex: 1 1 auto;
  text-align: center;
}

.radio-inputs .radio input {
  display: none;
}

.radio-inputs .radio .name {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 0.7rem;
  padding: 0.7rem 0;
  color: #2d3748;
  font-weight: 500;
  background: #e9e9e9;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
}

.radio-inputs .radio input:checked+.name {
  background: var(--bs-primary);
  color: white;
  font-weight: 600;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2), 3px 3px 8px rgba(var(--bs-primary-rgb), 0.3);
  transform: translateY(1px);
}

.radio-inputs .radio:hover .name {
  transform: translateY(-1px);
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.8);
}

/* Animation */
.radio-inputs .radio input:checked+.name {
  animation: select 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Particles */
.radio-inputs .radio .name::before,
.radio-inputs .radio .name::after {
  content: "";
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
}

.radio-inputs .radio input:checked+.name::before,
.radio-inputs .radio input:checked+.name::after {
  animation: particles 0.8s ease-out forwards;
}

.radio-inputs .radio .name::before {
  background: #60a5fa;
  box-shadow: 0 0 6px #60a5fa;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
}

.radio-inputs .radio .name::after {
  background: #93c5fd;
  box-shadow: 0 0 8px #93c5fd;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
}

/* Sparkles */
.radio-inputs .radio .name::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%),
      rgba(59, 130, 246, 0.3) 0%,
      transparent 50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.radio-inputs .radio input:checked+.name::after {
  opacity: 1;
  animation: sparkle-bg 1s ease-out forwards;
}

/* Multiple particles */
.radio-inputs .radio input:checked+.name {
  overflow: visible;
}

.radio-inputs .radio input:checked+.name::before {
  box-shadow:
    0 0 6px #60a5fa,
    10px -10px 0 #60a5fa,
    -10px -10px 0 #60a5fa;
  animation: multi-particles-top 0.8s ease-out forwards;
}

.radio-inputs .radio input:checked+.name::after {
  box-shadow:
    0 0 8px #93c5fd,
    10px 10px 0 #93c5fd,
    -10px 10px 0 #93c5fd;
  animation: multi-particles-bottom 0.8s ease-out forwards;
}

@keyframes select {
  0% {
    transform: scale(0.95) translateY(2px);
  }

  50% {
    transform: scale(1.05) translateY(-1px);
  }

  100% {
    transform: scale(1) translateY(2px);
  }
}

@keyframes multi-particles-top {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }

  40% {
    opacity: 0.8;
  }

  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px) scale(0);
    box-shadow:
      0 0 6px transparent,
      20px -20px 0 transparent,
      -20px -20px 0 transparent;
  }
}

@keyframes multi-particles-bottom {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }

  40% {
    opacity: 0.8;
  }

  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(20px) scale(0);
    box-shadow:
      0 0 8px transparent,
      20px 20px 0 transparent,
      -20px 20px 0 transparent;
  }
}

@keyframes sparkle-bg {
  0% {
    opacity: 0;
    transform: scale(0.2);
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: scale(2);
  }
}

/* Ripple effect */
.radio-inputs .radio .name::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%),
      rgba(255, 255, 255, 0.5) 0%,
      transparent 50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.radio-inputs .radio input:checked+.name::before {
  animation: ripple 0.8s ease-out;
}

@keyframes ripple {
  0% {
    opacity: 1;
    transform: scale(0.2);
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 0;
    transform: scale(2.5);
  }
}

/* Glowing border */
.radio-inputs .radio input:checked+.name {
  position: relative;
}

.radio-inputs .radio input:checked+.name::after {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(45deg,
      rgba(--bs-primary, 0.5),
      rgba(--bs-primary, 0.5));
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: border-glow 1.5s ease-in-out infinite alternate;
}

@keyframes border-glow {
  0% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}

.image-preview-container {
  text-align: center;
  padding: 1rem;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  background: #f8f9fa;
}

/* --- Image Preview --- */
.preview-image {
  width: 150px;
  height: 150px;
  border: 2px solid #e0e0e0;
}
</style>