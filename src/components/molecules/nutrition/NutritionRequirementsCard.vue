<template>
  <div class="card info-card">
    <div class="card-header">
      <h5 class="mb-0">
        <BaseIcon name="clipboard-check" size="md" class="me-2" />
        Daily Requirements (per 1000 kcal)
      </h5>
    </div>
    <div class="card-body">
      <RequirementItem 
        v-for="req in requirements" 
        :key="req.label"
        :label="req.label"
        :value="req.value"
        :unit="req.unit"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseIcon from '../../atomic/BaseIcon.vue';
import RequirementItem from '../../atoms/nutrition/RequirementItem.vue';

const props = defineProps({
  nutritionRequirements: {
    type: Object,
    required: true
  }
});

const requirements = computed(() => {
  if (!props.nutritionRequirements) return [];
  
  const req = props.nutritionRequirements;
  return [
    { label: 'Protein (min)', value: req.min_protein_g, unit: 'g' },
    { label: 'Fat (min)', value: req.min_fat_g, unit: 'g' },
    ...(req.max_fat_g ? [{ label: 'Fat (max)', value: req.max_fat_g, unit: 'g' }] : []),
    { label: 'Calcium (min)', value: req.min_calcium_g, unit: 'g' },
    { label: 'Calcium (max)', value: req.max_calcium_g, unit: 'g' },
    { label: 'Phosphorus (min)', value: req.min_phosphorus_g, unit: 'g' },
    { label: 'Phosphorus (max)', value: req.max_phosphorus_g, unit: 'g' }
  ];
});
</script>

<style scoped>
.info-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: none;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0 !important;
  border: none;
}

.card-header h5 {
  font-size: 1.1rem;
  font-weight: 600;
}
</style>
