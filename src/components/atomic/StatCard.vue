<template>
  <div class="stat-card" :class="cardClasses">
    <BaseLabel 
      :size="labelSize" 
      variant="muted" 
      weight="semibold"
      class="stat-label mb-1"
    >
      {{ label }}
    </BaseLabel>
    <BaseStatNumber 
      :value="value" 
      :unit="unit"
      :size="valueSize"
      :variant="variant"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseLabel from './BaseLabel.vue';
import BaseStatNumber from './BaseStatNumber.vue';

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  unit: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'dark'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  highlight: {
    type: Boolean,
    default: false
  }
});

const cardClasses = computed(() => [
  { 'stat-card-highlight': props.highlight }
]);

const labelSize = computed(() => {
  const sizes = {
    sm: 'xs',
    md: 'sm',
    lg: 'md'
  };
  return sizes[props.size] || 'sm';
});

const valueSize = computed(() => {
  const sizes = {
    sm: 'md',
    md: 'lg',
    lg: 'xl'
  };
  return sizes[props.size] || 'lg';
});
</script>

<style scoped>
.stat-card {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-card:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-card-highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card-highlight :deep(.stat-label),
.stat-card-highlight :deep(.base-stat-number) {
  color: white !important;
}

.stat-label {
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 576px) {
  .stat-card {
    padding: 0.75rem;
  }
}
</style>
