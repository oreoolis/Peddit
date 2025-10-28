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
  <div>
    <!-- Top navbar (hidden on small screens) -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow d-none d-lg-flex">
      <div class="container-fluid">
        <RouterLink to="/home" class="navbar-brand fw-bold text-white pe-4">Peddit</RouterLink>

        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><RouterLink class="nav-link" to="/home">Home</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/about">About</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/login">Login</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/health">Health</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/profile">Profile</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/meal">Meal</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/pet">Pet</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/social">Social</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/map">Map</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/temp">Temp</RouterLink></li>
          </ul>

          <div class="d-flex align-items-center gap-2">
            <RouterLink v-if="isLoggedIn" to="/profile" class="btn btn-sm btn-outline-light d-flex align-items-center gap-2">
              <img :src="displayAvatar" alt="avatar" class="rounded-circle avatar-sm" />
              <span class="d-none d-xl-inline text-white">Profile</span>
            </RouterLink>

            <RouterLink v-else to="/login" class="btn btn-sm btn-outline-light">Sign in</RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Keep bottom/mobile nav component (if you use it) -->
    <NavBarBottom />
  </div>
</template>

<style scoped>
/* Minimal overrides — prefer Bootstrap utilities where possible */

/* small avatar used in the top navbar */
.avatar-sm {
  width: 36px;
  height: 36px;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.14);
}

/* subtle hover for links */
.nav-link {
  transition: color 140ms ease, transform 140ms ease;
}
.nav-link:hover {
  color: #ffdca3 !important;
  transform: translateY(-2px);
}

/* small helper to highlight the active item (use Bootstrap .active if preferred) */
.navbar .nav-link.active {
  background: rgba(255,255,255,0.06);
  border-radius: 8px;
  padding: 6px 8px;
}
</style>