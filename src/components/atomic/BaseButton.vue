<template>
  <button
    :type="type"
    class="base-button"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
    <BaseIcon v-if="icon && !loading" :name="icon" :size="iconSize" class="me-2" />
    <span class="button-text"><slot /></span>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import BaseIcon from './BaseIcon.vue';

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => [
      'primary', 'secondary', 'success', 'danger',
      'warning', 'info', 'light', 'dark', 'link',
      'outline-primary', 'outline-secondary', 'outline-success',
      'outline-danger', 'outline-warning', 'outline-info'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  icon: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const buttonClasses = computed(() => [
  'btn',
  `btn-${props.variant}`,
  props.size !== 'md' ? `btn-${props.size}` : '',
  { 'w-100': props.block }
]);

const iconSize = computed(() => {
  const sizes = {
    sm: 'sm',
    md: 'md',
    lg: 'lg'
  };
  return sizes[props.size] || 'md';
});

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.base-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.base-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.button-text {
  display: inline-block;
}
</style>
