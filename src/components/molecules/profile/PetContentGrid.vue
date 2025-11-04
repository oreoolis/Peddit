<template>
  <div class="pet-content-container">
    <!-- Empty State -->
    <ProfileContentEmptyState
      v-if="!pets || pets.length === 0"
      :icon="emptyStateIcon"
      :title="emptyStateTitle"
      :description="emptyStateDescription"
    >
      <template v-if="$slots.emptyAction" #action>
        <slot name="emptyAction"></slot>
      </template>
    </ProfileContentEmptyState>
    
    <!-- Pet Grid -->
    <div v-else class="pet-grid">
      <PetCard 
        v-for="pet in pets"
        :key="pet.id"
        :name="pet.name"
        :gender="pet.gender"
        :breed="pet.breed"
        :birthday="pet.birthday"
        :weight="pet.weight"
        :allergies="pet.allergies"
        :photo_url="pet.photo_url"
      />
    </div>
  </div>
</template>

<script setup>
import PetCard from '@/components/molecules/create-edit-pet/PetCard.vue';
import ProfileContentEmptyState from '@/components/atoms/profile/ProfileContentEmptyState.vue';

defineProps({
  pets: {
    type: Array,
    default: () => []
  },
  emptyStateIcon: {
    type: String,
    default: 'empty'
  },
  emptyStateTitle: {
    type: String,
    required: true
  },
  emptyStateDescription: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.pet-content-container {
  min-height: 300px;
}

.pet-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
}

@media (min-width: 768px) {
  .pet-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .pet-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
