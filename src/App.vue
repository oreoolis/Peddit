<script setup>
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
import NavBarBottom from './components/molecules/NavBarBottom.vue';

// Chatbot widget import + flag
import ChatbotWidget from '@/components/ChatbotWidget.vue';
const SHOW_CHATBOT = import.meta.env.VITE_CHATBOT_ENABLED === 'true' // STRICT: only show when explicitly 'true'


// Supabase stuff
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from './stores/authStore';
import { useUserStore } from './stores/userStore';

const authStore = useAuthStore();
const userStore = useUserStore();

onMounted(async () => {
  await authStore.initAuth();

  if(authStore.userId) {
    await userStore.fetchProfile();
  }
});

onUnmounted(() => {
  authStore.cleanup();
});

watch(authStore.userId, async (userId) => {
  if (userId) {
    await userStore.fetchProfile();
  } else {
    userStore.clearProfile();
  }
}, { immediate: false });

</script>

<template>
  <!-- give the root an app-bg class so styles are scoped to the app container -->
  <NavBar />
  <div class="app-bg min-vh-100 d-flex flex-column">
    <div class="router-view flex-grow-1 pb-4 pb-sm-5 mb-5">
      <RouterView />
    </div>
    <ChatbotWidget v-if="SHOW_CHATBOT" />
    <!-- keep NavBarBottom after the main content in DOM order inside the app container; its height is exposed via --nav-bottom-height -->
    <NavBarBottom />
  </div>
</template>

<style>
.app-bg {
  background: linear-gradient(180deg, #f7fbff 0%, #eef7fb 60%, #ffffff 100%);
  position: relative;
  overflow: hidden;
  z-index: 0;
}

/* large slow-pulsing center paw */
.app-bg::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 18%;
  width: min(56vw, 760px);
  height: auto;
  aspect-ratio: 1;
  transform: translateX(-50%);
  background: url('/src/assets/logo-paw.png') center/contain no-repeat;
  opacity: 0.07;
  filter: saturate(0.9) blur(0.6px);
  animation: pulseScale 8s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

/* drifting tiny paw tiles behind content - now moves diagonally */
.app-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('/src/assets/Main_Logo.png');
  background-repeat: repeat;
  background-size: 220px;
  opacity: 0.06; /* subtle */
  transform: translate3d(0,0,0);
  animation: driftDiag 28s linear infinite;
  pointer-events: none;
  z-index: -99;
}

/* animations */
@keyframes pulseScale {
  0%   { transform: translateX(-50%) scale(0.98); opacity: 0.06; }
  50%  { transform: translateX(-50%) scale(1.04); opacity: 0.09; }
  100% { transform: translateX(-50%) scale(0.98); opacity: 0.06; }
}

/* diagonal drift: moves background-position from top-left to bottom-right */
@keyframes driftDiag {
  0%   { background-position: 0   0; }
  50%  { background-position: 600px 400px; } /* mid-way diagonal offset */
  100% { background-position: 1200px 800px; } /* full diagonal travel */
}

/* reserve space at the bottom of the main router area so fixed bottom navbar doesn't overlap content
   Uses the --nav-bottom-height variable set by NavBarBottom (falls back to 56px) */
.router-view {
  padding-bottom: calc(var(--nav-bottom-height, 56px) + 0.5rem);
}
</style>
