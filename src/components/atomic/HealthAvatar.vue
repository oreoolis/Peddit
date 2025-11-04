<template>
  <div class="health-avatar">
    <BaseProgressRing
      :value="healthPercentage"
      :size="ringSize"
      :stroke-width="strokeWidth"
      :color="ringColor"
    >
      <BaseAvatar
        :src="src"
        :alt="alt"
        :size="avatarSize"
        :fallback="fallback"
      />
    </BaseProgressRing>
    <div v-if="showPercentage" class="health-percentage">
      {{ healthPercentage }}%
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseAvatar from './BaseAvatar.vue';
import BaseProgressRing from './BaseProgressRing.vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Pet Avatar'
  },
  healthPercentage: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  showPercentage: {
    type: Boolean,
    default: true
  },
  gender: {
    type: String,
    default: null
  },
  fallback: {
    type: String,
    default: 'https://picsum.photos/seed/defaultpet/200/200.jpg'
  }
});

const ringSize = computed(() => {
  const sizes = {
    sm: 80,
    md: 100,
    lg: 120
  };
  return sizes[props.size] || 100;
});

const avatarSize = computed(() => {
  const sizes = {
    sm: 'sm',
    md: 'md',
    lg: 'lg'
  };
  return sizes[props.size] || 'md';
});

const strokeWidth = computed(() => {
  const widths = {
    sm: 6,
    md: 8,
    lg: 10
  };
  return widths[props.size] || 8;
});

const ringColor = computed(() => {
  const g = (props.gender || '').toLowerCase();
  if (g === 'female') return '#ff5c8a';
  if (g === 'male') return 'var(--bs-primary)';
  return '#6c757d';
});
</script>

<style scoped>
.health-avatar {
  position: relative;
  display: inline-block;
}

.health-percentage {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.95);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #495057;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

@media (max-width: 576px) {
  .health-percentage {
    font-size: 0.65rem;
    padding: 2px 6px;
  }
}
</style>
