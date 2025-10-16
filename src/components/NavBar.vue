<script setup>
import { RouterLink } from 'vue-router';
import personImage from '../assets/person.jpg';
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';

const defaultAvatar = personImage;
const userStore = useUserStore();
const authStore = useAuthStore();

const { user } = storeToRefs(authStore);
const { profile, avatarUrl } = storeToRefs(userStore);

const isLoggedIn = computed(() => !!user.value);

const displayAvatar = computed(() => avatarUrl.value || defaultAvatar);

onMounted(async () => {
    if (!profile.value && user.value) {
        await userStore.fetchProfile();
    }
});
</script>

<template>
    <div >
        <!-- Bottom navbar: xs–md -->
        <nav class="navbar fixed-bottom bg-white headingFont d-block d-lg-none shadow" >
            <div class="container-fluid">
                <ul class="navbar-nav w-100 d-flex justify-content-around flex-row text-center mb-0">
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
        <!-- Top navbar: lg+ -->
        <nav class="navbar navbar-expand-lg bg-primary headingFont d-none d-lg-block shadow">
            <div class="container-fluid" >
                <a class="navbar-brand white brandFont" href="/home">Peddit</a>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0 mx-3">
                        <li class="nav-item ">
                            <RouterLink class="nav-link active white bodyFont " to="/home">Home</RouterLink>
                        </li>
                        <li class="nav-item ">
                            <RouterLink class="nav-link active white bodyFont" to="/about">About</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link active white bodyFont" to="/login">Login</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link active white bodyFont" to="/health">Health</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link active white bodyFont" to="/profile">Profile</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link active white bodyFont" to="/meal">Meal</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link active white bodyFont" to="/pet">Pet</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link active white bodyFont" to="/social">Social</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link active white bodyFont" to="/map">Map</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link active white bodyFont" to="/temp">Temp</RouterLink>
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