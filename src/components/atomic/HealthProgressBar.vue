<template>
  <div class="health-progress-bar">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <BaseLabel size="sm" weight="semibold">{{ label }}</BaseLabel>
      <BaseStatNumber :value="percentage" unit="%" size="sm" :variant="progressVariant" />
    </div>
    <div class="progress" :style="{ height: progressHeight }">
      <div
        class="progress-bar"
        :class="progressClass"
        role="progressbar"
        :style="{ width: percentage + '%' }"
        :aria-valuenow="percentage"
        aria-valuemin="0"
        aria-valuemax="100"
      >
      </div>
    </div>
    <BaseLabel v-if="description" size="xs" variant="muted" class="mt-2">
      {{ description }}
    </BaseLabel>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseLabel from './BaseLabel.vue';
import BaseStatNumber from './BaseStatNumber.vue';

const props = defineProps({
  label: {
    type: String,
    default: 'Health Status'
  },
  percentage: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
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

const progressHeight = computed(() => {
  const heights = {
    sm: '8px',
    md: '12px',
    lg: '16px'
  };
  return heights[props.size] || '12px';
});

const progressClass = computed(() => {
  if (props.percentage >= 80) return 'bg-success';
  if (props.percentage >= 60) return 'bg-warning';
  if (props.percentage >= 40) return 'bg-danger';
  return 'bg-danger';
});

const progressVariant = computed(() => {
  if (props.percentage >= 80) return 'success';
  if (props.percentage >= 60) return 'warning';
  return 'danger';
});
</script>

<style scoped>
.health-progress-bar {
  width: 100%;
}

.progress {
  border-radius: 10px;
  overflow: hidden;
  background-color: #e9ecef;
}

.progress-bar {
  transition: width 1s ease-in-out;
}
</style>
