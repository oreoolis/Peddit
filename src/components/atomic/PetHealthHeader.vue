<template>
  <div 
    class="pet-health-header" 
    :class="{ 'header-expanded': isExpanded }"
    @click="handleToggle"
  >
    <HealthAvatar
      :src="pet.photo_url || defaultImage"
      :alt="pet.name"
      :health-percentage="healthPercentage"
      :size="avatarSize"
      :show-percentage="false"
      :gender="pet.gender"
      class="me-3"
    />
    
    <PetInfoChip
      :name="pet.name"
      :age="calculatedAge"
      :breed="pet.breed || 'Mixed breed'"
      :gender="pet.gender"
      :kind="pet.kind"
      :neutered="pet.neutered"
      class="flex-grow-1"
    />
    
    <div class="accordion-toggle-icon">
      <BaseIcon 
        :name="isExpanded ? 'chevron-up' : 'chevron-down'"
        size="lg"
        variant="secondary"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useNow } from '@vueuse/core';
import HealthAvatar from './HealthAvatar.vue';
import PetInfoChip from './PetInfoChip.vue';
import BaseIcon from './BaseIcon.vue';

const props = defineProps({
  pet: {
    type: Object,
    required: true
  },
  isExpanded: {
    type: Boolean,
    default: false
  },
  avatarSize: {
    type: String,
    default: 'lg'
  }
});

const emit = defineEmits(['toggle']);

const now = useNow();
const defaultImage = 'https://picsum.photos/seed/defaultpet/200/200.jpg';

const calculatedAge = computed(() => {
  if (!props.pet.birthdate) return 'Unknown';
  
  const birthDate = new Date(props.pet.birthdate);
  const years = now.value.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.value.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.value.getDate() < birthDate.getDate())) {
    return years - 1;
  }
  
  return years;
});

const healthPercentage = computed(() => {
  if (!props.pet.body_condition_scale) return 30;
  
  const scale = props.pet.body_condition_scale;
  
  if (scale <= 2) return 30;
  if (scale === 3) return 50;
  if (scale === 4) return 80;
  if (scale === 5) return 100;
  if (scale === 6) return 75;
  if (scale === 7) return 50;
  if (scale >= 8) return 30;
  
  return 75;
});

const handleToggle = () => {
  emit('toggle');
};
</script>

<style scoped>
.pet-health-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 12px 12px 0 0;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.pet-health-header:hover {
  background-color: #e9ecef;
}

.header-expanded {
  border-radius: 12px 12px 0 0;
}

.accordion-toggle-icon {
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

@media (max-width: 576px) {
  .pet-health-header {
    padding: 1rem;
  }
}
</style>
