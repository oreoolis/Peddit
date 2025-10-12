<script setup>
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';

// Supabase stuff
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from './stores/authStore';

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
onMounted(async () => {
  await authStore.initAuth();
});

onUnmounted(() => {
  authStore.cleanup();
});
// End Supabase stuff

</script>

<template>
  <!-- <header> -->
    <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" /> -->

    <div id="app">
      <NavBar />
      <div class="router-view">
        <RouterView />
      </div>
    </div>
    <!-- <main>
    <div class="container pt-2 pb-4">
      <Account v-if="session" :session="session" />
      <Auth v-else />
    </div>
    <TheWelcome />
    <ul>
      <li v-for="instrument in instruments" :key="instrument.id">{{ instrument.name }}</li>
    </ul>
  </main> -->
</template>
