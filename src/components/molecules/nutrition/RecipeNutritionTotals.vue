<template>
  <div class="nutrition-totals">
    <h6 class="fw-semibold mb-3">Recipe Totals</h6>
    <div class="row g-2">
      <div class="col-6 col-md-4" v-for="stat in stats" :key="stat.label">
        <NutritionStatBox 
          :label="stat.label"
          :value="stat.value"
          :unit="stat.unit"
          :decimals="stat.decimals"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import NutritionStatBox from '../../atoms/nutrition/NutritionStatBox.vue';

const props = defineProps({
  nutrition: {
    type: Object,
    required: true
  }
});

const stats = computed(() => {
  const n = props.nutrition;
  return [
    { label: 'Total Weight', value: n.total_weight_g, unit: 'g', decimals: 0 },
    { label: 'Protein', value: n.protein_g, unit: 'g', decimals: 1 },
    { label: 'Fat', value: n.fat_g, unit: 'g', decimals: 1 },
    { label: 'Calcium', value: n.calcium_g, unit: 'g', decimals: 2 },
    { label: 'Phosphorus', value: n.phosphorus_g, unit: 'g', decimals: 2 },
    { label: 'Fiber', value: n.fiber_g, unit: 'g', decimals: 1 },
    { label: 'Iron', value: n.iron_mg, unit: 'mg', decimals: 1 },
    { label: 'Taurine', value: n.taurine_g, unit: 'g', decimals: 2 },
    { label: 'EPA+DHA', value: n.epa_dha_g, unit: 'g', decimals: 2 }
  ];
});
</script>

<style scoped>
.nutrition-totals {
  margin-bottom: 2rem;
}
</style>
