<script setup>
import { RouterLink } from 'vue-router';
import personImage from '../assets/person.jpg';
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import NavBarBottom from './molecules/NavBarBottom.vue';
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


/* Top navbar styling */
.navbar-top {
    background: linear-gradient(90deg, var(--bs-primary) 0%, var(--bs-primary) 100%);
    color: white;
    padding: 0.65rem 1rem;
    box-shadow: 0 6px 20px rgba(2,6,23,0.25);
    border-bottom: 1px solid rgba(255,255,255,0.06);
}

/* Soft shared shadow helper */
.shadow-custom {
    transition: box-shadow 180ms ease, transform 180ms ease;
}
.shadow-custom:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 34px rgba(2,6,23,0.28);
}

/* Nav item pill style for bottom */
.nav-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 10px;
    border-radius: 12px;
    transition: background-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
    text-decoration: none; /* ensure RouterLink has no underline */
    color: inherit;
}
.nav-item >.nav-pill:hover {
    background: rgba(0, 102, 204, 0.06);
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(2,6,23,0.12);
}
.nav-pill.d-flex { flex-direction: row; gap: 8px; padding: 6px 10px; }

/* Profile pill emphasised */
.profile-pill .profile-image {
    width: 36px;
    height: 36px;
    border: 2px solid #fff;
    box-shadow: 0 6px 14px rgba(2,6,23,0.18);
}

/* Top navbar profile */
.profile-image-top {
    width: 32px;
    height: 32px;
    object-fit: cover;
    margin-right: 8px;
    box-shadow: 0 6px 12px rgba(2,6,23,0.16);
    vertical-align: middle;
    border: 2px solid rgba(255,255,255,0.12);
}

/* Default small profile for bottom */
.profile-image { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; }
.nav-label {
    font-weight: 600;
    font-size: 0.82rem;
    line-height: 1;
    display: inline-block;
}
/* Icon sizing for bottom */
.icon { width: 20px; height: 20px; }

/* Nav link visuals */
.nav-link {
    font-weight: 600;
    font-size: 0.85rem;
    padding: 2px 6px;
    color: inherit;
    text-decoration: none;
    transition: color 140ms ease, transform 140ms ease;
}
.nav-link:hover {
    color: #ffdca3;
    transform: translateY(-2px);
    text-shadow: 0 1px 0 rgba(0,0,0,0.12);
}

/* Slightly dim inactive icons/text */
.navbar .nav-link.black { color: #222 !important; }
.navbar .nav-link.primary { color: var(--bs-primary) !important; }
.navbar .nav-link.active.primary { color: var(--bs-primary)!important; }

/* Responsive tweaks */
@media (max-width: 576px) {
    .navbar-bottom { margin: 0 6px 10px 6px; padding: 0.4rem 0.4rem; }
    .profile-pill .profile-image { width: 30px; height: 30px; }
}

.selected {
    background: rgba(0, 102, 204, 0.12);
    padding: 6px;
    border-radius: 16px;
}
</style>