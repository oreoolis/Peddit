<template>
  <div class="info-detail">
    <BaseLabel 
      :size="labelSize" 
      weight="semibold" 
      variant="secondary"
      class="info-label"
    >
      {{ label }}
    </BaseLabel>
    <BaseLabel 
      :size="valueSize"
      weight="medium"
      variant="dark"
      class="info-value"
    >
      {{ value }}
    </BaseLabel>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseLabel from './BaseLabel.vue';

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
});

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
    sm: 'sm',
    md: 'md',
    lg: 'lg'
  };
  return sizes[props.size] || 'md';
});
</script>

<style scoped>
.info-detail {
  background-color: #f8f9fa;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border-left: 3px solid #667eea;
  transition: all 0.2s ease;
  height: 100%;
}

.info-detail:hover {
  background-color: #e9ecef;
  border-left-color: #764ba2;
  transform: translateX(2px);
}

.info-label {
  display: block;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  display: block;
  word-break: break-word;
}

@media (max-width: 576px) {
  .info-detail {
    padding: 0.5rem 0.75rem;
  }
}
</style>
