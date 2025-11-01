<template>
  <div class="stat-box" :class="variantClass">
    <BaseIcon :name="icon" size="xl" class="stat-icon" />
    <div class="stat-content">
      <div class="stat-number">{{ value }}</div>
      <div class="stat-label">{{ label }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseIcon from '../../atomic/BaseIcon.vue';

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'info', 'danger'].includes(value)
  }
});

const variantClass = computed(() => `stat-box-${props.variant}`);
</script>

<style scoped>
.stat-box {
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  height: 100%;
}

.stat-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.stat-box-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-box-success {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.stat-box-warning {
  background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
}

.stat-box-info {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
}

.stat-box-danger {
  background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
}

.stat-icon {
  opacity: 0.9;
  flex-shrink: 0;
  color: white;
}

.stat-content {
  flex: 1;
  min-width: 0; /* allow content to shrink inside flex container to prevent overflow */
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 500;
  /* Prefer wrapping between words and avoid breaking words into single letters */

}

@media (max-width: 768px) {
  .stat-box {
    padding: 1rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .stat-box {
    flex-direction: column;
    text-align: center;
    padding: 1rem 0.75rem;
  }
  .stat-content {
    min-width: 0; /* ensure wrapping on very small screens */
  }
  .stat-number {
    font-size: 1.25rem;
  }
  .stat-icon {
    font-size: 1.25rem; /* reduce icon size on very small screens */
  }
  .stat-label {
    /* On very small widths, prefer a single line with ellipsis to avoid weird vertical stacking */
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
