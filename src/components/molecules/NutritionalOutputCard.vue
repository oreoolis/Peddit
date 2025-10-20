<script setup>
import { computed } from 'vue';

const props = defineProps({
  cost: {
    type: [String, Number],
    default: '25.00'
  },
  nutrients: {
    type: Array,
    // Updated default data to include 'value', 'goal', and 'unit'
    default: () => [
      { name: 'Protein', value: 45, goal: 50, unit: 'g' },
      { name: 'Carbs', value: 25, goal: 100, unit: 'g' },
      { name: 'Fat', value: 22, goal: 20, unit: 'g' },
      { name: 'Vitamin C', value: 90, goal: 90, unit: 'mg' },
      { name: 'Iron', value: 8, goal: 18, unit: 'mg' },
    ]
  }
});

// Function to calculate the bar's width and determine its color class
const getBarDetails = (nutrient) => {
  if (!nutrient.goal || nutrient.goal === 0) {
    return { width: '0%', barClass: '' };
  }
  const percentage = (nutrient.value / nutrient.goal) * 100;
  
  let barClass = 'is-normal';
  if (percentage >= 100) barClass = 'is-good';
  if (percentage > 120) barClass = 'is-high'; // Over 120% of goal

  return {
    width: `${Math.min(percentage, 100)}%`, // Cap width at 100%
    barClass: barClass
  };
};
</script>

<template>
    <div class="nutrition-card-2">
        <header class="card-header">
            <h3 class="headingFont fw-bold">Nutritional Summary</h3>
        </header>
        <div class="cost-banner">
            Estimated Cost: <strong>${{ cost }}/Week</strong>
        </div>
        <ul class="list-group list-group-flush">
            <li v-for="nutrient in nutrients" :key="nutrient.name" class="list-group-item">
                <div class="nutrient-label">
                    <span class="nutrient-name">{{ nutrient.name }}</span>
                    <!-- Display value and goal -->
                    <span class="nutrient-value">{{ nutrient.value }}{{ nutrient.unit }} / {{ nutrient.goal }}{{ nutrient.unit }}</span>
                </div>
                <div class="progress-bar-container">
                    <!-- Bind the calculated width and class -->
                    <div 
                        class="progress-bar-fill" 
                        :class="getBarDetails(nutrient).barClass"
                        :style="{ width: getBarDetails(nutrient).width }"
                    ></div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.nutrition-card-2 {
  border-radius: 0.75rem;
  background: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.07);
  border: 1px solid var(--bs-border-color-translucent);
}
.card-header {
  padding: 1rem 1.25rem;
}
.cost-banner {
  background: var(--bs-primary-bg-subtle);
  color: var(--bs-primary-text-emphasis);
  padding: 0.75rem 1.25rem;
  font-weight: 500;
}
.list-group-item {
  padding: 0.85rem 1.25rem;
}
.nutrient-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.nutrient-name {
  font-weight: 600;
}
.nutrient-value {
    font-size: 0.9em;
    color: #6c757d;
}
.progress-bar-container {
  height: 6px;
  width: 100%;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease, background-color 0.5s ease;
}

/* Color coding for the bars */
.progress-bar-fill.is-normal {
  background-color: var(--bs-primary);
}
.progress-bar-fill.is-good {
  background-color: var(--bs-success); /* Green for good */
}
.progress-bar-fill.is-high {
  background-color: var(--bs-warning); /* Orange for too high */
}
</style>
