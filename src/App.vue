<script setup>
import 'bootstrap/dist/css/bootstrap.css'
import { RouterLink, RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
</script>

<template>
  <div id="app" class="w-100">
    <NavBar />
    <div class="router-view">
      <RouterView />
    </div>
  </div>

</template>
<style>
*{
  margin: 0 !important;
}
</style>

