<template>
  <span class="base-badge" :class="badgeClasses">
    <BaseIcon v-if="icon" :name="icon" size="xs" class="me-1" />
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue';
import BaseIcon from './BaseIcon.vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'secondary',
    validator: (value) => [
      'primary', 'secondary', 'success', 'danger',
      'warning', 'info', 'light', 'dark'
    ].includes(value)
  },
  pill: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: null
  }
});

const badgeClasses = computed(() => [
  'badge',
  `bg-${props.variant}`,
  { 'rounded-pill': props.pill }
]);
</script>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35em 0.65em;
}
</style>
