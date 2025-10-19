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

// Database example use
// const instruments = ref([]);
// async function getInstruments(){
//   const { data } = await supabase.from('instruments').select();
//   instruments.value = data;
// }
// onMounted(() => {
//   getInstruments()
// })

// Auth example
// const session = ref();
// onMounted(() => {
//   supabase.auth.getSession().then(({ data }) => {
//     session.value = data.session;
//   });

//   supabase.auth.onAuthStateChange((_, _session) => {
//     session.value = _session;
//   });
// })

const authStore = useAuthStore();
const userStore = useUserStore();

onMounted(async () => {
  await authStore.initAuth();

  if(authStore.userId) {
    await userStore.fetchProfile(authStore.userId);
  }
});

onUnmounted(() => {
  authStore.cleanup();
});

watch(
  () => authStore.userId,
  (userId) => {
    if(userId){
      userStore.fetchProfile(userId);
    } else {
      userStore.clearProfile();
    }
  }
);
// End Supabase stuff

</script>

<template>
  <!-- <header> -->
  <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" /> -->
   <NavBar></NavBar>
  <!-- LG breakpoint, Desktop -->
  <div id="app" class="min-vh-100 d-flex flex-column bg-white">
    <NavBarBottom></NavBarBottom>
    <div class="router-view flex-grow-1 pb-4 pb-sm-5">
      <RouterView />
    </div>

    <!-- NEW: floating chat bubble/panel -->
    <ChatbotWidget v-if="SHOW_CHATBOT" />
  </div>

  <!-- 
    <main>
      <div class="container pt-2 pb-4">
        <Account v-if="session" :session="session" />
        <Auth v-else />
      </div>
      <TheWelcome />
      <ul>
        <li v-for="instrument in instruments" :key="instrument.id">{{ instrument.name }}</li>
      </ul>
    </main> 
    -->
</template>
