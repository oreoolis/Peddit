<script setup>
import { ref, computed, watch } from 'vue';
import BaseIcon from '../../atomic/BaseIcon.vue';
import BreedCard from '../../atoms/health/BreedCard.vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  petKind: {
    type: String,
    required: true
  },
  breeds: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['update:petKind', 'breed-click']);

const localPetKind = computed({
  get: () => props.petKind,
  set: (value) => emit('update:petKind', value)
});

const searchQuery = ref('');

const filteredBreeds = computed(() => {
  if (!searchQuery.value) return props.breeds;
  
  return props.breeds.filter(breed =>
    breed.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handleBreedClick = (breedName) => {
  emit('breed-click', breedName);
};

watch(() => props.petKind, () => {
  searchQuery.value = '';
});
</script>

<template>
  <Transition name="slide-fade">
    <div v-if="show" class="breed-selector-panel">
      <div class="panel-header bg-primary text-white">
        <h3 class="panel-title">
          <BaseIcon name="list-ul" size="lg" class="me-2" variant="light" />
          Browse Pet Breeds
        </h3>
        <p class="panel-description">Find a pet breed!</p>
      </div>

      <div class="panel-body">
        <!-- Pet Kind Selector -->
        <div class="kind-selector mb-4">
          <label class="form-label fw-semibold">Select Pet Type:</label>
          <div class="btn-group w-100" role="group">
            <input 
              type="radio" 
              class="btn-check" 
              name="petKind" 
              id="kindCat" 
              value="cat"
              v-model="localPetKind"
            >
            <label class="btn btn-outline-primary" for="kindCat">
              <BaseIcon name="heart-fill" size="sm" class="me-2" variant="danger"/>
              Cat
            </label>

            <input 
              type="radio" 
              class="btn-check" 
              name="petKind" 
              id="kindDog" 
              value="dog"
              v-model="localPetKind"
            >
            <label class="btn btn-outline-primary" for="kindDog">
              <BaseIcon name="heart-fill" size="sm" class="me-2" variant="danger"/>
              Dog
            </label>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="breed-list-loading">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading breeds...</span>
          </div>
          <p class="mt-3 text-muted">Loading {{ localPetKind }} breeds...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
          <BaseIcon name="exclamation-triangle-fill" size="sm" class="me-2" />
          <strong>Error:</strong> {{ error }}
        </div>

        <!-- Breeds List -->
        <div v-else-if="breeds && breeds.length > 0" class="breed-list-container">
          <input 
            v-model="searchQuery"
            placeholder="Search for a breed..."
            type="text"
            class="form-control mb-3"
          >
          <div class="breed-list-header">
            <h5 class="mb-0">
              {{ filteredBreeds.length }} {{ localPetKind.charAt(0).toUpperCase() + localPetKind.slice(1) }} Breeds
            </h5>
          </div>
          <div class="breed-grid">
            <BreedCard 
              v-for="breed in filteredBreeds" 
              :key="breed"
              :breed-name="breed"
              @click="handleBreedClick"
            />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.breed-selector-panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.panel-header {
  padding: 2rem;
  text-align: center;
}

.panel-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-description {
  margin: 0;
  opacity: 0.9;
}

.panel-body {
  padding: 2rem;
}

.kind-selector .btn-group {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.kind-selector .btn {
  padding: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.breed-list-loading {
  text-align: center;
  padding: 3rem;
}

.breed-list-container {
  max-height: 600px;
  overflow-y: auto;
}

.breed-list-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.breed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

@media (max-width: 768px) {
  .panel-body {
    padding: 1.5rem;
  }
  
  .breed-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media (max-width: 576px) {
  .breed-grid {
    grid-template-columns: 1fr;
  }
}
</style>
