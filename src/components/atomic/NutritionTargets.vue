<script setup>
import { computed } from 'vue';
import { usePetStore } from '@/stores/petStore';
import StatCard from './StatCard.vue';
import BaseLabel from './BaseLabel.vue';

const props = defineProps({
  pet: {
    type: Object,
    required: true
  },
  // Optional list of nutrient keys to show, in order
  nutrients: {
    type: Array,
    default: () => [
      'protein', 'fat', 'linoleic_acid',
      'calcium', 'phosphorus', 'magnesium',
      'iron', 'zinc', 'vitamin_a', 'vitamin_d', 'vitamin_e'
    ]
  }
});

const petStore = usePetStore();

const targets = computed(() => petStore.getDailyNutritionTargets(props.pet));

const formattedEnergy = computed(() => {
  const kcal = targets.value?.energy_kcal;
  if (kcal == null) return 'N/A';
  return Math.round(kcal);
});

const nutrientList = computed(() => {
  const base = targets.value?.nutrients || {};
  const keys = props.nutrients.filter(k => !!base[k]);
  return keys.map((key) => ({ key, ...base[key] }));
});

const prettyName = (key) => {
  return key.replace(/_/g, ' ')
            .replace(/\b(\w)/g, (m) => m.toUpperCase());
}

const formatValue = (v) => {
  if (v == null || Number.isNaN(v)) return 'N/A';
  // Show one decimal for most values, no trailing .0
  const n = Math.round(v * 10) / 10;
  return Number.isInteger(n) ? n : n.toFixed(1);
}
</script>

<template>
  <div class="nutrition-targets">
    <div class="d-flex align-items-center justify-content-between mb-2">
      <BaseLabel size="sm" weight="bold">Daily Nutrition Targets</BaseLabel>
      <BaseLabel size="xs" variant="muted">Based on estimated MER</BaseLabel>
    </div>

    <!-- Energy Row -->
    <div class="row g-3 mb-2">
      <div class="col-12 col-sm-6 col-md-4">
        <StatCard label="Energy" :value="formattedEnergy" unit="kcal/day" size="sm" highlight />
      </div>
    </div>

    <!-- Nutrients Grid -->
    <div class="row g-3">
      <div v-for="n in nutrientList" :key="n.key" class="col-6 col-sm-4 col-md-3 col-lg-2">
        <StatCard :label="prettyName(n.key)" :value="formatValue(n.value)" :unit="n.unit + '/day'" size="sm" />
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.nutrition-targets {
  background-color: #ffffff;
  border-radius: 12px;
}
</style>

