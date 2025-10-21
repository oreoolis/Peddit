<template>
  <div class="stat-item">
    <span class="stat-number">{{ value }}</span>
    <span class="stat-label">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 70px;
}

.stat-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: #18181b;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.875rem;
  color: #71717a;
  font-weight: 500;
}
</style>
