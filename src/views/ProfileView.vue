<script setup>
// Components (organisms/atoms)
import ProfileHeaderSection from '@/components/Organisms/profile/ProfileHeaderSection.vue';
import ProfileContentTabs from '@/components/Organisms/profile/ProfileContentTabs.vue';
import BaseButton from '@/components/atomic/BaseButton.vue';
import ImageUploadModal from '@/components/ImageUploadModal.vue';
import EditProfileModal from '@/components/molecules/profile/EditProfileModal.vue';
import ProfileBio from '@/components/atoms/profile/ProfileBio.vue';

// Stores
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { usePetStore } from '@/stores/petStore';
import { usePostStore } from '@/stores/postStore';
import { usePetNutritionStore } from '@/stores/petNutritionStore';

// Vue
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

// Init stores
const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const petStore = usePetStore();
const postStore = usePostStore();
const petNutritionStore = usePetNutritionStore();

// Store refs
const { user } = storeToRefs(authStore);
const { profile, loading: profileLoading, username: profileUsername, follows, followers, avatarUrl } = storeToRefs(userStore);
const { pets } = storeToRefs(petStore);
const { posts } = storeToRefs(postStore);
const { userRecipePosts } = storeToRefs(petNutritionStore);

// Local state
const actionMessage = ref('');
const actionMessageType = ref('success');
const showUploadModal = ref(false);
const showEditModal = ref(false);

// Computed
const isLoading = computed(() => profileLoading.value);
const profileStats = computed(() => [
  { label: 'Following', value: follows.value || 0 },
  { label: 'Followers', value: followers.value || 0 },
  { label: 'Pets', value: pets.value?.length || 0 }
]);

// Methods
const handleSignOut = async () => {
  const result = await authStore.signOut();
  if (result.success) {
    router.push('/login');
  } else {
    actionMessage.value = result.error || 'Failed to sign out';
    actionMessageType.value = 'error';
  }
};

const openEditProfile = () => {
  showEditModal.value = true;
};

const handleImageUpload = async (file) => {
  const result = await userStore.uploadProfileImage(file);
  if (result.success) {
    actionMessage.value = 'Profile image updated!';
    actionMessageType.value = 'success';
    setTimeout(() => (actionMessage.value = ''), 3000);
  } else {
    actionMessage.value = result.error || 'Image upload failed';
    actionMessageType.value = 'error';
  }
};

const handleSaveProfile = async (profile, done, fail) => {
  const { success, data, error } = await userStore.updateProfile({ ...profile });
  if(error){
    fail(error.message);
    return;
  }
  console.log(success + ": " + data);
  done();
};

// Lifecycle
onMounted(async () => {
  // Ensure auth is initialised and profile loaded
  if (!authStore.initialised) {
    await authStore.initAuth();
  }
  if (!profile.value && user.value) {
    await userStore.fetchProfile();
  }

  // Load user content once profile is ready
  if (profile.value?.id) {
    await Promise.all([
      petStore.fetchPets(profile.value.id),
      postStore.fetchPosts({ userId: profile.value.id, publicOnly: false }),
      petNutritionStore.fetchRecipes(profile.value.id)
    ]);
  }
});
</script>

<template>
  <div class="profile-container">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Profile Content -->
    <div v-else-if="profile" class="profile-content">
      <!-- Header -->
      <ProfileHeaderSection
        class="d-flex justify-content-center"
        :avatar-url="avatarUrl || ''"
        :username="profileUsername"
        :stats="profileStats"
        :message="actionMessage"
        :message-type="actionMessageType"
      >
        <template #avatarAction>
          <button 
            class="btn btn-light settings-btn"
            @click="showUploadModal = true"
            aria-label="Change profile photo"
          >
            <img class="gear-icon" src="../assets/gear.png" alt="Settings" />
          </button>
        </template>

        <template #bio>
          <ProfileBio :bio="profile?.bio" />
        </template>
        <template #actions>
          <BaseButton variant="outline-primary" @click="openEditProfile">
            Edit Profile
          </BaseButton>
          <BaseButton variant="danger" @click="handleSignOut">
            Logout
          </BaseButton>
        </template>
      </ProfileHeaderSection>

      <!-- Tabs: Pets, Posts, Recipes -->
      <ProfileContentTabs
        :pets="pets"
        :posts="posts"
        :recipes="userRecipePosts"
        :username="profileUsername"
        :show-add-pet-action="true"
        class="d-flex justify-content-center"
      >
        <template #addPetAction>
          <BaseButton variant="primary" @click="router.push('/pet')">
            Add Your First Pet
          </BaseButton>
        </template>
      </ProfileContentTabs>
    </div>

    <!-- No profile (unlikely due to guard, but fallback) -->
    <div v-else class="not-found-state">
      <h2>Profile not available</h2>
      <p>Please sign in to view your profile.</p>
      <BaseButton variant="primary" @click="router.push('/login')">Go to Login</BaseButton>
    </div>

    <!-- Image Upload Modal -->
    <ImageUploadModal
      v-model:show="showUploadModal"
      :current-avatar="profile?.avatar_url"
      @uploaded="handleImageUpload"
      @error="(e) => { actionMessage = e?.message || 'Upload error'; actionMessageType = 'error'; }"
    />

    <EditProfileModal
      v-model:show="showEditModal"
      :initial-display-name="profile?.display_name"
      :initial-bio="profile?.bio"
      @save="handleSaveProfile"
    />
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

.not-found-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 40px 20px;
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
  margin: 0 0 24px 0;
}

/* Avatar settings button overlay */
.settings-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid white;
  background-color: rgb(0, 0, 0);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.gear-icon {
  filter: brightness(0) invert(1) brightness(1);
  width: 20px;
  height: 20px;
}
</style>
const handleSaveProfile = async (payload, done, fail) => {
  const { display_name, bio } = payload || {};
  const res = await userStore.updateProfile({ display_name, bio });
  if (res.success) {
    actionMessage.value = 'Profile updated!';
    actionMessageType.value = 'success';
    setTimeout(() => (actionMessage.value = ''), 3000);
    done && done();
  } else {
    const err = res.error || 'Failed to update profile';
    actionMessage.value = err;
    actionMessageType.value = 'error';
    fail ? fail(err) : null;
  }
};
