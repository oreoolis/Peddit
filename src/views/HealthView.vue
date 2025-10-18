<script setup>
import { onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { usePetStore } from '@/stores/petStore';
import { useAuthStore } from '@/stores/authStore';
import PetHealthAccordionItem from '@/components/atomic/PetHealthAccordionItem.vue';

const router = useRouter();
const petStore = usePetStore();
const authStore = useAuthStore();

const { pets } = storeToRefs(petStore);
const { userId } = storeToRefs(authStore);

const handleFindVet = (payload) => {
  console.log('Finding vet for:', payload);
  // Navigate to map/vet finder page
  // router.push({ name: 'vet-finder', query: { petId: payload.petId } });
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

import { ref } from 'vue'
import { usePetInfoApi } from '@/composables/usePetInfoApi';

// Reactive state for the selected pet kind
const selectedPetKind = ref('cat')

// Use our composable. It will automatically re-fetch when `selectedPetKind` changes.
const { breedNames, error, isFetching } = usePetInfoApi(selectedPetKind)

</script>

<template>
  <div>
    <h1>Pet Breed Selector</h1>

    <!-- 1. Pet Kind Selector -->
    <div>
      <label for="pet-kind">Choose a pet kind:</label>
      <select id="pet-kind" v-model="selectedPetKind">
        <option value="cat">Cat</option>
        <option value="dog">Dog</option>
      </select>
    </div>

    <hr />

    <!-- 2. Display Loading State -->
    <div v-if="isFetching">
      <p>Loading breeds...</p>
    </div>

    <!-- 3. Display Error State -->
    <div v-else-if="error">
      <p style="color: red;">Error: {{ error.message }}</p>
    </div>

    <!-- 4. Display the List of Breeds -->
    <div v-else-if="breedNames">
      <h2>List of {{ selectedPetKind.charAt(0).toUpperCase() + selectedPetKind.slice(1) }} Breeds</h2>
      <ul>
        <li v-for="name in breedNames" :key="name">
          {{ name }}
        </li>
      </ul>
    </div>
  </div>

  <div class="health-dashboard">
    <div class="container py-4">
      <!-- Header Section -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="dashboard-header">
            <h1 class="dashboard-title">
              <i class="bi bi-heart-pulse-fill text-danger me-2"></i>
              Health Dashboard
            </h1>
            <p class="dashboard-subtitle text-muted">
              Monitor and manage your pets' health and wellbeing
            </p>
          </div>
        </div>
      </div>

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
  padding: 2rem 0;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-subtitle {
  font-size: 1.1rem;
  margin: 0;
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
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .dashboard-subtitle {
    font-size: 1rem;
  }

  .empty-state {
    padding: 3rem 1.5rem;
  }

  .empty-icon {
    font-size: 4rem;
  }

  .empty-title {
    font-size: 1.5rem;
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

  .stat-label {
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .dashboard-title {
    font-size: 1.75rem;
  }

  .stat-box {
    flex-direction: column;
    text-align: center;
    padding: 1rem 0.75rem;
  }

  .stat-icon {
    font-size: 1.75rem;
  }

  .stat-number {
    font-size: 1.25rem;
  }
}
</style>
