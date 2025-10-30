<template>
  <div class="post-content-container">
    <!-- Empty State -->
    <ProfileContentEmptyState
      v-if="!posts || posts.length === 0"
      :icon="emptyStateIcon"
      :title="emptyStateTitle"
      :description="emptyStateDescription"
    >
      <template v-if="$slots.emptyAction" #action>
        <slot name="emptyAction"></slot>
      </template>
    </ProfileContentEmptyState>
    
    <!-- Post List -->
    <div v-else class="post-list">
      <div 
        v-for="post in posts"
        :key="post.id"
        class="post-item"
      >
        <div class="post-header">
          <h4 class="post-title">{{ post.title }}</h4>
          <span class="post-date">{{ formatDate(post.created_at) }}</span>
        </div>
        <p class="post-content">{{ truncateContent(post.content) }}</p>
        <div class="post-footer">
          <span class="post-stat">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            {{ post.vote_score || 0 }}
          </span>
          <span v-if="post.nsfw" class="post-badge nsfw">NSFW</span>
          <span v-if="!post.is_public" class="post-badge private">Private</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProfileContentEmptyState from '@/components/atoms/profile/ProfileContentEmptyState.vue';

defineProps({
  posts: {
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

const truncateContent = (content) => {
  if (!content) return '';
  return content.length > 150 ? content.substring(0, 150) + '...' : content;
};
</script>

<style scoped>
.post-content-container {
  min-height: 300px;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-item {
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.post-item:hover {
  border-color: #d4d4d8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.post-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #18181b;
  margin: 0;
  flex: 1;
  line-height: 1.4;
}

.post-date {
  font-size: 0.875rem;
  color: #71717a;
  white-space: nowrap;
}

.post-content {
  font-size: 0.9375rem;
  color: #52525b;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.post-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #f4f4f5;
}

.post-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #71717a;
  font-weight: 500;
}

.post-stat svg {
  color: #a1a1aa;
}

.post-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.post-badge.nsfw {
  background: #fef2f2;
  color: #dc2626;
}

.post-badge.private {
  background: #f0f9ff;
  color: #0284c7;
}

@media (max-width: 768px) {
  .post-item {
    padding: 16px;
  }
  
  .post-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .post-title {
    font-size: 1rem;
  }
  
  .post-date {
    align-self: flex-start;
  }
}
</style>
