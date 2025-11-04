
<script setup>
import { ref, computed } from 'vue';
import { useWindowSize } from '@vueuse/core';
import PetHealthHeader from './PetHealthHeader.vue';
import PetHealthDetails from './PetHealthDetails.vue';

const props = defineProps({
  pet: {
    type: Object,
    required: true
  },
  healthThreshold: {
    type: Number,
    default: 80
  }
});

const emit = defineEmits(['find-vet']);

const isExpanded = ref(false);
const { width: windowWidth } = useWindowSize();

const responsiveAvatarSize = computed(() => {
  if (windowWidth.value < 576) return 'sm';
  if (windowWidth.value < 768) return 'md';
  return 'lg';
});

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

const handleFindVet = (payload) => {
  emit('find-vet', payload);
};
</script>

<template>
  <div class="pet-health-accordion-item mb-3">
    <div class="accordion-card">
      <PetHealthHeader
        :pet="pet"
        :is-expanded="isExpanded"
        :avatar-size="responsiveAvatarSize"
        @toggle="toggleExpanded"
      />
      
      <Transition name="accordion">
        <PetHealthDetails
          v-if="isExpanded"
          :pet="pet"
          :health-threshold="healthThreshold"
          @find-vet="handleFindVet"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.pet-health-accordion-item {
  width: 100%;
}

.accordion-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
}

.accordion-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* Accordion Transition */
.accordion-enter-active {
  transition: all 0.4s ease-out;
}

.accordion-leave-active {
  transition: all 0.3s ease-in;
}

.accordion-enter-from {
  max-height: 0;
  opacity: 0;
  transform: translateY(-20px);
}

.accordion-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.accordion-enter-to {
  max-height: 1500px;
  opacity: 1;
  transform: translateY(0);
}

.accordion-leave-from {
  max-height: 1500px;
  opacity: 1;
  transform: translateY(0);
}
</style>
