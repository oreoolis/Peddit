<!-- views/PublicProfile.vue -->
<script setup>
// Assets
import personImage from '../assets/person.jpg';
// Components
import PetProfileCard from '@/components/PetProfileCard.vue';
// Stores
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/stores/profileStore';
import { useAuthStore } from '@/stores/authStore';
import { useFollowStore } from '@/stores/followStore';
// Others
import { computed, onMounted, ref, watch } from 'vue';
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

const { user } = storeToRefs(authStore);
const { profile, loading, username: profileUsername, follows, followers, avatarUrl } = storeToRefs(profileStore);
const { isFollowing, loading: followLoading, error: followError } = storeToRefs(followStore);
const defaultAvatar = personImage;
const actionMessage = ref('');

const showFollowButton = computed(() => user.value && profile.value && user.value.id !== profile.value.id);
const isOwnProfile = computed(() => user.value && profile.value && user.value.id === profile.value.id);
const displayAvatar = computed(() => avatarUrl.value || defaultAvatar);

const handleFollow = async () => {
  if (!user.value || !profile.value) return;

  let result;
  if (isFollowing.value) {
    result = await followStore.unfollowUser(user.value.id, profile.value.id);
  } else {
    result = await followStore.followUser(user.value.id, profile.value.id);
  }

  if (result.success) {
    actionMessage.value = isFollowing.value ? 'Following!' : 'Unfollowed!';
    setTimeout(() => actionMessage.value = '', 3000);
    
    // Refresh the profile to get updated counts
    await profileStore.fetchProfile(props.username, true);
  } else {
    actionMessage.value = result.error || 'An error occurred.';
    setTimeout(() => actionMessage.value = '', 5000);
  }
};

onMounted(async () => {
  if (props.username) {
    await profileStore.fetchProfile(props.username);
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
  <div>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
    <div v-else-if="profile" class="container mx-auto">
      <div class="row justify-content-center pb-4">
        <div class="col-12 text-center position-relative">
          <div class="position-relative d-inline-block mb-1">
            <img class="rounded-circle profile-image" :src="displayAvatar" alt="Profile Image">
          </div>
          <p class="h5 mt-2">@{{ profileUsername }}</p>
        </div>
      </div>
      
      <div class="row justify-content-center mb-4">
        <div class="col-3 text-center">
          <h4>{{ follows }}</h4>
          <p class="text-muted">Following</p>
        </div>
        <div class="col-3 text-center">
          <h4>{{ followers }}</h4>
          <p class="text-muted">Followers</p>
        </div>
      </div>

      <div v-if="actionMessage" class="row justify-content-center mb-3">
        <div class="col-auto">
          <div class="alert" :class="followError ? 'alert-danger' : 'alert-success'" role="alert">
            {{ actionMessage }}
          </div>
        </div>
      </div>
      
      <div class="row mb-4 justify-content-center">
        <div class="btn-group" role="group">
          <button 
            v-if="showFollowButton" 
            @click="handleFollow" 
            :disabled="followLoading"
            class="btn"
            :class="isFollowing ? 'btn-secondary' : 'btn-primary'"
          >
            <span v-if="followLoading" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
            {{ isFollowing ? 'Unfollow' : 'Follow' }}
          </button>
          <button 
            v-if="isOwnProfile" 
            type="button" 
            class="btn btn-outline-secondary"
            @click="router.push('/profile')"
          >
            Edit My Profile
          </button>
        </div>
      </div>
      
      <div class="row justify-content-between">
        <div class="col-12 text-center">
          <h2>Pets</h2>
        </div>
        <div v-if="!profile.pets || profile.pets.length === 0" class="col-12 text-center text-muted">
          <p>No pets to display yet.</p>
        </div>
        <div v-else>
          <!-- Pet cards loop here -->
        </div>
      </div>
    </div>
    
    <div v-else class="container mx-auto text-center">
      <p class="h4">Profile not found</p>
      <button @click="router.back()" class="btn btn-primary">Go Back</button>
    </div>
  </div>
</template>

<style scoped>
.profile-image {
  border: 2px solid #fff;
  width: 120px;
  height: 120px;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>