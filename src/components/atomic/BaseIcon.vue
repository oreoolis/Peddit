<template>
  <i :class="iconClasses" :title="title" :style="customStyle"></i>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'secondary',
    validator: (value) => [
      'primary', 'secondary', 'success', 'danger', 
      'warning', 'info', 'light', 'dark'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  title: {
    type: String,
    default: ''
  }
});

const iconClasses = computed(() => [
  'bi',
  `bi-${props.name}`,
  `text-${props.variant}`,
  `icon-${props.size}`
]);

const customStyle = computed(() => ({
  '--icon-size': getSizeValue()
}));

const getSizeValue = () => {
  const sizes = {
    xs: '0.8rem',
    sm: '1rem',
    md: '1.2rem',
    lg: '1.5rem',
    xl: '2rem'
  };
  return sizes[props.size] || sizes.md;
};
</script>

<style scoped>
i {
  font-size: var(--icon-size, 1.2rem);
  line-height: 1;
}
</style>
