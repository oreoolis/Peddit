<!-- PublicProfileView.vue - TikTok-inspired redesign -->
<script setup>
// Assets
import personImage from '../assets/person.jpg';
// Components
import PetProfileCard from '@/components/molecules/PetProfileCard.vue';
import PetCard from '@/components/molecules/PetCard.vue';
// Stores
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/stores/profileStore';
import { useAuthStore } from '@/stores/authStore';
import { useFollowStore } from '@/stores/followStore';
// Others
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePetStore } from '@/stores/petStore';

const props = defineProps({
  username: {
    type: String,
    required: true
  }
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const followStore = useFollowStore();
const petStore = usePetStore();

const { user } = storeToRefs(authStore);
const { profile, loading, username: profileUsername, follows, followers, avatarUrl } = storeToRefs(profileStore);
const { isFollowing, loading: followLoading, error: followError } = storeToRefs(followStore);
const { pets, petImages } = storeToRefs(petStore);

const defaultAvatar = personImage;
const actionMessage = ref('');
const activeTab = ref('posts');
const localFollowLoading = ref(false);

const showFollowButton = computed(() => user.value && profile.value && user.value.id !== profile.value.id);
const isOwnProfile = computed(() => user.value && profile.value && user.value.id === profile.value.id);
const displayAvatar = computed(() => avatarUrl.value || defaultAvatar);
const isProcessingFollow = computed(() => localFollowLoading.value || followLoading.value);

const handleFollow = async () => {
  if (!user.value || !profile.value || localFollowLoading.value) return;

  try {
    localFollowLoading.value = true;
    const wasFollowing = isFollowing.value;
    
    let result;
    if (wasFollowing) {
      result = await followStore.unfollowUser(user.value.id, profile.value.id);
    } else {
      result = await followStore.followUser(user.value.id, profile.value.id);
    }

    if (result.success) {
      actionMessage.value = isFollowing.value ? 'Following!' : 'Unfollowed!';
      setTimeout(() => actionMessage.value = '', 3000);
      
      await profileStore.fetchProfile(props.username, true);
    } else {
      actionMessage.value = result.error || 'An error occurred.';
      setTimeout(() => actionMessage.value = '', 5000);
    }
  } catch (err) {
    console.error('Error in handleFollow:', err);
    actionMessage.value = 'An unexpected error occurred.';
    setTimeout(() => actionMessage.value = '', 5000);
  } finally {
    localFollowLoading.value = false;
  }
};

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

onMounted(async () => {
  if (props.username) {
    await profileStore.fetchProfile(props.username);
    await petStore.fetchPets(profile.value.id);
  } else {
    router.push('/');
  }
});

watch([user, profile], async ([newUser, newProfile]) => {
  if (newUser && newProfile && newUser.id !== newProfile.id) {
    await followStore.checkFollowStatus(newUser.id, newProfile.id);
  } else {
    followStore.isFollowing = false;
  }
});
</script>

<template>
  <div class="profile-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
    <!-- Profile Content -->
    <div v-else-if="profile" class="profile-content">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-12 col-md-10 col-lg-8">
              <!-- Avatar & Username Section -->
              <div class="profile-top">
                <div class="avatar-container">
                  <img :src="displayAvatar" alt="Profile Picture" class="profile-avatar">
                </div>
                
                <div class="profile-info">
                  <h1 class="profile-username">@{{ profileUsername }}</h1>
                  
                  <!-- Stats Row -->
                  <div class="stats-row">
                    <div class="stat-item">
                      <span class="stat-number">{{ follows || 0 }}</span>
                      <span class="stat-label">Following</span>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                      <span class="stat-number">{{ followers || 0 }}</span>
                      <span class="stat-label">Followers</span>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                      <span class="stat-number">{{ pets?.length || 0 }}</span>
                      <span class="stat-label">Pets</span>
                    </div>
                  </div>
                  
                  <!-- Action Buttons -->
                  <div class="action-buttons">
                    <button 
                      v-if="showFollowButton" 
                      @click="handleFollow" 
                      :disabled="isProcessingFollow"
                      class="btn action-btn"
                      :class="isFollowing ? 'btn-following' : 'btn-follow'"
                    >
                      <span v-if="isProcessingFollow" class="spinner-border spinner-border-sm me-2"></span>
                      {{ isFollowing ? 'Following' : 'Follow' }}
                    </button>
                    <button 
                      v-if="isOwnProfile" 
                      class="btn action-btn btn-edit"
                      @click="router.push('/profile')"
                    >
                      Edit Profile
                    </button>
                  </div>
                  
                  <!-- Action Message -->
                  <div v-if="actionMessage" class="action-message" :class="followError ? 'error' : 'success'">
                    {{ actionMessage }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Content Tabs -->
      <div class="content-section">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-12 col-md-10 col-lg-8">
              <!-- Tab Navigation -->
              <div class="tab-navigation">
                <button 
                  class="tab-btn"
                  :class="{ active: activeTab === 'posts' }"
                  @click="setActiveTab('posts')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  <span>Pets</span>
                </button>
                <button 
                  class="tab-btn"
                  :class="{ active: activeTab === 'liked' }"
                  @click="setActiveTab('liked')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>Liked</span>
                </button>
              </div>
              
              <!-- Content Grid -->
              <div class="content-grid">
                <!-- Posts Tab -->
                <div v-if="activeTab === 'posts'">
                  <div v-if="!pets || pets.length === 0" class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <h3>No pets yet</h3>
                    <p>When @{{ profileUsername }} adds pets, they'll appear here</p>
                  </div>
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
                
                <!-- Liked Tab -->
                <div v-if="activeTab === 'liked'">
                  <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <h3>No liked pets</h3>
                    <p>Pets that @{{ profileUsername }} likes will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Profile Not Found -->
    <div v-else class="not-found-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
      </svg>
      <h2>Profile not found</h2>
      <p>The profile you're looking for doesn't exist</p>
      <button @click="router.back()" class="btn btn-primary">Go Back</button>
    </div>
  </div>
</template>

<style scoped>
/* Container */
.profile-container {
  min-height: 100vh;
  background: #ffffff;
  padding-bottom: 40px;
}

/* Loading State */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

/* Profile Header */
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

/* Avatar */
.avatar-container {
  position: relative;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
}

/* Profile Info */
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

/* Stats Row */
.stats-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 0 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 70px;
}

.stat-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: #18181b;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.875rem;
  color: #71717a;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: #e4e4e7;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.action-btn {
  padding: 10px 32px;
  font-weight: 600;
  font-size: 0.9375rem;
  border-radius: 8px;
  border: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
}

.btn-follow {
  background: #fe2c55;
  color: #ffffff;
}

.btn-follow:hover:not(:disabled) {
  background: #e02649;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(254, 44, 85, 0.3);
}

.btn-following {
  background: #ffffff;
  color: #18181b;
  border: 1px solid #e4e4e7;
}

.btn-following:hover:not(:disabled) {
  background: #f4f4f5;
}

.btn-edit {
  background: #ffffff;
  color: #18181b;
  border: 1px solid #e4e4e7;
}

.btn-edit:hover {
  background: #f4f4f5;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Action Message */
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

/* Content Section */
.content-section {
  padding: 0 16px;
  margin-top: 8px;
}

/* Tab Navigation */
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

/* Content Grid */
.content-grid {
  min-height: 300px;
}

/* Pet Grid */
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

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #71717a;
}

.empty-state svg {
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #18181b;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 0.9375rem;
  color: #71717a;
  margin: 0;
}

/* Not Found State */
.not-found-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 40px 20px;
}

.not-found-state svg {
  margin-bottom: 24px;
  color: #71717a;
  opacity: 0.5;
}

.not-found-state h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #18181b;
  margin: 0 0 12px 0;
}

.not-found-state p {
  font-size: 1rem;
  color: #71717a;
  margin: 0 0 32px 0;
}

/* Responsive Adjustments */
@media (min-width: 768px) {
  .profile-header {
    padding: 48px 24px 32px;
  }

  .profile-top {
    flex-direction: row;
    align-items: flex-start;
    gap: 32px;
  }

  .profile-avatar {
    width: 140px;
    height: 140px;
  }

  .profile-info {
    text-align: left;
    flex: 1;
  }

  .profile-username {
    font-size: 2rem;
  }

  .stats-row {
    justify-content: flex-start;
    padding: 0;
    margin-bottom: 28px;
  }

  .stat-number {
    font-size: 1.375rem;
  }

  .action-buttons {
    justify-content: flex-start;
  }

  .action-message {
    margin-top: 12px;
  }
}

@media (min-width: 992px) {
  .content-section {
    padding: 0 24px;
  }
}

/* Smooth transitions */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
