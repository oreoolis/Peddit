<script setup>
import { computed } from 'vue';
import { useDateFormat } from '@vueuse/core';
import StatCard from './StatCard.vue';
import InfoDetail from './InfoDetail.vue';
import BaseButton from './BaseButton.vue';
import NutritionTargets from './NutritionTargets.vue';

const props = defineProps({
  pet: {
    type: Object,
    required: true
  },
  healthThreshold: {
    type: Number,
    default: 60
  }
});

const emit = defineEmits(['find-vet']);

const formattedBirthdate = computed(() => {
  if (!props.pet.birthdate) return 'Not recorded';
  return useDateFormat(props.pet.birthdate, 'MMM D, YYYY').value;
});

const formattedUpdatedAt = computed(() => {
  if (!props.pet.updated_at) return 'Not recorded';
  return useDateFormat(props.pet.updated_at, 'MMM D, YYYY').value;
});

// Capitalize helper for kind & breed
const cap = (s) => {
  if (!s || typeof s !== 'string') return s || '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const handleFindVet = () => {
  emit('find-vet', {
    petId: props.pet.id,
    petName: props.pet.name
  });
};
</script>

<template>
  <div class="pet-health-details">
    <!-- Stats Grid -->
    <div class="stats-section mb-4">
      <div class="row g-3">
        <div class="col-6 col-md-3">
          <StatCard
            label="Birthdate"
            :value="formattedBirthdate"
            size="sm"
          />
        </div>
        <div class="col-6 col-md-3">
          <StatCard
            label="Weight"
            :value="pet.weight_kg || 'N/A'"
            unit="kg"
            size="sm"
            variant="primary"
          />
        </div>
        
        <div class="col-6 col-md-3">
          <StatCard
            label="Neutered"
            :value="pet.neutered ? 'Yes' : 'No'"
            size="sm"
            :variant="pet.neutered ? 'success' : 'secondary'"
          />
        </div>
        <div class="col-6 col-md-3">
          <StatCard
            label="Kind & Breed"
            :value="`${cap(pet.kind || 'pet')} • ${cap(pet.breed || 'mixed breed')}`"
            size="sm"
            variant="secondary"
          />
        </div>
      </div>
    </div>

    <!-- Info Details Grid -->
    <div class="details-section mb-4">
      <div class="row g-3">
        <div class="col-12 col-md-6">
          <InfoDetail
            label="Allergies"
            :value="pet.allergies || 'None recorded'"
          />
        </div>
        <div class="col-12 col-md-6">
          <InfoDetail
            label="Last Updated"
            :value="formattedUpdatedAt"
          />
        </div>
      </div>
    </div>

    <!-- Nutrition Targets -->
    <div class="mb-4">
      <NutritionTargets :pet="pet" />
    </div>

    <!-- CTA Only -->
    <div class="mt-3">
      <BaseButton
        variant="danger"
        size="md"
        icon="geo-alt-fill"
        @click="handleFindVet"
      >
        Find Nearest Vet
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.pet-health-details {
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 0 0 12px 12px;
}

.stats-section,
.details-section,
.health-section {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 576px) {
  .pet-health-details {
    padding: 1rem;
  }
}
</style>
