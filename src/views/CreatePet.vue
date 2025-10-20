<script setup>
import MealPlanCards from '@/components/PetViewComponents/MealPlanCard.vue';
import ImageUploadModal from '@/components/ImageUploadModal.vue';
import { usePetStore } from '@/stores/petStore';
import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';
import searchBar from '@/components/atoms/searchBar.vue';

const petStore = usePetStore();
const authStore = useAuthStore();

const showSuccess = ref(false);

// Form data
const form = ref({
  name: '',
  kind: '',
  breed: '',
  gender: 'unknown',
  birthdate: '',
  weight_kg: null,
  neutered: null,
  allergies: ''
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
    setTimeout(() => {
      showSuccess.value = false;
    }, 3000);
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
  };
  removeImage();
  petStore.clearError();
  showSuccess.value = false;
}

const selectPetKind = (kind) => {
  form.value.kind = kind;
  showToast(`You have chosen ${kind.charAt(0).toUpperCase() + kind.slice(1)}!`);
}

const showToast = (text) => {
  const toastElement = document.getElementById('liveToast');
  if (!toastElement) return;
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastElement);
  if (document.getElementById("message")) {
    document.getElementById("message").innerText = text;
  }
  toastBootstrap.show();
}
</script>

<template>
  <div class="container-fluid">
    <!-- Toast Message -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-primary text-light">
          <strong class="me-auto">Peddit</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body" id="message"></div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="pet-form">
      <!-- Pet Species Selector -->
      <div class="pet-selector mt-4 mb-5">
        <h1 class="headingFont display-3 text-center fw-semibold mb-4">Create Your Pet</h1>
        <div class="row justify-content-center g-4">
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
      </div>

      <div v-if="!form.kind" class="text-center mb-4">
        <h3 class="headingFont text-warning fw-semibold">Please select a species.</h3>
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
                <searchBar :model-value="imageFile ? imageFile.name : ''" placeholder="Click to select an image..." readonly>
                  <template #icon><i class="bi bi-upload"></i></template>
                </searchBar>
              </label>
            </div>

            <!-- Image Preview -->
            <div v-if="imagePreview" class="text-center p-3 border border-2 border-dashed rounded bg-light mb-3">
              <h6 class="preview-title">Preview</h6>
              <div class="position-relative d-inline-block">
                <img :src="imagePreview" alt="Preview" class="preview-image rounded object-fit-cover" />
                <button type="button" @click="removeImage" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle">×</button>
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
                <label class="radio"><input checked name="radio" type="radio" value="male" v-model="form.gender" /><span class="name">Male</span></label>
                <label class="radio"><input name="radio" type="radio" value="female" v-model="form.gender" /><span class="name">Female</span></label>
                <label class="radio"><input name="radio" type="radio" value="unknown" v-model="form.gender" /><span class="name">Unknown</span></label>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label headingFont fw-bold h5">Birthday</label>
              <searchBar type="date" placeholder="Select Date" v-model="form.birthdate" />
            </div>
            <div class="mb-3">
              <label class="form-label headingFont fw-bold h5">Breed</label>
              <searchBar type="text" placeholder="e.g. Golden Retriever" v-model="form.breed" />
            </div>
            <div class="mb-3">
              <label class="form-label headingFont fw-bold h5">Weight</label>
              <searchBar type="number" placeholder="Weight in kg" v-model="form.weight_kg" />
            </div>
            <div class="mb-3">
              <label class="form-label headingFont fw-bold h5">Allergies (Optional)</label>
              <searchBar type="text" placeholder="e.g. Pollen, Dust" v-model="form.allergies" />
            </div>

            <!-- Form Actions -->
            <div class="form-actions text-center my-4">
              <button type="button" @click="resetForm" class="btn btn-secondary me-2" :disabled="petStore.loading">Reset</button>
              <button type="submit" class="btn btn-primary" :disabled="petStore.loading || !form.name || !form.kind">
                <span v-if="petStore.loading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                {{ petStore.loading ? 'Creating...' : 'Add Pet' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="showSuccess" class="alert alert-success text-center">Pet created successfully.</div>
      <div v-if="petStore.error" class="alert alert-danger text-center">{{ petStore.error }}</div>
    </form>
  </div>
</template>

<style>
/* --- Pet Breed Selection Cards --- */
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

/* Responsive heights for larger screens */
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

.radio-inputs .radio input:checked + .name {
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

/* --- Image Preview --- */
.preview-image {
  width: 150px;
  height: 150px;
  border: 2px solid #e0e0e0;
}
</style>