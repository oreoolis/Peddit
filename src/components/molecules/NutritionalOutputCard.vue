<script setup>
import { computed } from 'vue';

const props = defineProps({
  cost: {
    type: [String, Number],
    default: '25.00'
  },
  nutrients: {
    type: Object,
    // Updated default data to include 'value', 'goal', and 'unit'
    required: true
  }
});

// petNutritionProfiles - get nutrition requirements from petNutritionStore
const nutrientMaxValues = {
  'Protein': 100,
  'Fat': 50,
  'Iron': 20,
  'Zinc': 15,
  'Calcium': 80
};

// Function to calculate the bar's width based on accumulative value
const getBarDetails = (nutrient) => {
  const maxValue = nutrientMaxValues[nutrient.name] || 100;
  const currentValue = parseFloat(nutrient.value) || 0;
  
  // Calculate percentage relative to max
  const percentage = (currentValue / maxValue) * 100;
  
  let barClass = 'is-normal';
  if (percentage >= 70) barClass = 'is-good';      // 70%+ of max is good
  if (percentage >= 100) barClass = 'is-high';     // At or above max
  
  return {
    width: `${Math.min(percentage, 100)}%`,        // Cap display at 100%
    barClass: barClass,
    percentage: percentage.toFixed(1)              // For display if needed
  };
};

</script>

<template>
    <div class="nutrition-card-2">
        <header class="card-header">
            <h3 class="headingFont fw-bold">Nutritional Summary</h3>
        </header>
        <!-- <div class="cost-banner">
            Estimated Cost: <strong>${{ cost }}/Week</strong>
        </div> -->
        <ul class="list-group list-group-flush">
            <li v-for="nutrient in props.nutrients" :key="nutrient.name" class="list-group-item">
                <div class="nutrient-label">
                    <span class="nutrient-name">{{ nutrient.name }}</span>
                    <span class="nutrient-value">{{ nutrient.value }}g</span>
                </div>
                <div class="progress-bar-container">
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
