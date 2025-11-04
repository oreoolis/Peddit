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
  <div class="nutrition-targets py-3">
    <div class="d-flex align-items-center justify-content-between mb-2">
      <BaseLabel size="sm" weight="bold">Daily Nutrition Targets</BaseLabel>
      <BaseLabel size="xs" variant="muted">Based on estimated MER</BaseLabel>
    </div>

    <!-- Energy Row -->
    <div class="row g-3 mb-3">
      <div class="col-12 col-sm-6 col-md-4">
        <div class="energy-card">
          <div class="d-flex flex-column">
            <BaseLabel size="xs" class="text-white-50 mb-1">Energy</BaseLabel>
            <div class="d-flex align-items-baseline">
              <span class="energy-value">{{ formattedEnergy }}</span>
              <span class="energy-unit ms-2">kcal/day</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Nutrients Grid -->
    <div class="row g-3 nutrient-grid">
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

.energy-card {
  background: var(--bs-primary);
  color: #fff;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.energy-value {
  font-weight: 800;
  font-size: 1.75rem;
  line-height: 1;
}

.energy-unit {
  font-size: 0.9rem;
  opacity: 0.9;
}

.nutrient-grid :deep(.stat-card) {
  margin-top: 0.5rem;    
  margin-bottom: 0.75rem;
}
</style>
