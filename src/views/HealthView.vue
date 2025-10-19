<script setup>
import { onMounted, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { usePetStore } from '@/stores/petStore';
import { useAuthStore } from '@/stores/authStore';
import { usePetInfoApi } from '@/composables/usePetInfoApi';
import PetHealthAccordionItem from '@/components/atomic/PetHealthAccordionItem.vue';

const router = useRouter();
const petStore = usePetStore();
const authStore = useAuthStore();

const { pets } = storeToRefs(petStore);
const { userId } = storeToRefs(authStore);

// Breed selector state
const selectedPetKind = ref('cat');
const showBreedSelector = ref(false);

// Use our composable for fetching breeds
const { breedNames, error: breedError, isFetching: isFetchingBreeds } = usePetInfoApi(selectedPetKind);

const handleFindVet = (payload) => {
  console.log('Finding vet for:', payload);
};

const toggleBreedSelector = () => {
  showBreedSelector.value = !showBreedSelector.value;
};

const healthyPetsCount = computed(() => {
  if (!pets.value) return 0;
  return pets.value.filter(pet => {
    const scale = pet.body_condition_scale;
    if (!scale) return false;
    return scale >= 4 && scale <= 6;
  }).length;
});

const needsAttentionCount = computed(() => {
  if (!pets.value) return 0;
  return pets.value.filter(pet => {
    const scale = pet.body_condition_scale;
    if (!scale) return true;
    return scale < 4 || scale > 6;
  }).length;
});

const neuteredCount = computed(() => {
  if (!pets.value) return 0;
  return pets.value.filter(pet => pet.neutered).length;
});

onMounted(async () => {
  if (userId.value) {
    await petStore.fetchPets(userId.value);
  }
});
</script>

<template>
  <div class="health-dashboard">
    <div class="container py-4">
      <!-- Header with Browse Breeds Button -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="dashboard-header">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
              <h1 class="dashboard-title mb-0">
                <i class="bi bi-heart-pulse-fill text-danger me-2"></i>
                Health Dashboard
              </h1>
              <button 
                class="btn btn-outline-primary"
                @click="toggleBreedSelector"
              >
                <i class="bi bi-search me-2"></i>
                {{ showBreedSelector ? 'Hide' : 'Browse' }} Breeds
              </button>
            </div>
            <p class="dashboard-subtitle text-muted">
              Monitor and manage your pets' health and wellbeing
            </p>
          </div>
        </div>
      </div>

      <!-- Breed Selector Panel -->
      <Transition name="slide-fade">
        <div v-if="showBreedSelector" class="row mb-4">
          <div class="col-12">
            <div class="breed-selector-panel">
              <div class="panel-header">
                <h3 class="panel-title">
                  <i class="bi bi-list-ul me-2"></i>
                  Browse Pet Breeds
                </h3>
                <p class="panel-description">
                  Explore different breeds to learn more
                </p>
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
                      v-model="selectedPetKind"
                    >
                    <label class="btn btn-outline-primary" for="kindCat">
                      <i class="bi bi-heart-fill me-2"></i>
                      Cat
                    </label>

                    <input 
                      type="radio" 
                      class="btn-check" 
                      name="petKind" 
                      id="kindDog" 
                      value="dog"
                      v-model="selectedPetKind"
                    >
                    <label class="btn btn-outline-primary" for="kindDog">
                      <i class="bi bi-heart-fill me-2"></i>
                      Dog
                    </label>
                  </div>
                </div>

                <!-- Loading State -->
                <div v-if="isFetchingBreeds" class="breed-list-loading">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading breeds...</span>
                  </div>
                  <p class="mt-3 text-muted">Loading {{ selectedPetKind }} breeds...</p>
                </div>

                <!-- Error State -->
                <div v-else-if="breedError" class="alert alert-danger" role="alert">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  <strong>Error:</strong> {{ breedError.message }}
                </div>

                <!-- Breeds List -->
                <div v-else-if="breedNames && breedNames.length > 0" class="breed-list-container">
                  <div class="breed-list-header">
                    <h5 class="mb-0">
                      {{ breedNames.length }} {{ selectedPetKind.charAt(0).toUpperCase() + selectedPetKind.slice(1) }} Breeds
                    </h5>
                  </div>
                  <div class="breed-grid">
                    <div 
                      v-for="breed in breedNames" 
                      :key="breed"
                      class="breed-card"
                    >
                      <i class="bi bi-paw-fill breed-icon"></i>
                      <span class="breed-name">{{ breed }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Empty State -->
      <div v-if="!pets || pets.length === 0" class="row">
        <div class="col-12">
          <div class="empty-state">
            <div class="empty-icon">
              <i class="bi bi-heart-pulse"></i>
            </div>
            <h3 class="empty-title">No Pets Found</h3>
            <p class="empty-description">
              Add your first pet to start tracking their health and wellness
            </p>
            <button class="btn btn-primary btn-lg mt-3" @click="router.push('/pet')">
              <i class="bi bi-plus-circle me-2"></i>
              Add Your First Pet
            </button>
          </div>
        </div>
      </div>

      <!-- Pet Health Cards Grid -->
      <div v-else class="row">
        <div class="col-12">
          <div class="pets-accordion">
            <PetHealthAccordionItem
              v-for="pet in pets"
              :key="pet.id"
              :pet="pet"
              :health-threshold="60"
              @find-vet="handleFindVet"
            />
          </div>
        </div>
      </div>

      <!-- Quick Stats Summary -->
      <div v-if="pets && pets.length > 0" class="row mt-4">
        <div class="col-12">
          <div class="quick-stats">
            <div class="row g-3">
              <div class="col-6 col-md-3">
                <div class="stat-box stat-box-primary">
                  <i class="bi bi-heart-fill stat-icon"></i>
                  <div class="stat-content">
                    <div class="stat-number">{{ pets.length }}</div>
                    <div class="stat-label">Total Pets</div>
                  </div>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="stat-box stat-box-success">
                  <i class="bi bi-shield-fill-check stat-icon"></i>
                  <div class="stat-content">
                    <div class="stat-number">{{ healthyPetsCount }}</div>
                    <div class="stat-label">Healthy</div>
                  </div>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="stat-box stat-box-warning">
                  <i class="bi bi-exclamation-triangle-fill stat-icon"></i>
                  <div class="stat-content">
                    <div class="stat-number">{{ needsAttentionCount }}</div>
                    <div class="stat-label">Needs Attention</div>
                  </div>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="stat-box stat-box-info">
                  <i class="bi bi-calendar-check stat-icon"></i>
                  <div class="stat-content">
                    <div class="stat-number">{{ neuteredCount }}</div>
                    <div class="stat-label">Neutered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.health-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 2rem;
}

.dashboard-header {
  text-align: center;
  padding: 2rem 0 1rem;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  display: inline-flex;
  align-items: center;
}

.dashboard-subtitle {
  font-size: 1.1rem;
  margin: 0;
}

/* Breed Selector Panel */
.breed-selector-panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.panel-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
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

/* Breed List */
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

.breed-card {
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.breed-card:hover {
  background: white;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.breed-icon {
  font-size: 1.5rem;
  color: #667eea;
  flex-shrink: 0;
}

.breed-name {
  font-weight: 500;
  color: #2d3748;
  flex: 1;
}

/* Slide Fade Transition */
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

/* Empty State */
.empty-state {
  background: white;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 5rem;
  color: #cbd5e0;
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.empty-description {
  font-size: 1.1rem;
  color: #718096;
  margin: 0;
}

/* Pets Accordion */
.pets-accordion {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Quick Stats */
.quick-stats {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-box {
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  height: 100%;
}

.stat-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.stat-box-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-box-success {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.stat-box-warning {
  background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
}

.stat-box-info {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.9;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-title {
    font-size: 1.75rem;
  }

  .breed-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .panel-body {
    padding: 1.5rem;
  }

  .empty-state {
    padding: 3rem 1.5rem;
  }

  .quick-stats {
    padding: 1.5rem;
  }

  .stat-box {
    padding: 1rem;
  }

  .stat-icon {
    font-size: 2rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .breed-grid {
    grid-template-columns: 1fr;
  }

  .stat-box {
    flex-direction: column;
    text-align: center;
    padding: 1rem 0.75rem;
  }
}
</style>
