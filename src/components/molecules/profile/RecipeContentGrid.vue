<script setup>
import ProfileContentEmptyState from '@/components/atoms/profile/ProfileContentEmptyState.vue';
import RecipeSearchCompact from '@/components/social/RecipeSearchCompact.vue';
defineProps({
  recipes: {
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes}m ago`;
    }
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

</script>

<template>
  <div class="recipe-content-container">
    <!-- Empty State -->
    <ProfileContentEmptyState
      v-if="!recipes || recipes.length === 0"
      :icon="emptyStateIcon"
      :title="emptyStateTitle"
      :description="emptyStateDescription"
    >
      <template v-if="$slots.emptyAction" #action>
        <slot name="emptyAction"></slot>
      </template>
    </ProfileContentEmptyState>
    
    <!-- Recipe Grid -->
    <div v-else class="recipe-grid">
      <div v-for="recipe in recipes" :key="recipe.id">
        <RecipeSearchCompact
          :RecipeId="recipe.id"
          :Recipe_Name="recipe.recipes?.recipe_name || 'Untitled Recipe'"
          :Recipe_Desc="recipe.recipes?.description || ''"
          :User_Image="recipe.profiles?.avatar_url"
          :Username="recipe.profiles?.display_name"
          :Vote_score="recipe.vote_score || 0"
          :Comment_count="recipe.comment_count || 0"
          :Animal_Type="recipe.recipes?.pet_kind"
        />
      </div>
    </div>

  </div>
</template>

<style scoped>
.recipe-content-container {
  min-height: 300px;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
}

@media (min-width: 768px) {
  .recipe-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .recipe-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.recipe-card {
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recipe-card:hover {
  border-color: #d4d4d8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.recipe-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recipe-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #18181b;
  margin: 0;
  line-height: 1.4;
}

.recipe-date {
  font-size: 0.875rem;
  color: #71717a;
}

.recipe-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.recipe-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #52525b;
  font-weight: 500;
}

.recipe-stat svg {
  color: #a1a1aa;
}

.recipe-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f4f4f5;
}

.recipe-vote {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #71717a;
  font-weight: 500;
}

.recipe-vote svg {
  color: #a1a1aa;
}

.recipe-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.recipe-badge.private {
  background: #f0f9ff;
  color: #0284c7;
}
</style>
