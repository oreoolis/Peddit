<template>
  <div class="progress-ring" :style="containerStyle">
    <svg 
      class="progress-svg" 
      :width="size" 
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
    >
      <!-- Background circle -->
      <circle
        class="progress-bg"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="backgroundColor"
        :stroke-width="strokeWidth"
      />
      <!-- Progress circle -->
      <circle
        class="progress-bar"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="progressColor"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        :transform="`rotate(-90 ${size / 2} ${size / 2})`"
      />
    </svg>
    <div class="progress-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
  },
  size: {
    type: Number,
    default: 120
  },
  strokeWidth: {
    type: Number,
    default: 8
  },
  color: {
    type: String,
    default: null
  },
  backgroundColor: {
    type: String,
    default: '#e9ecef'
  }
});

const radius = computed(() => (props.size / 2) - (props.strokeWidth / 2));
const circumference = computed(() => 2 * Math.PI * radius.value);
const dashOffset = computed(() => 
  circumference.value - (props.value / 100) * circumference.value
);

const progressColor = computed(() => {
  if (props.color) return props.color;
  
  if (props.value >= 80) return '#28a745';
  if (props.value >= 60) return '#ffc107';
  if (props.value >= 40) return '#fd7e14';
  return '#dc3545';
});

const containerStyle = computed(() => ({
  '--ring-size': `${props.size}px`
}));
</script>

<style scoped>
.progress-ring {
  position: relative;
  width: var(--ring-size);
  height: var(--ring-size);
  display: inline-block;
}

.progress-svg {
  display: block;
  width: 100%;
  height: 100%;
}

.progress-bar {
  transition: stroke-dashoffset 1s ease-in-out, stroke 0.3s ease;
}

.progress-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
}
</style>
