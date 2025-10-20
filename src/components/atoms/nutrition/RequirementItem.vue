<template>
  <div class="requirement-item">
    <span class="requirement-label">{{ label }}:</span>
    <span class="requirement-value">{{ value }}{{ unit }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  unit: {
    type: String,
    default: 'g'
  }
});
</script>

<style scoped>
.requirement-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.requirement-item:last-child {
  border-bottom: none;
}

.requirement-label {
  font-weight: 500;
  color: #4a5568;
}

.requirement-value {
  font-weight: 600;
  color: #2d3748;
}
</style>
