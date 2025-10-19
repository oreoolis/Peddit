<script setup>
import MealPlanCards from '@/components/PetViewComponents/MealPlanCard.vue';
import ImageUploadModal from '@/components/ImageUploadModal.vue';
import { usePetStore } from '@/stores/petStore';
import { useAuthStore } from '@/stores/authStore';
//import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const petStore = usePetStore();
const authStore = useAuthStore();
const router = useRouter(); // push to next page

const showSuccess = ref(false);

// Form data
const form = ref({
  name: '',
  kind: '',
  breed: '',
  gender: 'unknown',
  birthdate: '',
  weight_kg: null,
  allergies: null,
  neutered: null
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

  const result = await petStore.createPet(authStore.userId, { ...form.value, photo_url: null })

  if (result.success) {

    // If image was selected, upload it
    if (imageFile.value) {
      const imageResult = await petStore.uploadPetImage(authStore.userId, result.data.id, imageFile.value);
      if (!imageResult.success) {
        console.error('Failed to upload image:', imageResult.error);
      }
    }

    showSuccess.value = true;
    resetForm();
    router.push({
            path: '/pet',
            state: { showOpSuccess: true, message: form.value.name + "has been created!"}
        });


    // Hide success message after 3 seconds
    setTimeout(() => {
      showSuccess.value = false;
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

const selectCat = () => {
  form.value.kind = "cat";
  showToast("You have chosen Cat!")
}

const selectDog = () => {
  form.value.kind = "dog";
  showToast("You have chosen Dog!");
}

const showToast = (text) => {
  const toastElement = document.getElementById('liveToast');
  if (!toastElement) { return }
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastElement, { autohide: true, delay: 3000 });
  if (document.getElementById("message")) {
    document.getElementById("message").innerText = text;
    document.getElementById("message").style.fontWeight = "bold";
  }
  toastBootstrap.show();
}
const showUploadModal = ref(false);

const handleImageUpload = async (file) => {
  const result = await petStore.uploadProfileImage(file);
};

const openUploadModal = () => {
  showUploadModal.value = true;
};


</script>

<template>
  <div class="container-fluid">
    <!-- toast message: to change to vue component -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-success">
          <strong class="me-auto text-light">Peddit</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body" id="message">
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="pet-form">
      <div class="pet-selector mt-4 mb-5">
        <div class="row d-flex justify-content-evenly">
          <div class="col-lg-8">
            <h1 class="headingFont display-3 text-start fw-semibold">Create Your Pet</h1>
          </div>
        </div>
        <div class="row justify-content-center mt-3 mb-3">
          <div class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
            <div @click="selectDog" class="dog-breed-card" id="dog-breed-card">
              <p class="pet-title brandFont text-light display-1">Dog</p>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
            <div @click="selectCat" class="cat-breed-card" id="cat-breed-card">
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
              <input id="pet-photo" type="file" accept="image/*" @change="handleImageSelect" class="form-control bodyFont" />
            </div>
            <!-- <div class="text-center">
              <button class="button-upload-photo bodyFont" :href="href" role="link" @click="openUploadModal"
                type="button">
                Upload Pet Photo
              </button>
            </div> -->
            <!-- Image Preview - Same size as avatar -->
            <div v-if="imagePreview" class="image-preview-container mt-2">
              <h6 class="preview-title">Preview</h6>
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

            <div class="mb-3 input-group-lg">
              <label for="" class="form-label headingFont fw-bold h5">Pet Name</label>
              <input type="text" name="" id="" class="form-control bodyFont" placeholder="Frosty"
                aria-describedby="helpId" v-model="form.name" />
            </div>

            <div class="mb-3 input-group-lg">
              <label for="" class="form-label headingFont fw-bold h5">Gender</label>
              <div class="radio-inputs bodyFont mt-2">
                <label class="radio">
                  <input checked name="gender" type="radio" value="male" id="male" v-model="form.gender" />
                  <span class="name">Male</span>
                </label>
                <label class="radio">
                  <input name="gender" type="radio" value="female" id="female" v-model="form.gender" />
                  <span class="name">Female</span>
                </label>
                <label class="radio">
                  <input name="gender" type="radio" value="unknown" id="unknown" v-model="form.gender" />
                  <span class="name">Unknown</span>
                </label>
              </div>
            </div>

            <div class="mb-3 input-group-lg">
              <label for="" class="form-label headingFont fw-bold h5">Birthday</label>
              <input type="date" name="" id="" class="form-control bodyFont" placeholder="" aria-describedby="helpId"
                v-model="form.birthdate" />
            </div>

            <div class="mb-3 input-group-lg">
              <label for="" class="form-label headingFont fw-bold h5">Breed</label>
              <input type="text" name="" id="" class="form-control bodyFont" placeholder="e.g. Golden Retriever"
                aria-describedby="helpId" v-model="form.breed" />
            </div>

            <div class="mb-3 input-group-lg">
              <label for="" class="form-label headingFont fw-bold h5">Weight</label>
              <input type="number" name="" id="" class="form-control bodyFont" placeholder="" aria-describedby="helpId"
                v-model="form.weight_kg" />
            </div>

            <div class="mb-3 input-group-lg">
              <label for="" class="form-label headingFont fw-bold h5">Allergies (Optional)</label>
              <input type="text" name="" id="" class="form-control bodyFont" placeholder="" aria-describedby="helpId"
                v-model="form.allergies" />
            </div>

            <div class="mb-3 input-group-lg">
              <label for="" class="form-label headingFont fw-bold h5">Neutered:</label>
              <div class="radio-inputs bodyFont mt-2">
                <label class="radio">
                  <input checked name="neutered" type="radio" value="Yes" id="n_yes" v-model="form.neutered" />
                  <span class="name">Yes</span>
                </label>
                <label class="radio">
                  <input name="neutered" type="radio" value="No" id="n_no" v-model="form.neutered" />
                  <span class="name">No</span>
                </label>
                <label class="radio">
                  <input name="neutered" type="radio" value="unknown" id="n_unknown" v-model="form.neutered" />
                  <span class="name">Unknown</span>
                </label>
              </div>
            </div>

          </div>


          <!-- size: btn-lg -->
          <!-- <div class="form-actions text-center">
            <button type="button" @click="resetForm" class="btn btn-secondary" :disabled="petStore.loading">
              Reset
            </button>
            <button type="submit" class="btn btn-primary" :disabled="petStore.loading || !form.name || !form.kind">
              <span v-if="petStore.loading" class="spinner"></span>
              {{ petStore.loading ? 'Creating...' : 'Add Pet' }}
            </button>
          </div> -->

          <div class="form-actions d-flex justify-content-center">
            <button class="button-recommend bodyFont d-inline" type="button" @click="resetForm"
              :disabled="petStore.loading">
              Reset
            </button>
            <button class="button-add-pet bodyFont d-inline" type="submit"
              :disabled="petStore.loading || !form.name || !form.kind">
              <span v-if="petStore.loading" class="spinner"></span>
              {{ petStore.loading ? 'Creating...' : 'Add Pet' }}
            </button>
          </div>
          <!-- <button type="button" class="btn btn-lg bg-primary h-100 headingFont text-light fw-bold shadow"
            :disabled="petStore.loading || !form.name || !form.kind">
            <span v-if="petStore.loading" class="spinner">
              {{ petStore.loading ? 'Creating Pet...' : 'Add Pet' }}
            </span>
          </button> -->
        </div>
      </div>
      <div v-if="showSuccess" class='success-msg'>
        Pet created successfully.
      </div>
      <div v-if="petStore.error" class='error-msg'>
        {{ petStore.error }}
      </div>
    </form>
  </div>
  <!-- <ImageUploadModal v-model:show="showUploadModal" :current-avatar="profile?.avatar_url" @uploaded="handleImageUpload"
    title="Upload Pet Photo" @error="console.error" /> -->
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