<script setup>
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import TheWelcome from './components/TheWelcome.vue';
import NavBar from './components/NavBar.vue';

// Supabase stuff
import { ref, onMounted } from 'vue';
import { supabase } from './lib/supabaseClient';
import Auth from './components/Auth.vue';
import Account from './components/Account.vue';

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
const session = ref();
onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
  });

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
  });
})
// End Supabase stuff

</script>

<template>
  <!-- <header> -->
  <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" /> -->

  <!-- LG breakpoint, Desktop -->
  <div id="app" class="min-vh-100 d-flex flex-column bg-white">
    <NavBar />
    <div class="router-view flex-grow-1 pb-4 pb-sm-5">
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
