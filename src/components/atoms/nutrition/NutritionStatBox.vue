<template>
  <div class="nutrition-stat-box">
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value">{{ displayValue }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: ''
  },
  decimals: {
    type: Number,
    default: 1
  }
});

const displayValue = computed(() => {
  const formatted = props.value.toFixed(props.decimals);
  return `${formatted}${props.unit}`;
});
</script>

<style scoped>
.nutrition-stat-box {
  background: #f7fafc;
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
  border: 2px solid #e2e8f0;
}

.stat-label {
  font-size: 0.75rem;
  color: #718096;
  text-transform: uppercase;
  font-weight: 600;
  display: block;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}
</style>
