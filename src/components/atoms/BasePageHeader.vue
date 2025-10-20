<template>
  <div class="page-header" :class="alignmentClass">
    <div class="header-content">
      <h1 class="page-title">
        <BaseIcon v-if="icon" :name="icon" :variant="iconVariant" size="lg" class="me-2" />
        {{ title }}
      </h1>
      <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.action" class="header-action">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseIcon from '../atomic/BaseIcon.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: null
  },
  iconVariant: {
    type: String,
    default: 'danger'
  },
  align: {
    type: String,
    default: 'center',
    validator: (value) => ['left', 'center', 'right'].includes(value)
  }
});

const alignmentClass = computed(() => `text-${props.align}`);
</script>

<style scoped>
.page-header {
  padding: 2rem 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content {
  flex: 1;
  min-width: 0;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  display: inline-flex;
  align-items: center;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #718096;
  margin: 0;
}

.header-action {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .header-action {
    width: 100%;
  }
}
</style>
