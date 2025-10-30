<template>
  <div class="content-section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8">
          <!-- Tab Navigation -->
          <ProfileTabNavigation
            :tabs="tabs"
            :active-tab="activeTab"
            @tab-change="handleTabChange"
          />
          
          <!-- Content Grid -->
          <div class="content-grid">
            <!-- Pets Tab -->
            <PetContentGrid
              v-if="activeTab === 'posts'"
              :pets="pets"
              empty-state-icon="grid"
              :empty-state-title="petsEmptyTitle"
              :empty-state-description="petsEmptyDescription"
            >
              <template v-if="showAddPetAction" #emptyAction>
                <slot name="addPetAction"></slot>
              </template>
            </PetContentGrid>
            
            <!-- Liked Tab -->
            <ProfileContentEmptyState
              v-if="activeTab === 'liked'"
              icon="heart"
              :title="likedEmptyTitle"
              :description="likedEmptyDescription"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue';
import ProfileTabNavigation from '@/components/molecules/profile/ProfileTabNavigation.vue';
import PetContentGrid from '@/components/molecules/profile/PetContentGrid.vue';
import ProfileContentEmptyState from '@/components/atoms/profile/ProfileContentEmptyState.vue';

const props = defineProps({
  pets: {
    type: Array,
    default: () => []
  },
  username: {
    type: String,
    required: true
  },
  showAddPetAction: {
    type: Boolean,
    default: false
  },
  initialTab: {
    type: String,
    default: 'posts',
    validator: (value) => ['posts', 'liked'].includes(value)
  }
});

const emit = defineEmits(['tab-change']);

// State
const activeTab = ref(props.initialTab);

// Computed
const tabs = computed(() => [
  {
    id: 'posts',
    label: 'Pets',
    iconComponent: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '20',
      height: '20',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('rect', { x: '3', y: '3', width: '7', height: '7' }),
      h('rect', { x: '14', y: '3', width: '7', height: '7' }),
      h('rect', { x: '14', y: '14', width: '7', height: '7' }),
      h('rect', { x: '3', y: '14', width: '7', height: '7' })
    ])
  },
  {
    id: 'liked',
    label: 'Liked',
    iconComponent: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '20',
      height: '20',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { 
        d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'
      })
    ])
  }
]);

const petsEmptyTitle = computed(() => 'No pets yet');
const petsEmptyDescription = computed(() => `When @${props.username} adds pets, they'll appear here`);
const likedEmptyTitle = computed(() => 'No liked pets');
const likedEmptyDescription = computed(() => `Pets that @${props.username} likes will appear here`);

// Methods
const handleTabChange = (tabId) => {
  activeTab.value = tabId;
  emit('tab-change', tabId);
};
</script>

<style scoped>
.content-section {
  padding: 0 16px;
  margin-top: 8px;
}

.content-grid {
  min-height: 300px;
}

@media (min-width: 992px) {
  .content-section {
    padding: 0 24px;
  }
}
</style>
