<script setup>
import { ref, watch } from 'vue';
import { computed } from 'vue';
import { refDebounced } from '@vueuse/core';
import searchBar from '../searchBar.vue';

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  isSearchable: {
    type: Boolean,
    required: false
  }
});

const model = defineModel(); // hold ingredient
const isOpen = ref(false);
const searchQuery = ref('')
const searchDebounced = refDebounced(searchQuery, 300);


const selectedOption = computed(() => {
  return props.options.find(option => option.name === model.value?.name);
});

const selectedLabel = computed(() => {
  return selectedOption.value ? selectedOption.value.name : props.defaultLabel;
});

const displayValue = computed(() => {
  if (isOpen.value) {
    return searchQuery.value;
  }
  if (selectedLabel.value){
    return selectedLabel.value
  }
  return "Select Ingredient";
});

const filteredOptions = computed(() => {
  if (!searchDebounced.value) {
    return props.options;
  }
  return props.options.filter(option =>
    option.name.toLowerCase().includes(searchDebounced.value.toLowerCase())
  );
});

const selectOption = (ingredient) => {
  model.value = ingredient;
  isOpen.value = false;
  searchQuery.value = "";
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (!isOpen.value) {
    searchQuery.value = '';
  }
}

</script>

<template>
  <div class="select" :class="{ 'is-open': isOpen, 'my-3': true }">
    <searchBar v-model="searchQuery"
      :placeholder="isOpen ? 'Select Ingredient' : displayValue"
      @click="toggleDropdown" 
      />

    <div class="options">
      <div v-for="(ingredient, index) in filteredOptions"
        :key="ingredient.name"
        :title="ingredient.name"
        class="option"
        :style="{ 'transition-delay': `${index * 40}ms` }"
        @click.stop.prevent="selectOption(ingredient)">
        {{ ingredient.name }}
      </div>

      <div v-if="filteredOptions.length === 0" class="option no-results">
        No ingredient found
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

.selected {
  background-color: white;
  padding: 10px 15px;
  position: relative;
  z-index: 999;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform .18s cubic-bezier(.2, .9, .2, 1), opacity .12s ease, color .12s ease;
}

.arrow {
  position: relative;
  right: 0px;
  height: 10px;
  transform: rotate(-90deg);
  width: 25px;
  fill: var(--bs-black);
  z-index: 100000;
  transition: 300ms;
}

.options {
  /* This can be simplified */
  background-color: white;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  /* Position relative to the .select wrapper */
  top: 110%;
  /* Position it just below the .selected box */
  left: 0;
  width: 100%;
  z-index: 100;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
  /* Prevents clicking on the hidden panel */
  transition: opacity 300ms ease, transform 300ms ease;
  /* Add these for scrollable dropdown */
  max-height: 300px;
  /* Adjust this value as needed */
  overflow-y: auto;
}

.select.is-open>.options {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;

}

/* only the first one  of this class gets c*/
.select.is-open .selected {
  transform: translateY(-4px);
  opacity: 0.6;
  color: rgba(var(--bs-primary-rgb), 0.9);
}


.option {
  border-radius: 5px;
  padding: 5px;
  width: auto;
  font-size: 15px;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 300ms ease, transform 300ms ease;
}


.option:hover {
  background-color: var(--bs-primary-light);
}


.select.is-open .option {
  opacity: 1;
  transform: translateY(0);
}

.select.is-open .arrow {
  transform: rotate(0deg);
}
</style>