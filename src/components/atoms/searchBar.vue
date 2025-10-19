<script setup>
defineProps({
  placeholder: {
    type: String,
    default: 'Placeholder Text'
  },
  type: {
    type: String,
    default: 'text'
  },
  modelValue: [String, Number], // Prop for v-model
  readonly: {
    type: Boolean,
    default: false
  }
});

// Define the event that v-model listens for
const emit = defineEmits(['update:modelValue']);

// Function to emit the event when the input value changes
const onInput = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>

<template>
    <div class="input-group w-100 mx-auto py-1 bodyFont rounded-pill my-3">
        <span class="input-group-text bg-transparent border-0 ps-3 pe-0">
            <!-- Use a named slot for the icon, with a default search icon inside -->
            <slot name="icon">
                <i class="bi bi-search"></i>
            </slot>
        </span>
        <input 
            :type="type" 
            class="form-control bg-transparent border-0" 
            :placeholder="placeholder" 
            :value="modelValue"
            @input="onInput"
            :readonly="readonly"
            :aria-label="placeholder"
        />
    </div>
</template>

<style scoped>
/* Your existing styles are fine, but I'll clean them up slightly for consistency */
.input-group {
  transition: transform .18s cubic-bezier(.2,.9,.2,1), box-shadow .18s ease, background .18s ease;
  will-change: transform, box-shadow;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.input-group:focus-within {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 10px 30px rgba(var(--bs-primary-rgb), 0.10);
}

.input-group .form-control:focus,
.input-group .form-control:active {
  outline: none;
  box-shadow: none;
  background: transparent;
}

.input-group .bi {
  transition: color .12s ease;
  color: rgba(0,0,0,0.6);
}

.input-group:focus-within .bi {
  color: var(--bs-primary);
}

input[readonly] {
  pointer-events: none;
}
</style>