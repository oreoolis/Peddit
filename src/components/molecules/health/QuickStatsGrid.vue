<template>
  <div class="quick-stats" ref="rootEl" :class="{ compact: isCompact }">
    <!-- use an internal grid wrapper so the component can control wrapping based on its own width -->
    <div class="">
      <div class="grid-item" v-for="stat in stats" :key="stat.label">
        <HealthStatBox 
          :icon="stat.icon"
          :value="stat.value"
          :label="stat.label"
          :variant="stat.variant"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import HealthStatBox from '../../atoms/health/HealthStatBox.vue';

const props = defineProps({
  stats: {
    type: Array,
    required: true,
    validator: (arr) => arr.every(stat => 
      stat.icon && stat.label && (stat.value !== undefined) && stat.variant
    )
  }
});

const rootEl = ref(null);
const isCompact = ref(false);

let ro = null;
onMounted(() => {
  if (window.ResizeObserver && rootEl.value) {
    ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect ? entry.contentRect.width : entry.target.offsetWidth;
        // threshold: if the component width is less than 520px, switch to compact (2x2)
        isCompact.value = w < 520;
      }
    });
    ro.observe(rootEl.value);
  } else {
    // Fallback: use window resize to approximate
    const check = () => {
      if (!rootEl.value) return;
      const w = rootEl.value.offsetWidth;
      isCompact.value = w < 520;
    };
    window.addEventListener('resize', check);
    check();
    ro = { disconnect: () => window.removeEventListener('resize', check) };
  }
});

onBeforeUnmount(() => {
  if (ro && ro.disconnect) ro.disconnect();
});
</script>

<style scoped>
.quick-stats {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.grid-item {
  /* ensure items stretch to equal height */
  display: block;
}

/* When component is compact (narrow), force 2 columns (2x2) */
.quick-stats.compact .grid {
  grid-template-columns: repeat(2, 1fr);
}

/* Very small widths: single column */
@media (max-width: 360px) {
  .quick-stats.compact .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .quick-stats {
    padding: 1rem;
  }
}
</style>
