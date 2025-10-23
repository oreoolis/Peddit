<template>
  <div class="nutrition-comparison">
    <h6 class="fw-semibold mb-3">Requirement Comparison</h6>
    
    <div 
      v-for="(nutrient, key) in comparison" 
      :key="key"
      class="comparison-item mb-3"
    >
      <div class="d-flex justify-content-between mb-1">
        <span class="fw-semibold text-capitalize">{{ key }}</span>
        <span class="text-muted">
          {{ nutrient.actual.toFixed(1) }} / {{ nutrient.required.toFixed(1) }}
          ({{ Math.round(nutrient.percentage) }}%)
        </span>
      </div>
      <div class="progress" style="height: 25px;">
        <div 
          class="progress-bar"
          :style="{ 
            width: Math.min(nutrient.percentage, 100) + '%',
            backgroundColor: getStatusColor(nutrient.status)
          }"
          role="progressbar"
        >
          {{ getStatusLabel(nutrient.status) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  comparison: {
    type: Object,
    required: true
  }
});

const getStatusColor = (status) => {
  const colors = {
    excellent: '#10b981',
    good: '#f59e0b',
    fair: '#f97316',
    poor: '#ef4444'
  };
  return colors[status] || '#6b7280';
};

const getStatusLabel = (status) => {
  const labels = {
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Needs Improvement'
  };
  return labels[status] || 'Unknown';
};
</script>

<style scoped>
.comparison-item {
  padding: 0.5rem 0;
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
  transition: width 0.6s ease;
}
</style>
