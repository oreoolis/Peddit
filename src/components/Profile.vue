<script setup>
// Assets
import goldenImage from '../assets/golden.jpg'
import persianImage from '../assets/persian.jpg';
import ragdollImage from '../assets/ragdoll.jpg';
import personImage from '../assets/person.jpg';
// Components
import PetProfileCard from './PetProfileCard.vue';
import ImageUploadModal from '@/components/ImageUploadModal.vue'
// Stores
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
// Others
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

// Global states
const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();

// Component states
const { user, loading: authLoading } = storeToRefs(authStore);
const { profile, loading: profileLoading, username, follows, followers, avatarUrl } = storeToRefs(userStore);
const defaultAvatar = personImage;
const showUploadModal = ref(false);
const isLoading = computed(() => authLoading.value || profileLoading.value);

const displayAvatar = computed(() => avatarUrl.value || defaultAvatar);

const handleImageUpload = async (file) => {
    const result = await userStore.uploadProfileImage(file);
    if (!result.success) {
        console.error('Error uploading image:', result.error);
    }
};

const handleSignOut = async () => {
    try {
        const result = await authStore.signOut();
        if (result.success) {
            router.push('/login');
        }
    } catch (error) {
        console.error('Error signing out:', error);
    }
};

const openUploadModal = () => {
    showUploadModal.value = true;
};

onMounted(async () => {
    if (!profile.value && user.value) {
        await userStore.fetchProfile();
    }
});
</script>

<template>
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div v-else class="container mx-auto">
        <!-- Profile -->
        <div class="row justify-content-center pb-4">
            <div class="col-12 text-center position-relative">
                <div class="position-relative d-inline-block mb-1">
                    <img 
                        class="rounded-circle profile-image"
                        :src="displayAvatar" 
                        alt="Profile Image"
                    >
                    <button 
                        class="btn btn-light position-absolute bottom-0 end-0 settings-btn"
                        @click="openUploadModal"    
                    >
                        <img 
                            class="gear-icon"
                            src="../assets/gear.png" 
                            alt="Settings"
                        >
                    </button>
                </div>
                <p class="">@{{ username }}</p>
            </div>
        </div>
        <!-- Follow Counts -->
        <div class="row justify-content-center mb-4">
            <div class="col-3 text-center">
                <h4>{{ follows }}</h4>
                <h4>Following</h4>
            </div>
            <div class="col-3 text-center">
                <h4>{{ followers }}</h4>
                <h4>Followers</h4>
            </div>
        </div>
        <!-- Profile Buttons -->
        <div class="row mb-4">
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-secondary">Edit profile</button>
                <button @click="handleSignOut" type="button" class="btn btn-danger">Logout</button>
            </div>
        </div>
        <!-- Pet display -->
        <!-- Change to view component, vue-for to loop through all pets -->
        <div class="row justify-content-between">
            <div class="col-12 text-center">
                <h2>Pets</h2>
            </div>
            <div class="col-4 mb-4">
                <PetProfileCard 
                    pet-name="Alberto"
                    pet-breed="Golden Retriver"
                    :pet-image="goldenImage"
                />
            </div>
            <div class="col-4 mb-4">
                <PetProfileCard 
                    pet-name="Alfredo"
                    pet-breed="Golden Retriver"
                    :pet-image="goldenImage"
                />
            </div>
            <div class="col-4 mb-4">
                <PetProfileCard 
                    pet-name="Butter"
                    pet-breed="Persian"
                    :pet-image="persianImage"
                />
            </div>
            <div class="col-4 mb-4">
                <PetProfileCard 
                    pet-name="Toastie"
                    pet-breed="Ragdoll"
                    :pet-image="ragdollImage"
                />
            </div>
        </div>
    </div>
    <!-- Image Upload Modal -->
    <ImageUploadModal 
        v-model:show="showUploadModal"
        :current-avatar="profile?.avatar_url"
        @uploaded="handleImageUpload"
        @error="console.error"
    />
</template>

<style scoped>
    .profile-image {
        border: 1px solid white;
        width: 120px;
        height: 120px;
        object-fit: cover;
    }

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
        transform: translate(10%, 10%);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .gear-icon {
        filter: brightness(0) invert(1) brightness(1);
        width: 20px;
        height: 20px;
    }
</style>