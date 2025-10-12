<script setup>
import { RouterLink } from 'vue-router';
import personImage from '../assets/person.jpg';
import { computed, ref, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useStorage } from '@/composables/useStorage';
import { useAuthStore } from '@/stores/authStore';

const defaultAvatar = personImage;
const userStore = useUserStore();
const authStore = useAuthStore();
const { downloadImage } = useStorage();

const displayAvatar = ref(defaultAvatar);
const isLoggedIn = computed(() => !!authStore.user);

// Watch for user changes to update avatar
watch(() => authStore.user, async (user) => {
    if (user && userStore.profile?.avatar_url) {
        try {
            const url = await downloadImage(userStore.profile.avatar_url);
            displayAvatar.value = url || defaultAvatar;
        } catch (error) {
            console.error('Error loading avatar:', error);
            displayAvatar.value = defaultAvatar;
        }
    } else {
            displayAvatar.value = defaultAvatar;
    }
}, { immediate: true });

watch(
    () => userStore.profile?.avatar_url,
    async (newAvatarUrl) => {
        if (newAvatarUrl && authStore.user) {
        try {
            const url = await downloadImage(newAvatarUrl);
            displayAvatar.value = url || defaultAvatar;
        } catch (error) {
            console.error('Error loading new avatar:', error);
        }
        }
    }
);
</script>

<template>
    <div >
        <nav class="navbar fixed-bottom bg-white headingFont" >
            <div class="container-fluid">
                <ul class="navbar-nav w-100 d-flex justify-content-around flex-row text-center">
                    <li class="nav-item">
                        <img src="../assets/Sprite/HomeIcons/Paw.png" alt="">
                        <RouterLink class="nav-link active black" to="/pet">Pet</RouterLink>
                    </li>
                    <li class="nav-item">
                        <img src="../assets/Sprite/HomeIcons/Home.png" alt="">
                        <RouterLink class="nav-link active black" to="/home">Home</RouterLink>
                    </li>
                    <li class="nav-item">
                        <img src="../assets/Sprite/HomeIcons/Social.png" alt="">
                        <RouterLink class="nav-link active primary" to="/social">Social</RouterLink>
                    </li>
                    <li class="nav-item">
                        <img src="../assets/Sprite/HomeIcons/Burger.png" alt="">
                        <RouterLink class="nav-link active primary" to="/meal">Meal</RouterLink>
                    </li>
                    <li v-if="isLoggedIn" class="nav-item">
                        <img 
                            class="rounded-circle profile-image"
                            :src="displayAvatar" 
                            alt="Profile Image"
                        >
                        <RouterLink class="nav-link active primary" to="/profile">Profile</RouterLink>
                    </li>

                </ul>
            </div>
        </nav>
        
        <nav class="navbar navbar-expand-sm bg-white headingFont">
            <div class="container-fluid" >
                <a class="navbar-brand primary brandFont" href="/home">Peddit</a>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0 mx-3">
                        <li class="nav-item ">
                            <RouterLink class="nav-link active primary " to="/home">Home</RouterLink>
                        </li>
                        <li class="nav-item ">
                            <RouterLink class="nav-link active primary" to="/about">About</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link active primary" to="/login">Login</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link active primary" to="/health">Health</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link active primary" to="/profile">Profile</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link active primary" to="/meal">Meal</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link active primary" to="/pet">Pet</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link active primary" to="/social">Social</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link active primary" to="/map">Map</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link active primary" to="/temp">Temp</RouterLink>
                        </li>                                                  
                    </ul>
                </div>
            </div>
        </nav>
    </div>
</template>


<style scoped>
.profile-image {
    width: 24px;
    height: 24px;
    object-fit: cover;
}
</style>