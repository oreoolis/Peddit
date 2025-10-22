<script setup>
import { ref } from 'vue';
import { computed } from 'vue';
import { useDebounceFn } from '@vueuse/core';

const props = defineProps({
  options: {
    type: Array,
    default: () => [
      { value: 'option-1', label: 'Option 1' },
      { value: 'option-2', label: 'Option 2' },
      { value: 'option-3', label: 'Option 3' },
    ],
  },
  defaultLabel: {
    type: String,
    default: 'Select an option'
  }
});

const model = defineModel();
const isOpen = ref(false);
const selectedOption = computed(() => {
  return props.options.find(option => option.value === model.value);
});

const selectedLabel = computed(() => {
  return selectedOption.value ? selectedOption.value.label : props.defaultLabel;
});

function selectOption(optionValue) {
  model.value = optionValue;
  isOpen.value = false;
}
</script>

<template>
  <!-- From Uiverse.io by 3bdel3ziz-T -->
  <div class="select" :class="{ 'is-open': isOpen, 'my-3': true }">
    <searchBar type="text" placeholder="Search Bar..." />
    <div class="selected rounded-5" @click="isOpen = !isOpen">
      {{ selectedLabel }}
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" class="arrow">
        <path
          d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z">
        </path>
      </svg>
      <div class="col-md-4">
        <searchBar type="text" placeholder="Search Bar..." />
      </div>

    </div>
    <div class="options">
      <div class="col-md-4">
        <searchBar type="text" placeholder="Search Bar..." />
      </div>
      <div v-for="(option, index) in options" :key="option.value" :title="option.label" class="option"
        :style="{ 'transition-delay': `${index * 40}ms` }" @click="selectOption(option.value)">
        {{ option.label }}
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
  z-index: 100000;
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
  /* Let it fill the container */
  font-size: 15px;
  /* 6. Define the initial animation state */
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