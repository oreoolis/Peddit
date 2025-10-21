<template>
  <div class="quick-stats">
    <div class="row g-3">
      <div class="col-6 col-md-3" v-for="stat in stats" :key="stat.label">
        <HealthStatBox 
          :icon="stat.icon"
          :value="stat.value"
          :label="stat.label"
          :variant="stat.variant"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import HealthStatBox from '../../atoms/health/HealthStatBox.vue';

defineProps({
  stats: {
    type: Array,
    required: true,
    validator: (arr) => arr.every(stat => 
      stat.icon && stat.label && (stat.value !== undefined) && stat.variant
    )
  }
});
</script>

<style scoped>
.quick-stats {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .quick-stats {
    padding: 1.5rem;
  }
}
</style>
