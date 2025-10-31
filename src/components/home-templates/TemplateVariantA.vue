<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePetStore } from '@/stores/petStore';
import QuickStatsGrid from '@/components/molecules/health/QuickStatsGrid.vue';

// keep QuickStatsGrid data synced with the pet store
const petStore = usePetStore();
const { pets } = storeToRefs(petStore);

const healthyPetsCount = computed(() => {
  if (!pets.value) return 0;
  return pets.value.filter(pet => {
    const scale = pet.body_condition_scale;
    if (!scale) return 0;
    return scale >= 4 && scale <= 6;
  }).length;
});

const needsAttentionCount = computed(() => {
  if (!pets.value) return 0;
  return pets.value.filter(pet => {
    const scale = pet.body_condition_scale;
    if (!scale) return 1;
    return scale < 4 || scale > 6;
  }).length;
});

const neuteredCount = computed(() => {
  if (!pets.value) return 0;
  return pets.value.filter(pet => pet.neutered).length;
});

const statsData = computed(() => [
  { icon: 'heart-fill', value: pets.value?.length || 0, label: 'Total Pets', variant: 'primary' },
  { icon: 'shield-fill-check', value: healthyPetsCount.value, label: 'Healthy', variant: 'success' },
  { icon: 'exclamation-triangle-fill', value: needsAttentionCount.value, label: 'Needs Attention', variant: 'warning' },
  { icon: 'calendar-check', value: neuteredCount.value, label: 'Neutered', variant: 'info' }
]);
</script>

<template>
  <div class="template-a sample-home">
    <div class="hero">
      <div class="hero-left">
        <h1>Welcome to Peddit</h1>
        <p class="muted">Discover pets, read tips and share moments with other pet lovers.</p>
        <div class="hero-actions">
          <button class="btn">Create a post</button>
          <button class="btn">Explore meals</button>
        </div>
      </div>
      <div class="hero-right">
        <div class="stats">
          <div class="stat"><strong>1.2k</strong><span>Members</span></div>
          <div class="stat"><strong>384</strong><span>Posts</span></div>
        </div>
      </div>
    </div>
    <div>Pet Dashboard</div>
    <QuickStatsGrid :stats="statsData" />
    

    <section class="feed">
      <h3>Latest Posts</h3>

      <article class="post">
        <div class="meta">
          <div class="avatar">A</div>
          <div class="info"><strong>Amy</strong><small> · 2 hours ago</small></div>
        </div>
        <div class="body">Just tried a new meal plan for my Beagle — he loved it! Picture below.</div>
        <div class="actions">
          <button class="btn-muted">❤ 12</button>
          <button class="btn-muted">💬 4</button>
        </div>
        <div class="comments">
          <div class="comment"><strong>Jo:</strong> Nice — what's the recipe?</div>
          <div class="comment"><strong>Maya:</strong> Share pics pls 😍</div>
        </div>
      </article>

      <article class="post">
        <div class="meta">
          <div class="avatar">M</div>
          <div class="info"><strong>Marcus</strong><small> · Yesterday</small></div>
        </div>
        <div class="body">Adopted a rescue dog last week — here's our first walk together.</div>
        <div class="actions">
          <button class="btn-muted">❤ 45</button>
          <button class="btn-muted">💬 10</button>
        </div>
      </article>
    </section>

    <!-- Pet tracking dashboard sample -->
    <section class="pet-dashboard">
      <h3>Your pet dashboard</h3>
      <!-- quick stats grid (synced with pet store) -->
      
      <div class="dash-grid">
        <div class="dash-card">
          <h4>Weight</h4>
          <div class="stat">12.4 kg <small class="muted">(Adult)</small></div>
          <div class="progress"><div class="fill" style="width:64%"></div></div>
        </div>

        <div class="dash-card">
          <h4>Activity</h4>
          <div class="stat">4.5 km/day</div>
          <div class="progress"><div class="fill" style="width:45%"></div></div>
        </div>

        <div class="dash-card">
          <h4>Hydration</h4>
          <div class="stat">Good</div>
          <div class="progress"><div class="fill" style="width:82%"></div></div>
        </div>
      </div>
      <div class="dash-links muted">View full health report · Edit profile</div>
    </section>

    <!-- Nearby services quick links -->
    <section class="nearby-services">
      <h4>Find nearby</h4>
      <div class="grid links">
        <router-link :to="{ path:'/map', query:{type:'petstore'} }" class="tile">Pet stores</router-link>
        <router-link :to="{ path:'/map', query:{type:'clinic'} }" class="tile">Clinics</router-link>
        <router-link :to="{ path:'/map', query:{type:'groomer'} }" class="tile">Groomers</router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sample-home { display:flex; flex-direction:column; gap:14px; }
.hero { display:flex; justify-content:space-between; gap:12px; padding:18px; background:linear-gradient(90deg,#fbfdff,#eef7ff); border-radius:12px; align-items:center; }
.hero-left h1 { margin:0 0 6px 0; }
.muted { color:#6b7280; margin:0; }
.hero-actions { margin-top:10px; display:flex; gap:8px; }
.btn { padding:8px 12px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; cursor:pointer; }
.btn.primary { background:#0d6efd; color:#fff; border-color:transparent; }
.stats { display:flex; gap:8px; }
.stat { background:#fff; padding:8px 12px; border-radius:8px; text-align:center; }
.grid-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
.card { background:#fff; padding:12px; border-radius:10px; box-shadow:0 6px 14px rgba(0,0,0,0.04); }
.card-media { height:90px; border-radius:8px; background:linear-gradient(135deg,#ffe8e8,#fff4e6); margin-bottom:8px; }
.card-media.alt { background:linear-gradient(135deg,#e8f6ff,#eefcfa); }
.card-media.alt2 { background:linear-gradient(135deg,#f0f7ff,#f8f0ff); }
.feed { margin-top:6px; display:flex; flex-direction:column; gap:12px; }
.post { background:#fff; padding:12px; border-radius:10px; display:flex; flex-direction:column; gap:8px; }
.meta { display:flex; gap:10px; align-items:center; }
.avatar { width:40px; height:40px; border-radius:50%; background:#d1d5db; display:flex; align-items:center; justify-content:center; font-weight:700; }
.actions { display:flex; gap:8px; }
.btn-muted { background:transparent; border:none; color:#6b7280; cursor:pointer; }

.comments { padding:8px 0 0 48px; display:flex; flex-direction:column; gap:6px; }
.comment { background:#f8fafc; padding:8px; border-radius:8px; font-size:0.95rem; }

.pet-dashboard { margin-top:12px; }
.dash-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:8px; }
.dash-card { background:#fff; padding:10px; border-radius:8px; }
.stat { font-size:1.1rem; margin:6px 0; }
.progress { height:10px; background:#eef2ff; border-radius:6px; overflow:hidden; }
.progress .fill { height:100%; background:#0d6efd; }
.dash-links { margin-top:8px; }

.nearby-services { margin-top:12px; }
.links .tile { flex:none; padding:8px 10px; }

@media(max-width:900px){ .grid-cards { grid-template-columns:1fr; } }
</style>
