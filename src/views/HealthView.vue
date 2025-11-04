<script setup>
import { onMounted, computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { usePetStore } from '@/stores/petStore';
import { useAuthStore } from '@/stores/authStore';
import { usePetInfoApi } from '@/composables/usePetInfoApi';
import { watchDebounced } from '@vueuse/core';

// Components
import BasePageHeader from '@/components/atoms/BasePageHeader.vue';
import BaseEmptyState from '@/components/atoms/BaseEmptyState.vue';
import BaseButton from '@/components/atomic/BaseButton.vue';
import BreedSelectorPanel from '@/components/molecules/health/BreedSelectorPanel.vue';
import QuickStatsGrid from '@/components/molecules/health/QuickStatsGrid.vue';
import PetHealthAccordionItem from '@/components/atomic/PetHealthAccordionItem.vue';

const router = useRouter();
const petStore = usePetStore();
const authStore = useAuthStore();

const { pets } = storeToRefs(petStore);
const { userId } = storeToRefs(authStore);

// Breed selector state
const selectedPetKind = ref('cat');
const showBreedSelector = ref(false);

// Use composable for fetching breeds
const { breedNames, error: breedError, isFetching: isFetchingBreeds } = usePetInfoApi(selectedPetKind);

// Computed stats
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

const statsData = computed(() => [
  { icon: 'heart-fill', value: pets.value?.length || 0, label: 'Total Pets', variant: 'primary' },
  { icon: 'shield-fill-check', value: healthyPetsCount.value, label: 'Healthy', variant: 'success' },
  { icon: 'exclamation-triangle-fill', value: needsAttentionCount.value, label: 'Needs Attention', variant: 'warning' },
  { icon: 'calendar-check', value: neuteredCount.value, label: 'Neutered', variant: 'info' }
]);

// Breed search
const breedQuery = ref('');
const filteredBreeds = ref([]);

watchDebounced([breedQuery, selectedPetKind, isFetchingBreeds], () => {
  if (isFetchingBreeds.value) return;
  
  if (!breedQuery.value) {
    filteredBreeds.value = breedNames.value;
    return;
  }
  
  filteredBreeds.value = breedNames.value.filter(breed =>
    breed.toLowerCase().includes(breedQuery.value.toLowerCase())
  );
}, { debounce: 300, immediate: true });

// Methods
const toggleBreedSelector = () => {
  showBreedSelector.value = !showBreedSelector.value;
};

const handleFindVet = (payload) => {
  router.push('/map');
  

};

const handleBreedClick = (breedName) => {
  
};

onMounted(async () => {
  if (userId.value) {
    await petStore.fetchPets(userId.value);
  }
});


</script>

<template>
  <div class="health-dashboard">
  <div>
  </div>
    <div class="container py-4 mx-auto">
      <!-- Header -->
      <BasePageHeader 
        title="Pet Health Dashboard" 
        subtitle="Monitor and manage your pets' health and wellbeing"
        icon="heart-pulse-fill"
        icon-variant="danger"
      >
        <template #action>
          <BaseButton 
            variant="outline-primary"
            icon="search"
            @click="toggleBreedSelector"
          >
            {{ showBreedSelector ? 'Hide' : 'Browse' }} Breeds
          </BaseButton>
        </template>
      </BasePageHeader>

      <!-- Breed Selector Panel -->
      <div v-if="showBreedSelector" class="row mb-4">
        <div class="col-12">
          <BreedSelectorPanel
            :show="showBreedSelector"
            v-model:pet-kind="selectedPetKind"
            :breeds="filteredBreeds"
            :loading="isFetchingBreeds"
            :error="breedError?.message"
            @breed-click="handleBreedClick"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!pets || pets.length === 0" class="row">
        <div class="col-12">
          <BaseEmptyState
            icon="heart-pulse"
            title="No Pets Found"
            description="Add your first pet to start tracking their health and wellness"
          >
            <template #action>
              <BaseButton 
                variant="primary" 
                size="lg" 
                icon="plus-circle"
                @click="router.push('/pet')"
              >
                Add Your First Pet
              </BaseButton>
            </template>
          </BaseEmptyState>
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
              :healthThreshold="80"
              @find-vet="handleFindVet"
            />
          </div>
        </div>
      </div>

      <!-- Quick Stats Summary -->
      <div v-if="pets && pets.length > 0" class="row mt-4">
        <div class="col-12">
          <QuickStatsGrid :stats="statsData" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.pets-accordion {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
