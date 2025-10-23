<template>
  <component
    :is="tag"
    class="base-label"
    :class="[sizeClass, variantClass, weightClass]"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  tag: {
    type: String,
    default: 'span'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'secondary',
    validator: (value) => [
      'primary', 'secondary', 'success', 'danger',
      'warning', 'info', 'light', 'dark', 'muted'
    ].includes(value)
  },
  weight: {
    type: String,
    default: 'normal',
    validator: (value) => ['light', 'normal', 'medium', 'semibold', 'bold'].includes(value)
  }
});

const sizeClass = computed(() => `label-${props.size}`);
const variantClass = computed(() => `text-${props.variant}`);
const weightClass = computed(() => `fw-${getWeightValue()}`);

const getWeightValue = () => {
  const weights = {
    light: 'light',
    normal: 'normal',
    medium: 'medium',
    semibold: 'semibold',
    bold: 'bold'
  };
  return weights[props.weight] || 'normal';
};
</script>

<style scoped>
.base-label {
  line-height: 1.4;
  margin: 0;
}

.label-xs { font-size: 0.75rem; }
.label-sm { font-size: 0.875rem; }
.label-md { font-size: 1rem; }
.label-lg { font-size: 1.125rem; }
</style>
