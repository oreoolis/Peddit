<script setup>
import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { RouterLink, RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
</script>

<template>
  <div>
    <NavBar />
    <RouterView />
  </div>

</template>

<style>
html, body {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
  width: 100vw;
  position: relative;
}
</style>