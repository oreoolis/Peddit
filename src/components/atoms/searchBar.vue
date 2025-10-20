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
  modelValue: [String, Number],
  readonly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const onInput = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>

<template>
    <!-- The container is now a rounded rectangle for textareas, and a pill for inputs -->
    <div class="input-group mx-auto py-1 bodyFont my-3" :class="type === 'textarea' ? 'rounded' : 'rounded-pill'">
        <span v-if="$slots.icon" class="input-group-text bg-transparent border-0 ps-3 pe-0">
            <slot name="icon"></slot>
        </span>
        
        <!-- Render a textarea if type is 'textarea' -->
        <textarea
            v-if="type === 'textarea'"
            class="form-control bg-transparent border-0"
            :class="{ 'ps-3': !$slots.icon }"
            :placeholder="placeholder"
            :value="modelValue"
            @input="onInput"
            :readonly="readonly"
            :aria-label="placeholder"
        ></textarea>
        
        <!-- Otherwise, render the default input -->
        <input 
            v-else
            :type="type" 
            class="form-control bg-transparent border-0"
            :class="{ 'ps-3': !$slots.icon }" 
            :placeholder="placeholder" 
            :value="modelValue"
            @input="onInput"
            :readonly="readonly"
            :aria-label="placeholder"
        />
    </div>
</template>

<style scoped>
/* ... (your existing styles are correct) ... */
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
.input-group .form-control::placeholder {
  transition: transform .18s cubic-bezier(.2,.9,.2,1), opacity .12s ease, color .12s ease;
}
.input-group:focus-within .form-control::placeholder {
  transform: translateY(-4px);
  opacity: 0.6;
  color: rgba(var(--bs-primary-rgb), 0.6);
}

.input-group .form-control:focus,
.input-group .form-control:active {
  outline: none;
  box-shadow: none;
  background: transparent;
}

.input-group .bi {
  transition: color .12s ease, transform .18s cubic-bezier(.2,.9,.2,1);
  color: rgba(0,0,0,0.6);
}

.input-group:focus-within .bi {
  color: rgba(var(--bs-primary-rgb), 0.6);
  transform: translateY(-2px);
}

input[readonly] {
  pointer-events: none;
}

/* Add styles for the textarea */
textarea.form-control {
    resize: vertical;
    min-height: 120px;
}
</style>