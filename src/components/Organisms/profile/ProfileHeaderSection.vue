<template>
  <div class="profile-header">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8">
          <div class="profile-top">
            <ProfileAvatar :avatar-url="avatarUrl" :alt="`${username}'s avatar`" size="lg" />
            
            <div class="profile-info">
              <h1 class="profile-username">@{{ username }}</h1>
              
              <ProfileStatsRow :stats="stats" />
              
              <div class="action-buttons">
                <slot name="actions"></slot>
              </div>
              
              <div v-if="message" class="action-message" :class="messageType">
                {{ message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProfileAvatar from '../../atoms/profile/ProfileAvatar.vue';
import ProfileStatsRow from '../../molecules/profile/ProfileStatsRow.vue';

defineProps({
  avatarUrl: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  stats: {
    type: Array,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  messageType: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error'].includes(value)
  }
});
</script>

<style scoped>
.profile-header {
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 32px 16px 24px;
  border-bottom: 1px solid #e4e4e7;
}

.profile-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.profile-info {
  text-align: center;
  width: 100%;
}

.profile-username {
  font-size: 1.75rem;
  font-weight: 700;
  color: #18181b;
  margin: 0 0 20px 0;
  letter-spacing: -0.02em;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 24px 0 12px;
}

.action-message {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-block;
  margin-top: 8px;
  animation: fadeIn 0.3s ease;
}

.action-message.success {
  background: #d1fae5;
  color: #065f46;
}

.action-message.error {
  background: #fee2e2;
  color: #991b1b;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 768px) {
  .profile-header {
    padding: 48px 24px 32px;
  }

  .profile-top {
    flex-direction: row;
    align-items: flex-start;
    gap: 32px;
  }

  .profile-info {
    text-align: left;
    flex: 1;
  }

  .profile-username {
    font-size: 2rem;
  }

  .action-buttons {
    justify-content: flex-start;
    margin: 28px 0 12px;
  }
}
</style>
