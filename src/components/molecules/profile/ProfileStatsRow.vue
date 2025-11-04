<template>
  <div class="stats-row">
    <template v-for="(stat, index) in stats" :key="`stat-${index}`">
      <ProfileStatItem 
        :value="stat.value"
        :label="stat.label"
      />
      <div v-if="index < stats.length - 1" class="stat-divider"></div>
    </template>
  </div>
  
</template>

<script setup>
import ProfileStatItem from '../../atoms/profile/ProfileStatItem.vue';

defineProps({
  stats: {
    type: Array,
    required: true,
    validator: (arr) => arr.every(stat => 
      stat.label && (stat.value !== undefined)
    )
  }
});
</script>

<style scoped>
.stats-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: #e4e4e7;
}

@media (min-width: 768px) {
  .stats-row {
    justify-content: flex-start;
    padding: 0;
  }
}
</style>
