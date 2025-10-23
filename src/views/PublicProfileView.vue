<script setup>
// Assets
import personImage from '../assets/person.jpg';

// Components
import PetCard from '@/components/molecules/PetCard.vue';
import ProfileHeaderSection from '@/components/Organisms/profile/ProfileHeaderSection.vue';
import ProfileTabNavigation from '@/components/molecules/profile/ProfileTabNavigation.vue';
import BaseButton from '@/components/atomic/BaseButton.vue';

// Stores
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/stores/profileStore';
import { useAuthStore } from '@/stores/authStore';
import { useFollowStore } from '@/stores/followStore';
import { usePetStore } from '@/stores/petStore';

// Others
import { computed, onMounted, ref, watch, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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
const { pets } = storeToRefs(petStore);

const defaultAvatar = personImage;
const actionMessage = ref('');
const actionMessageType = ref('success');
const activeTab = ref('posts');
const localFollowLoading = ref(false);

// Computed
const showFollowButton = computed(() => user.value && profile.value && user.value.id !== profile.value.id);
const isOwnProfile = computed(() => user.value && profile.value && user.value.id === profile.value.id);
const displayAvatar = computed(() => avatarUrl.value || defaultAvatar);
const isProcessingFollow = computed(() => localFollowLoading.value || followLoading.value);

const profileStats = computed(() => [
  { label: 'Following', value: follows.value || 0 },
  { label: 'Followers', value: followers.value || 0 },
  { label: 'Pets', value: pets.value?.length || 0 }
]);

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

// Methods
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
      actionMessageType.value = 'success';
      setTimeout(() => actionMessage.value = '', 3000);
      
      await profileStore.fetchProfile(props.username, true);
    } else {
      actionMessage.value = result.error || 'An error occurred.';
      actionMessageType.value = 'error';
      setTimeout(() => actionMessage.value = '', 5000);
    }
  } catch (err) {
    console.error('Error in handleFollow:', err);
    actionMessage.value = 'An unexpected error occurred.';
    actionMessageType.value = 'error';
    setTimeout(() => actionMessage.value = '', 5000);
  } finally {
    localFollowLoading.value = false;
  }
};

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

// Lifecycle
onMounted(async () => {
  if (props.username) {
    await profileStore.fetchProfile(props.username);
    if (profile.value?.id) {
      await petStore.fetchPets(profile.value.id);
    }
  } else {
    router.push('/');
  }
});

// Watchers
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
      <ProfileHeaderSection
        :avatar-url="displayAvatar"
        :username="profileUsername"
        :stats="profileStats"
        :message="actionMessage"
        :message-type="actionMessageType"
      >
        <template #actions>
          <BaseButton 
            v-if="showFollowButton" 
            @click="handleFollow" 
            :disabled="isProcessingFollow"
            :variant="isFollowing ? 'outline-secondary' : 'danger'"
            :loading="isProcessingFollow"
          >
            {{ isFollowing ? 'Following' : 'Follow' }}
          </BaseButton>
          <BaseButton 
            v-if="isOwnProfile" 
            variant="outline-primary"
            @click="router.push('/profile')"
          >
            Edit Profile
          </BaseButton>
        </template>
      </ProfileHeaderSection>
      
      <!-- Content Section -->
      <div class="content-section">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-12 col-md-10 col-lg-8">
              <!-- Tab Navigation -->
              <ProfileTabNavigation
                :tabs="tabs"
                :active-tab="activeTab"
                @tab-change="setActiveTab"
              />
              
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
      <BaseButton variant="primary" @click="router.back()">
        Go Back
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: #ffffff;
  padding-bottom: 40px;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.content-section {
  padding: 0 16px;
  margin-top: 8px;
}

.content-grid {
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
  
  .content-section {
    padding: 0 24px;
  }
}

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
</style>
