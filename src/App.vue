<script setup>
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import TheWelcome from './components/TheWelcome.vue';
import NavBar from './components/NavBar.vue';

// Chatbot widget import + flag
import ChatbotWidget from '@/components/ChatbotWidget.vue';
const SHOW_CHATBOT = import.meta.env.VITE_CHATBOT_ENABLED !== 'false';

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

    <div id="app">
      <NavBar />
      <div class="router-view">
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
