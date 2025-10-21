<template>
  <div class="tab-navigation">
    <button 
      v-for="tab in tabs"
      :key="tab.id"
      class="tab-btn"
      :class="{ active: activeTab === tab.id }"
      @click="$emit('tab-change', tab.id)"
    >
      <component :is="tab.iconComponent" />
      <span>{{ tab.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { h } from 'vue';

defineProps({
  tabs: {
    type: Array,
    required: true
  },
  activeTab: {
    type: String,
    required: true
  }
});

defineEmits(['tab-change']);
</script>

<style scoped>
.tab-navigation {
  display: flex;
  justify-content: center;
  gap: 0;
  border-bottom: 1px solid #e4e4e7;
  margin-bottom: 24px;
}

.tab-btn {
  flex: 1;
  max-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  background: transparent;
  border: none;
  color: #71717a;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.tab-btn svg {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
}

.tab-btn:hover {
  color: #18181b;
}

.tab-btn:hover svg {
  transform: translateY(-2px);
}

.tab-btn.active {
  color: #18181b;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #18181b;
}
</style>
