<script setup>
import MealPlanCards from '@/components/PetViewComponents/MealPlanCard.vue';
import ImageUploadModal from '@/components/ImageUploadModal.vue';
import { usePetStore } from '@/stores/petStore';
import { useAuthStore } from '@/stores/authStore';
//import { storeToRefs } from 'pinia';
import { onMounted, ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { usePetInfoApi } from '@/composables/usePetInfoApi';
import BreedSelect from '@/components/molecules/create-edit-pet/BreedSelect.vue';
import MealPlanSelect from '@/components/molecules/create-edit-pet/MealPlanSelect.vue';
import { usePetNutritionStore } from '@/stores/petNutritionStore';
import Button from '@/components/atoms/button.vue';
import { useToastStore } from '@/stores/toastStore';


const petStore = usePetStore();
const authStore = useAuthStore();
const nutritionStore = usePetNutritionStore();
const route = useRoute(); // get route params - retrieve info from state
const router = useRouter(); // naivgate to next page
const toastStore = useToastStore();
const showSuccess = ref(false);
const currentPet = ref(petStore.getPetById(route.query.id))
const recipes = ref(null);

// initial form data
const petKind = ref(currentPet.value.kind); // default value on load
const { breedNames, error: breedError, isFetching: isFetchingBreeds } = usePetInfoApi(petKind);

// dynamically update breed list
const breedNameList = computed(() => {
    return isFetchingBreeds.value ? [] : breedNames.value;
})
// Form data
const form = ref({
    name: currentPet.value.name,
    kind: currentPet.value.kind,
    breed: currentPet.value.breed,
    gender: currentPet.value.gender,
    birthdate: currentPet.value.birthdate,
    weight_kg: currentPet.value.weight_kg,
    allergies: currentPet.value.allergies,
    neutered: currentPet.value.neutered,
    preferred_recipe: currentPet.value.preferred_recipe
})

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
        alert('Please fill in required fields')
        return
    }

    const result = await petStore.updatePet(route.query.id, { ...form.value, photo_url: null })

    if (result.success) {

        // If image was selected, upload it
        if (imageFile.value) {
            const imageResult = await petStore.uploadPetImage(authStore.userId, route.query.id, imageFile.value);
            if (!imageResult.success) {
                console.error('Failed to upload image:', imageResult.error);
            }
        }

        showSuccess.value = true;
        resetForm();
        toastStore.showToast("Pet has been updated!");
        router.push({
            path: '/pet'
        });

        // Hide success message after 3 seconds
        setTimeout(() => {
            showSuccess.value = false
        }, 3000)
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
        neutered: null,
        allergies: ''
    }
    if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value);
    }
    removeImage();
    petStore.clearError();
    showSuccess.value = false;
}

const selectPetKind = (kind) => {
    petKind.value = kind;
    form.value.kind = kind;
}

onMounted(async () => {
    const res = await nutritionStore.fetchRecipes(authStore.userId);
    if (res.success) {
        recipes.value = res.data;
    }
})

</script>

<template>
    <div class="container-fluid">
        <form @submit.prevent="handleSubmit" class="pet-form">
            <div class="pet-selector mt-4 mb-5">
                <div class="row d-flex justify-content-evenly">
                    <div class="col-lg-8">
                        <h1 class="headingFont display-3 text-start fw-semibold">Edit Your Pet</h1>
                    </div>
                </div>
                <div class="row justify-content-center mt-3 mb-3">
                    <div class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
                        <div @click="selectPetKind('dog')" class="dog-breed-card"
                            :class="{ 'selected-pet': form.kind === 'dog', 'dimmed-pet': form.kind === 'cat' }"
                            id="dog-breed-card">
                            <p class="pet-title brandFont text-light display-1">Dog</p>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
                        <div @click="selectPetKind('cat')" class="cat-breed-card"
                            :class="{ 'selected-pet': form.kind === 'cat', 'dimmed-pet': form.kind === 'dog' }"
                            id="cat-breed-card">
                            <p class="pet-title brandFont text-light display-1">Cat</p>
                        </div>
                    </div>
                </div>
            </div>


            <div v-if="form.kind == ''" class="text-center mb-3">
                <h3 class="headingFont warning fw-semibold">Please select a species.</h3>
            </div>


            <div class="input-forms container-fluid">
                <div class="row d-flex justify-content-center">
                    <div class="col-lg-8">
                        <div class="mb-3 input-group-lg">
                            <label for="" class="form-label headingFont fw-bold h5">Upload Pet Photo</label>
                            <input id="pet-photo" type="file" accept="image/*" @change="handleImageSelect"
                                class="form-control bodyFont" />
                        </div>
                        <div class="row container mb-3">
                            <div v-if="currentPet.photo_url"
                                class="image-preview-container mt-2 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <h6 class="preview-title danger headingFont fw-semibold">Previous Photo</h6>
                                <div class="position-relative d-inline-block">
                                    <img :src="currentPet.photo_url" alt="Preview" class="preview-image" />
                                </div>
                            </div>
                            <!-- Image Preview - Same size as avatar -->
                            <div v-if="imagePreview"
                                class="image-preview-container mt-2 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <h6 class="preview-title primary headingFont fw-semibold">New Photo</h6>
                                <div class="position-relative d-inline-block">
                                    <img :src="imagePreview" alt="Preview" class="preview-image" />
                                    <button type="button" @click="removeImage"
                                        class="btn btn-sm btn-danger position-absolute top-0 end-0 remove-btn">
                                        ×
                                    </button>
                                </div>
                                <p class="text-muted small mt-1">
                                    {{ imageFile?.name }} ({{ formatFileSize(imageFile?.size) }})
                                </p>
                            </div>
                        </div>


                        <div class="mb-3 input-group-lg">
                            <label for="" class="form-label headingFont fw-bold h5">Pet Name</label>
                            <input type="text" name="" id="" class="form-control bodyFont" :placeholder="form.name"
                                aria-describedby="helpId" v-model="form.name" />
                        </div>

                        <div class="mb-3 input-group-lg">
                            <label for="" class="form-label headingFont fw-bold h5">Gender:</label>
                            <div class="gender-radio radio-inputs bodyFont mt-2">
                                <label class="radio">
                                    <input name="gender" type="radio" value="male" id="male" v-model="form.gender" />
                                    <span class="name">Male</span>
                                </label>
                                <label class="radio">
                                    <input name="gender" type="radio" value="female" id="female"
                                        v-model="form.gender" />
                                    <span class="name">Female</span>
                                </label>
                                <label class="radio">
                                    <input name="gender" type="radio" value="unknown" id="unknown"
                                        v-model="form.gender" />
                                    <span class="name">Unknown</span>
                                </label>
                            </div>
                        </div>

                        <div class="mb-3 input-group-lg">
                            <label for="" class="form-label headingFont fw-bold h5">Birthday</label>
                            <input type="date" name="" id="" class="form-control bodyFont" :placeholder="form.birthdate"
                                aria-describedby="helpId" v-model="form.birthdate" />
                        </div>

                        <div class="mb-3">
                            <label class="form-label headingFont fw-bold h5">Breed</label>
                            <BreedSelect :defaultLabel="form.breed" :breedOptions="breedNameList" :isSearchable="true"
                                v-model="form.breed" />
                        </div>

                        <div class="mb-3 input-group-lg">
                            <label for="" class="form-label headingFont fw-bold h5">Weight (kg)</label>
                            <input type="number" name="" id="" class="form-control bodyFont"
                                :placeholder="form.weight_kg" aria-describedby="helpId" v-model="form.weight_kg" />
                        </div>

                        <div class="mb-3 input-group-lg">
                            <label for="" class="form-label headingFont fw-bold h5">Allergies (Optional)</label>
                            <input type="text" name="" id="" class="form-control bodyFont" :placeholder="form.allergies"
                                aria-describedby="helpId" v-model="form.allergies" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label headingFont fw-bold h5">Selected Meal</label>
                            <MealPlanSelect defaultLabel="Select Meal Plan..." :mealOptions="recipes "
                                :isSearchable="true" v-model="form.preferred_recipe" />
                        </div>

                        <div class="mb-3 input-group-lg">
                            <label for="" class="form-label headingFont fw-bold h5">Neutered:</label>
                            <div class="neutered-radio radio-inputs bodyFont mt-2">
                                <label class="radio">
                                    <input name="neutered" type="radio" :value="true" id="n_yes"
                                        v-model="form.neutered" />
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
                        <Button class=" bodyFont d-inline mx-2" color="secondary" type="button" @click="resetForm"
                            label="Reset" :disabled="petStore.loading">
                        </Button>
                        <Button class="bodyFont d-inline mx-2" :label="petStore.loading ? 'Creating...' : 'Edit Pet'"
                            type="submit" :disabled="petStore.loading || !form.name || !form.kind">
                            <span v-if="petStore.loading" class="spinner"></span>
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<style>
.pet-title {
    text-shadow: 1px 5px 5px black;
}

.dog-breed-card {
    box-sizing: border-box;
    width: 100%;
    max-width: 600px;
    height: 300px;
    background-image: url("../assets/Pixel Art/dog (1).png");
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
    background-image: url("../assets/Pixel Art/cat (5).png");
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


/* Upload Photo */
.button-upload-photo {
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
    padding-block: 0.5rem;
    padding-inline: 1.25rem;
    background-color: rgb(0 107 179);
    border-radius: 9999px;
    cursor: pointer;
    color: #ffff;
    font-weight: bold;
    border: 3px solid #ffffff4d;
    outline: none;
    overflow: hidden;
    font-size: 18px;
}

.button-upload-photo:hover {
    transform: scale(1.05);
    border-color: #fff9;
}

.button-upload-photo:hover .icon {
    transform: translate(4px);
}

.button-upload-photo:hover::before {
    animation: shine 1.5s ease-out infinite;
}

.button-upload-photo::before {
    content: "";
    position: absolute;
    width: 100px;
    height: 100%;
    background-image: linear-gradient(120deg,
            rgba(255, 255, 255, 0) 30%,
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0) 70%);
    top: 0;
    left: -100px;
    opacity: 0.6;
}

@keyframes shine {
    0% {
        left: -100px;
    }

    60% {
        left: 100%;
    }

    to {
        left: 100%;
    }
}

/* Radio Gender */
.radio-inputs {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 1rem;
    background: linear-gradient(145deg, #e6e6e6, #ffffff);
    box-sizing: border-box;
    box-shadow:
        5px 5px 15px rgba(0, 0, 0, 0.15),
        -5px -5px 15px rgba(255, 255, 255, 0.8);
    padding: 0.5rem;
    width: 300px;
    font-size: 14px;
    gap: 0.5rem;
}

.radio-inputs .radio {
    flex: 1 1 auto;
    text-align: center;
    position: relative;
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
    border: none;
    padding: 0.7rem 0;
    color: #2d3748;
    font-weight: 500;
    font-family: inherit;
    background: linear-gradient(145deg, #ffffff, #e6e6e6);
    box-shadow:
        3px 3px 6px rgba(0, 0, 0, 0.1),
        -3px -3px 6px rgba(255, 255, 255, 0.7);
    transition: all 0.2s ease;
    overflow: hidden;
}

.radio-inputs .radio input:checked+.name {
    background: linear-gradient(145deg, #407dff, #2563eb);
    color: white;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    box-shadow:
        inset 2px 2px 5px rgba(0, 0, 0, 0.2),
        inset -2px -2px 5px rgba(255, 255, 255, 0.1),
        3px 3px 8px rgba(59, 130, 246, 0.3);
    transform: translateY(2px);
}

/* Hover effect */
.radio-inputs .radio:hover .name {
    background: linear-gradient(145deg, #f0f0f0, #ffffff);
    transform: translateY(-1px);
    box-shadow:
        4px 4px 8px rgba(0, 0, 0, 0.1),
        -4px -4px 8px rgba(255, 255, 255, 0.8);
}

.radio-inputs .radio:hover input:checked+.name {
    transform: translateY(1px);
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
            rgba(59, 130, 246, 0.5),
            rgba(37, 99, 235, 0.5));
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

/* Add Pet */
.button-add-pet {
    position: relative;
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
    padding-block: 0.5rem;
    padding-inline: 1.25rem;
    background-color: rgb(0 107 179);
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #ffff;
    gap: 10px;
    font-weight: bold;
    border: 3px solid #ffffff4d;
    outline: none;
    overflow: hidden;
    font-size: 18px;
}

.button-add-pet:hover {
    transform: scale(1.05);
    border-color: #fff9;
}

.button-add-pet:hover .icon {
    transform: translate(4px);
}

.button-add-pet:hover::before {
    animation: shine 1.5s ease-out infinite;
}

.button-add-pet::before {
    content: "";
    position: absolute;
    width: 100px;
    height: 100%;
    background-image: linear-gradient(120deg,
            rgba(255, 255, 255, 0) 30%,
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0) 70%);
    top: 0;
    left: -100px;
    opacity: 0.6;
}

.button-add-pet:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
    opacity: 0.6;
}

@keyframes shine {
    0% {
        left: -100px;
    }

    60% {
        left: 100%;
    }

    to {
        left: 100%;
    }
}

/* Recommend Meal */
.button-recommend {
    position: relative;
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
    padding-block: 0.5rem;
    padding-inline: 1.25rem;
    background-color: rgb(78, 78, 78);
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #ffff;
    gap: 10px;
    font-weight: bold;
    border: 3px solid #ffffff4d;
    outline: none;
    overflow: hidden;
    font-size: 18px;
}

.button-recommend:hover {
    transform: scale(1.05);
    border-color: #fff9;
}

.button-recommend:hover .icon {
    transform: translate(4px);
}

.button-recommend:hover::before {
    animation: shine 1.5s ease-out infinite;
}

.button-recommend::before {
    content: "";
    position: absolute;
    width: 100px;
    height: 100%;
    background-image: linear-gradient(120deg,
            rgba(255, 255, 255, 0) 30%,
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0) 70%);
    top: 0;
    left: -100px;
    opacity: 0.6;
}

@keyframes shine {
    0% {
        left: -100px;
    }

    60% {
        left: 100%;
    }

    to {
        left: 100%;
    }
}

/* From Uiverse.io by mrhyddenn */
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

.image-preview-container {
    text-align: center;
    padding: 1rem;
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    background: #f8f9fa;
}

.preview-image {
    width: 200px;
    height: 200px;
    border-radius: 8px;
    object-fit: cover;
    border: 2px solid #e0e0e0;
}
</style>