<template>
  <div class="profile-empty-state">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      :width="iconSize" 
      :height="iconSize" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      :stroke-width="strokeWidth"
      stroke-linecap="round" 
      stroke-linejoin="round"
    >
      <component :is="iconPath" />
    </svg>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-description">{{ description }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script setup>
import { computed, h } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    default: 'empty',
    validator: (value) => ['empty', 'heart', 'grid'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
});

const iconSize = computed(() => {
  const sizes = { sm: 48, md: 64, lg: 80 };
  return sizes[props.size] || 64;
});

const strokeWidth = computed(() => {
  const widths = { sm: 1.5, md: 1.5, lg: 1 };
  return widths[props.size] || 1.5;
});

const iconPath = computed(() => {
  const icons = {
    empty: () => [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('line', { x1: '15', y1: '9', x2: '9', y2: '15' }),
      h('line', { x1: '9', y1: '9', x2: '15', y2: '15' })
    ],
    heart: () => [
      h('path', { 
        d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'
      })
    ],
    grid: () => [
      h('rect', { x: '3', y: '3', width: '7', height: '7' }),
      h('rect', { x: '14', y: '3', width: '7', height: '7' }),
      h('rect', { x: '14', y: '14', width: '7', height: '7' }),
      h('rect', { x: '3', y: '14', width: '7', height: '7' })
    ]
  };
  
  return icons[props.icon] || icons.empty;
});
</script>

<style scoped>
.profile-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #71717a;
}

.profile-empty-state svg {
  margin-bottom: 20px;
  opacity: 0.5;
  color: #71717a;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #18181b;
  margin: 0 0 8px 0;
}

.empty-description {
  font-size: 0.9375rem;
  color: #71717a;
  margin: 0;
}

@media (max-width: 768px) {
  .profile-empty-state {
    padding: 40px 16px;
  }
  
  .empty-title {
    font-size: 1.125rem;
  }
  
  .empty-description {
    font-size: 0.875rem;
  }
}
</style>
