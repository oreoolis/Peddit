<template>
  <div class="empty-state" :class="sizeClass">
    <div class="empty-icon">
      <BaseIcon :name="icon" :size="iconSize" variant="muted" />
    </div>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-description">{{ description }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseIcon from '../atomic/BaseIcon.vue';

const props = defineProps({
  icon: {
    type: String,
    default: 'inbox'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
});

const sizeClass = computed(() => `empty-state-${props.size}`);

const iconSize = computed(() => {
  const sizes = { sm: 'lg', md: 'xl', lg: 'xl' };
  return sizes[props.size] || 'xl';
});
</script>

<style scoped>
.empty-state {
  background: white;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.empty-state-sm {
  padding: 2rem 1rem;
}

.empty-state-lg {
  padding: 5rem 3rem;
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
  margin: 0 0 1rem 0;
}

@media (max-width: 768px) {
  .empty-state {
    padding: 3rem 1.5rem;
  }
  
  .empty-title {
    font-size: 1.5rem;
  }
  
  .empty-description {
    font-size: 1rem;
  }
}
</style>
