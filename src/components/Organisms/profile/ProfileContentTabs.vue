<script setup>
import { ref, computed, h } from 'vue';
import ProfileTabNavigation from '@/components/molecules/profile/ProfileTabNavigation.vue';
import PetContentGrid from '@/components/molecules/profile/PetContentGrid.vue';
import PostContentGrid from '@/components/molecules/profile/PostContentGrid.vue';
import RecipeContentGrid from '@/components/molecules/profile/RecipeContentGrid.vue';

const props = defineProps({
  pets: {
    type: Array,
    default: () => []
  },
  posts: {
    type: Array,
    default: () => []
  },
  recipes: {
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
    default: 'pets',
    validator: (value) => ['pets', 'posts', 'recipes'].includes(value)
  }
});

const emit = defineEmits(['tab-change']);

// State
const activeTab = ref(props.initialTab);

// Computed
const tabs = computed(() => [
  {
    id: 'pets',
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
    id: 'posts',
    label: 'Posts',
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
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('polyline', { points: '14,2 14,8 20,8' }),
      h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
      h('line', { x1: '16', y1: '17', x2: '8', y2: '17' }),
      h('polyline', { points: '10,9 9,9 8,9' })
    ])
  },
  {
    id: 'recipes',
    label: 'Recipes',
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
      h('path', { d: 'M18 8h1a4 4 0 0 1 0 8h-1' }),
      h('path', { d: 'M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z' }),
      h('line', { x1: '6', y1: '1', x2: '6', y2: '4' }),
      h('line', { x1: '10', y1: '1', x2: '10', y2: '4' }),
      h('line', { x1: '14', y1: '1', x2: '14', y2: '4' })
    ])
  }
]);

const petsEmptyTitle = computed(() => 'No pets yet');
const petsEmptyDescription = computed(() => `When @${props.username} adds pets, they'll appear here`);
const postsEmptyTitle = computed(() => 'No posts yet');
const postsEmptyDescription = computed(() => `When @${props.username} shares posts, they'll appear here`);
const recipesEmptyTitle = computed(() => 'No recipes yet');
const recipesEmptyDescription = computed(() => `When @${props.username} shares recipes, they'll appear here`);

// Methods
const handleTabChange = (tabId) => {
  activeTab.value = tabId;
  emit('tab-change', tabId);
};
</script>

<template>
  <div class="content-section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8 ">
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
              class="mt-3"
              v-if="activeTab === 'pets'"
              :pets="pets"
              empty-state-icon="grid"
              :empty-state-title="petsEmptyTitle"
              :empty-state-description="petsEmptyDescription"
            >
              <template v-if="showAddPetAction" #emptyAction>
                <slot name="addPetAction"></slot>
              </template>
            </PetContentGrid>
            
            <!-- Posts Tab -->
            <PostContentGrid
            class="mt-3"
              v-if="activeTab === 'posts'"
              :posts="posts"
              empty-state-icon="empty"
              :empty-state-title="postsEmptyTitle"
              :empty-state-description="postsEmptyDescription"
            />
            
            <!-- Recipes Tab -->
            <RecipeContentGrid
              class="mt-3"
              v-if="activeTab === 'recipes'"
              :recipes="recipes"
              empty-state-icon="empty"
              :empty-state-title="recipesEmptyTitle"
              :empty-state-description="recipesEmptyDescription"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
