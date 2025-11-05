<template>
  <div class="base-stat-number" :class="variantClass">
    <span class="stat-value" :style="customStyle">{{ value }}</span>
    <span v-if="unit" class="stat-unit">{{ unit }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: [String, Number],
    required: true
  },
  unit: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  variant: {
    type: String,
    default: 'dark',
    validator: (value) => [
      'primary', 'secondary', 'success', 'danger', 
      'warning', 'info', 'dark'
    ].includes(value)
  }
});

const variantClass = computed(() => `stat-${props.variant}`);

const customStyle = computed(() => ({
  '--stat-size': getSizeValue()
}));

const getSizeValue = () => {
  const sizes = {
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '2.5rem'
  };
  return sizes[props.size] || sizes.md;
};
</script>

<style scoped>
.base-stat-number {
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  font-weight: 700;
}

.stat-value {
  font-size: var(--stat-size, 1.5rem);
  line-height: 1.2;
}

.stat-unit {
  font-size: calc(var(--stat-size, 1.5rem) * 0.7);
  font-weight: 500;
  opacity: 0.8;
}

.stat-primary { color: var(--bs-primary); }
.stat-secondary { color: var(--bs-secondary); }
.stat-success { color: var(--bs-success); }
.stat-danger { color: var(--bs-danger); }
.stat-warning { color: var(--bs-warning); }
.stat-info { color: var(--bs-info); }
.stat-dark { color: var(--bs-dark); }
</style>
