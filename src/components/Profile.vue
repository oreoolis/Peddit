<script setup>
import PetProfileCard from './PetProfileCard.vue';
import goldenImage from '../assets/golden.jpg'
import persianImage from '../assets/persian.jpg';
import ragdollImage from '../assets/ragdoll.jpg';
import personImage from '../assets/person.jpg';
import router from '@/router';
import { useAuth } from '@/composables/useAuth';
import { useUserData } from '@/composables/useUserData';
import { useStorage } from '@/composables/useStorage';
import { computed, onMounted, ref, watch } from 'vue';


const { user, loading: authLoading, signOut } = useAuth();

const userId = computed(() => user.value?.id);
const { profile, loading: profileLoading, updateProfile } = useUserData(userId);
const { downloadImage, uploadImage } = useStorage();

const avatarUrl = ref('');
const isUploading = ref(false);

const isLoading = ref(true);
watch([authLoading, profileLoading], ([authLoad, profileLoad]) => {
    isLoading.value = authLoad || profileLoad;
}, { immediate: true });

watch(user, async (newUser) => {
    if (newUser) {
        console.log('User loaded:', newUser);
    }
});

watch(profile, async (newProfile) => {
    console.log('Profile updated:', newProfile);
    if (newProfile?.avatar_url) {
        try {
            const url = await downloadImage(newProfile.avatar_url);
            avatarUrl.value = url;
        } catch (error) {
            console.error('Error loading avatar:', error);
            avatarUrl.value = personImage; // Fallback
        }
    } else {
        avatarUrl.value = personImage; // Fallback
    }
}, { immediate: true });


onMounted(async () => {
    if (profile.value?.avatar_url) {
        avatarUrl.value = await getImageUrl(profile.value.avatar_url);
    }
});


const defaultAvatar = personImage;

const handleSignOut = async () => {
    try {
        await signOut()
        router.push('/login')
    } catch (error) {
        console.error('Error signing out:', error)
    }
}

</script>

<template>
    <div class="container">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <!-- Profile -->
        <div class="row justify-content-center pb-4">
            <div class="col-12 text-center position-relative">
                <div class="position-relative d-inline-block mb-1">
                    <img 
                        class="rounded-circle profile-image"
                        :src="avatarUrl || defaultAvatar" 
                        alt="Profile Image"
                    >
                    <button class="btn btn-light position-absolute bottom-0 end-0 settings-btn">
                        <img 
                            class="gear-icon"
                            src="../assets/gear.png" 
                            alt="Settings"
                        >
                    </button>
                </div>
                <p class="">@bernardcks</p>
            </div>
        </div>
        <!-- Follow Counts -->
        <div class="row justify-content-center mb-4">
            <div class="col-3 text-center">
                <h4>56.5k</h4>
                <h4>Following</h4>
            </div>
            <div class="col-3 text-center">
                <h4>10.5k</h4>
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