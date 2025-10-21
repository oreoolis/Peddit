<template>
  <div class="breed-card" @click="handleClick">
    <BaseIcon name="paw-fill" variant="primary" size="lg" class="breed-icon" />
    <span class="breed-name">{{ breedName }}</span>
  </div>
</template>

<script setup>
import BaseIcon from '../../atomic/BaseIcon.vue';

const props = defineProps({
  breedName: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click', props.breedName);
};
</script>

<style scoped>
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
  flex-shrink: 0;
}

.breed-name {
  font-weight: 500;
  color: #2d3748;
  flex: 1;
}
</style>
