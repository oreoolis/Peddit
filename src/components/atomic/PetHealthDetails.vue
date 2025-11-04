<script setup>
import { computed } from 'vue';
import { useDateFormat } from '@vueuse/core';
import StatCard from './StatCard.vue';
import InfoDetail from './InfoDetail.vue';
import HealthProgressBar from './HealthProgressBar.vue';
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

const healthPercentage = computed(() => {
  if (!props.pet.body_condition_scale) return Math.random() * 100;
  
  const scale = props.pet.body_condition_scale;
  
  // if (scale <= 2) return 30;
  // if (scale === 3) return 50;
  // if (scale === 4) return 80;
  // if (scale === 5) return 100;
  // if (scale === 6) return 75;
  // if (scale === 7) return 50;
  // if (scale >= 8) return 30;
  
  return 75;
});

const healthDescription = computed(() => {
  const percentage = healthPercentage.value;
  
  if (percentage >= 80) return 'Excellent body condition! Your pet is at an ideal weight.';
  if (percentage >= 60) return 'Good body condition with minor concerns that should be monitored.';
  if (percentage >= 40) return 'Some body condition issues detected. Consider adjusting diet and exercise.';
  return 'Significant body condition concerns. Please consult with your veterinarian.';
});

const showVetButton = computed(() => {
  return healthPercentage.value < props.healthThreshold;
});

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

    <!-- Health Status Section -->
    <div class="health-section">
      <HealthProgressBar
        label="Overall Health Status"
        :percentage="healthPercentage"
        :description="healthDescription"
        size="md"
      />
      
      <!-- Call to Action -->
      <div v-if="showVetButton" class="mt-3">
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
