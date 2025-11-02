<script setup>
import Button from "./button.vue"

import { ref, defineEmits, defineProps, computed } from 'vue';

// Define props
const props = defineProps({
  label: {
    type: String,
    default: 'Enter text...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxChars: {
    type: Number,
    default: null
  }
});

// Define the event this component can emit
const emit = defineEmits(['submit']);

// Internal state for the input field
const inputValue = ref('');

const charsRemaining = computed(() => {
  if (!props.maxChars) return null;
  return Math.max(0, props.maxChars - (inputValue.value?.length || 0));
});

// Keep within limit
const enforceMax = (val) => {
  if (!props.maxChars) return val;
  return val?.slice(0, props.maxChars) ?? '';
}

// Method to handle submission
const handleSubmit = () => {
  // Don't submit if the input is empty or disabled
  if (!inputValue.value.trim() || props.disabled) return;

  // enforce max
  inputValue.value = enforceMax(inputValue.value);

  // Emit the 'submit' event with the input's value
  emit('submit', inputValue.value.trim());
  
  // Clear the input after submitting
  inputValue.value = '';
};
</script>

<template>
    <form @submit.prevent="handleSubmit" class="text-input-wrapper pill-layout">
      <div class="wave-group">
          <input 
            v-model="inputValue" 
            required 
            type="text" 
            class="input"
            :disabled="disabled"
            :maxlength="maxChars || null"
          >
            <span class="bar"></span>
            <label class="label">
                <span v-for="(char, index) in label" :key="index" class="label-char" :style="{ '--index': index }">
                    {{ char === ' ' ? '\u00A0' : char }}
                </span>
            </label>
        </div>
        <div v-if="charsRemaining !== null" class="small text-muted ms-3 me-2">{{ charsRemaining }} chars</div>
        <Button type="submit" :disabled="disabled" label="Send">
            <i class="bi bi-send-fill pe-2"></i>
        </Button>
    </form>
</template>

<style scoped>
.text-input-wrapper.pill-layout {
  position: relative;
  display: flex;
  align-items: center; /* Center vertically */
  padding: 0.25rem 0.5rem 0.25rem 0.25rem;
  border-radius: 50rem; /* Pill shape */
  background: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.07);
  transition: box-shadow 0.2s ease;
}
.text-input-wrapper.pill-layout:focus-within {
  box-shadow: 0 5px 20px rgba(var(--bs-primary-rgb), 0.15);
}

.wave-group {
  position: relative;
  flex-grow: 1;
}

.wave-group .input {
  font-size: 16px;
  padding: 10px 1rem;
  width: 100%;
  border: none;
  background: transparent;
}
.wave-group .input:focus { outline: none; }

/* Hide the bar in this design */
.wave-group .bar { display: none; }

.wave-group .label {
  color: #999;
  font-size: 16px;
  position: absolute;
  pointer-events: none;
  left: 1rem;
  top: 10px;
  display: flex;
}

.wave-group .label-char {
  transition: 0.2s ease all;
  transition-delay: calc(var(--index) * .01s);
}

.wave-group .input:focus ~ .label .label-char,
.wave-group .input:valid ~ .label .label-char {
  transform: translateY(-18px) ;
  font-size: 11px;
  color: var(--bs-primary);
  background: white;
  padding: 0 0.05rem;
}

.icon-button {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-button .bi {
  font-size: 1rem;
  margin-left: 2px; /* Optical alignment */
}
</style>