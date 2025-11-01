<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePetStore } from '@/stores/petStore';
import QuickStatsGrid from '@/components/molecules/health/QuickStatsGrid.vue';
import Button from '@/components/atoms/button.vue';
// --- inlined from HomeTemplate (kept here so HomeView is self-contained) ---
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

  <div class="home-view">

    <main class="container py-3">
      <div class="row">
        <div class="col-12 col-lg-8">
          <section class="dashboard mb-3">
            <div class="card template-explorer">
              <div class="card-body p-0">
                <div class="preview p-3">
                  <!-- inlined HomeTemplate content (converted to Bootstrap utilities) -->
                  <div class="template-a sample-home">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <div class="flex-grow-1">
                        <h3 class="mb-1">Welcome to Peddit</h3>
                        <p class="text-muted mb-2">Discover pets, read tips and share moments with other pet lovers.</p>
                        <div class="d-flex gap-2 flex-wrap">
                          <Button outline label="Create a post"></Button>
                          <Button outline label="Explore Meals" color="secondary"></Button>
                        </div>
                      </div>
                      <div class="d-none d-md-flex flex-column text-end ms-3">
                        <div class="mb-1"><strong>1.2k</strong><div class="small text-muted">Members</div></div>
                        <div><strong>384</strong><div class="small text-muted">Posts</div></div>
                      </div>
                    </div>

                    <div class="mb-2"><strong>Pet Dashboard</strong></div>
                    <QuickStatsGrid :stats="statsData" />

                    <section class="feed mt-3">
                      <h5>Latest Posts</h5>

                      <article class="card mb-3">
                        <div class="card-body">
                          <div class="d-flex align-items-center mb-2">
                            <div class="avatar me-2">A</div>
                            <div>
                              <strong>Amy</strong>
                              <div class="small text-muted">2 hours ago</div>
                            </div>
                          </div>
                          <p class="mb-2">Just tried a new meal plan for my Beagle — he loved it! Picture below.</p>
                          <div class="d-flex gap-2 mb-2">
                            <button class="btn btn-link p-0 text-decoration-none text-muted">❤ 12</button>
                            <button class="btn btn-link p-0 text-decoration-none text-muted">💬 4</button>
                          </div>
                          <div>
                            <div class="bg-light rounded p-2 mb-1"><strong>Jo:</strong> Nice — what's the recipe?</div>
                            <div class="bg-light rounded p-2"><strong>Maya:</strong> Share pics pls 😍</div>
                          </div>
                        </div>
                      </article>

                      <article class="card mb-3">
                        <div class="card-body d-flex align-items-start">
                          <div class="avatar me-2">M</div>
                          <div>
                            <strong>Marcus</strong>
                            <div class="small text-muted">Yesterday</div>
                            <p class="mb-0">Adopted a rescue dog last week — here's our first walk together.</p>
                            <div class="mt-2">
                              <button class="btn btn-link p-0 text-decoration-none text-muted me-3">❤ 45</button>
                              <button class="btn btn-link p-0 text-decoration-none text-muted">💬 10</button>
                            </div>
                          </div>
                        </div>
                      </article>
                    </section>

                    <!-- Pet tracking dashboard sample -->
                    <section class="pet-dashboard mt-3">
                      <h5>Your pet dashboard</h5>
                      <div class="row g-2 mt-2">
                        <div class="col-4">
                          <div class="card p-2 text-center">
                            <h6 class="mb-1">Weight</h6>
                            <div class="fw-bold">12.4 kg <small class="text-muted">(Adult)</small></div>
                            <div class="progress mt-2" style="height:8px;"><div class="progress-bar" role="progressbar" style="width:64%"></div></div>
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="card p-2 text-center">
                            <h6 class="mb-1">Activity</h6>
                            <div class="fw-bold">4.5 km/day</div>
                            <div class="progress mt-2" style="height:8px;"><div class="progress-bar bg-info" role="progressbar" style="width:45%"></div></div>
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="card p-2 text-center">
                            <h6 class="mb-1">Hydration</h6>
                            <div class="fw-bold">Good</div>
                            <div class="progress mt-2" style="height:8px;"><div class="progress-bar bg-success" role="progressbar" style="width:82%"></div></div>
                          </div>
                        </div>
                      </div>
                      <div class="mt-2 text-muted">View full health report · Edit profile</div>
                    </section>

                    <!-- Nearby services quick links -->
                    <section class="nearby-services mt-3">
                      <h6>Find nearby</h6>
                      <div class="d-flex gap-2 mt-2">
                        <router-link :to="{ path:'/map', query:{type:'petstore'} }" class="btn btn-outline-secondary btn-sm">Pet stores</router-link>
                        <router-link :to="{ path:'/map', query:{type:'clinic'} }" class="btn btn-outline-secondary btn-sm">Clinics</router-link>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside class="col-12 col-lg-4">
          <!-- quick links kept as a small card area -->
          <section class="quick-links">
            <div class="card">
              <div class="card-body">
                <h5 class="mb-2">Find nearby</h5>
                <div class="d-flex gap-2">
                  <router-link :to="{ path:'/map', query:{type:'petstore'} }" class="btn btn-light flex-fill">Pet stores</router-link>
                  <router-link :to="{ path:'/map', query:{type:'clinic'} }" class="btn btn-light flex-fill">Clinics</router-link>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  </div>
</template>



<style scoped>
.topbar { padding:12px; background:#fff; border-bottom:1px solid #eee; position:sticky; top:0; z-index:10; }
.panel { padding:12px; }
.card { background:#fff; padding:12px; border-radius:10px; }
.grid { display:flex; gap:8px; margin-top:8px; }
.tile { flex:1; padding:10px; background:#f4f6f8; text-align:center; border-radius:8px; text-decoration:none; color:#222; }

/* desktop: layout split */
@media(min-width:900px){
  .panel { display:grid; grid-template-columns: 1fr 320px; gap:16px; }
}

/* template chooser styles */
.template-explorer { display:flex; flex-direction:column; gap:12px; margin-bottom:12px; }
.template-explorer .controls { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.thumbs { display:flex; gap:6px; margin-left:6px; }
.thumb { padding:6px 8px; border-radius:6px; border:1px solid #e6e6e6; background:transparent; cursor:pointer; }
.thumb.active { background:#0d6efd; color:#fff; border-color:transparent; }
.preview { margin-top:8px; }

@media(min-width:900px){
  .template-explorer { flex-direction:row; align-items:flex-start; }
  .template-explorer .controls { width:280px; flex-direction:column; align-items:flex-start; }
  .preview { flex:1; }
}

/* Reduced custom styles — mostly using Bootstrap utilities now */
.avatar { width:40px; height:40px; border-radius:50%; background:#d1d5db; display:inline-flex; align-items:center; justify-content:center; font-weight:700; }
@media(max-width:900px){ .template-a .nearby-services .btn { width:100%; } }
</style>
