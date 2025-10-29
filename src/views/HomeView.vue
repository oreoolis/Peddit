<script setup>
import { ref } from 'vue';
import HealthView from './HealthView.vue';
const tab = ref('dash');
</script>

<template>

// IM NOT SURE HOW HOME VIEW LIKES YET BUT THIS IS THE DESIGN IM THINKING OF
Idk the original design might not be enough to bring out our main features
  <div class="home-tabs">
    <header class="topbar">
      <h4>Peddit</h4>
    </header>

    <div class="tabs">
      <button :class="{active: tab==='dash'}" @click="tab='dash'">Dashboard</button>
      <button :class="{active: tab==='feed'}" @click="tab='feed'">Feed</button>
      <button :class="{active: tab==='map'}" @click="tab='map'">Map</button>
    </div>

    <main class="panel">
      <section v-if="tab==='dash'">
        <HealthView />
      </section>

      <section v-if="tab==='feed'">
        <h2>Theres nothing here now</h2>
      </section>

      <section v-if="tab==='map'">
        <div class="card">
          <h5>Find nearby</h5>
          <div class="grid">
            <router-link :to="{ path:'/map', query:{type:'petstore'} }" class="tile">Pet stores</router-link>
            <router-link :to="{ path:'/map', query:{type:'clinic'} }" class="tile">Clinics</router-link>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>



<style scoped>
.topbar { padding:12px; background:#fff; border-bottom:1px solid #eee; position:sticky; top:0; z-index:10; }
.tabs { display:flex; gap:6px; padding:8px; background:#fafafa; border-bottom:1px solid #eee; }
.tabs button { flex:1; padding:10px; border-radius:8px; background:transparent; border:none; font-weight:600; color:#666; }
.tabs button.active { background:#0d6efd; color:#fff; box-shadow:0 6px 12px rgba(13,110,253,0.12); }
.panel { padding:12px; }
.card { background:#fff; padding:12px; border-radius:10px; }
.grid { display:flex; gap:8px; margin-top:8px; }
.tile { flex:1; padding:10px; background:#f4f6f8; text-align:center; border-radius:8px; text-decoration:none; color:#222; }

/* desktop: tabs become horizontal split */
@media(min-width:900px){
  .panel { display:flex; gap:16px; }
  .panel > section { flex:1; }
}
</style>
