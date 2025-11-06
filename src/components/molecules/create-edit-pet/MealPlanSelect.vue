<script setup>
import { ref, computed } from 'vue';
import searchBar from '@/components/atoms/searchBar.vue';


const props = defineProps({
  mealOptions: {
    type: Object,
    default: ''
  },
  defaultLabel: {
    type: String,
    default: 'Select an option'
  },
  kind: {
    type: String,
    default: ''
  }
});

const model = defineModel();
const isOpen = ref(false);
const searchQuery = ref('');

// Normalize options to always have value/label structure
const normalizedOptions = computed(() => {
  if (!props.mealOptions || props.mealOptions.length === 0) {
    return [];
  }

  // Check if first item is a string
  if (typeof props.mealOptions[0] === 'string') {
    return props.mealOptions
      .filter(item => !props.kind || item.kind === props.kind)
      .map(item => ({
        value: item.id,
        label: item.recipe_name,
        id: item.id,
        recipe_name: item.recipe_name,
        
      }));
  }

  // return as desconstructed object to loop through
  return props.mealOptions.map(item => ({
    value: item.id,
    label: item.recipe_name,
    id: item.id,
    recipe_name: item.recipe_name
  }))
});

// Filter options based on search query
const filteredOptions = computed(() => {
  if (!searchQuery.value.trim()) {
    return normalizedOptions.value;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return normalizedOptions.value.filter(option =>
    option.label.toLowerCase().includes(query)
  );
});

const selectedOption = computed(() => {
  if (!normalizedOptions.value || normalizedOptions.value.length === 0) {
    return null;
  }
  return normalizedOptions.value.find(option => option.value === model.value);
});

const selectedLabel = computed(() => {
  return selectedOption.value ? selectedOption.value.label : props.defaultLabel;
});

const selectOption = (optionValue) => {
  model.value = optionValue;
  isOpen.value = false;
  searchQuery.value = ''; // Clear search after selection
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    searchQuery.value = ''; // Clear search when opening
  }
}
</script>

<template>
  <div class="select" :class="{ 'is-open': isOpen, 'my-3': true }">
    <searchBar v-model="searchQuery" type="text" :placeholder="isOpen ? 'Select Option...' : selectedLabel"
      @click="toggleDropdown" />
    <div class="options">
      <div v-if="filteredOptions.length === 0" class="no-results">
        No meals found
      </div>
      <div v-for="(option, index) in filteredOptions" :key="option.id" :title="option.recipe_name" class="option"
        :style="{ 'transition-delay': `${index * 40}ms` }" @click="selectOption(option.value)">
        {{ option.recipe_name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.select {
  cursor: pointer;
  position: relative;
  transition: 300ms;
  color: var(--bs-black);
}

.options {
  background-color: white;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  z-index: 100;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
  transition: opacity 300ms ease, transform 300ms ease;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
}

.select.is-open>.options {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.option {
  border-radius: 5px;
  padding: 5px;
  width: auto;
  font-size: 15px;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 300ms ease, transform 300ms ease;
  cursor: pointer;
}

.option:hover {
  background-color: var(--bs-primary-light);
}

.select.is-open .option {
  opacity: 1;
  transform: translateY(0);
}

.no-results {
  padding: 10px;
  text-align: center;
  color: #999;
  font-style: italic;
}
</style>
