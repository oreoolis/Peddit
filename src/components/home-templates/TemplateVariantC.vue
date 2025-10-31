<template>
  <div class="template-c sample-two-col">
    <div class="split">
      <aside class="sidebar card">
        <h4>Recommended</h4>
        <ul>
          <li>Nearby vets</li>
          <li>Adoption centres</li>
          <li>Healthy recipes</li>
        </ul>

        <div class="mini-card">
          <h5>Upcoming event</h5>
          <p class="muted">Dog meetup — Sunday 10am</p>
        </div>

        <!-- Pet tracker compact -->
        <div class="pet-tracker">
          <h5>Your pet</h5>
          <div style="display:flex; gap:8px; align-items:center;">
            <div class="avatar">B</div>
            <div>
              <strong>Buddy</strong>
              <div class="muted">2 y · Beagle</div>
            </div>
          </div>
          <div class="tracker-stats">
            <div>Last fed: <strong>2h ago</strong></div>
            <div>Walks today: <strong>1</strong></div>
          </div>
          <div style="margin-top:8px;"><router-link :to="{ path:'/pet/1' }" class="tile">Open pet dashboard</router-link></div>
        </div>

        <!-- Quick map links inside sidebar -->
        <div style="margin-top:10px;">
          <h5>Nearby services</h5>
          <div class="grid">
            <router-link :to="{ path:'/map', query:{type:'petstore'} }" class="tile">Pet stores</router-link>
            <router-link :to="{ path:'/map', query:{type:'clinic'} }" class="tile">Clinics</router-link>
          </div>
        </div>
      </aside>

      <section class="main-feed">
        <div class="feed-top">
          <h3>Stories</h3>
          <p class="muted">Long-form posts and guides for pet care.</p>
        </div>

        <article class="post">
          <div class="post-head">
            <div class="avatar">J</div>
            <div class="meta"><strong>Jo</strong><small> · 3 days ago</small></div>
          </div>
          <div class="post-body">Today I tried a new routine for grooming my rabbit — step-by-step and what worked for us.</div>
        </article>

        <article class="post">
          <div class="post-head">
            <div class="avatar">S</div>
            <div class="meta"><strong>Sam</strong><small> · 1 week ago</small></div>
          </div>
          <div class="post-body">A comprehensive guide to travelling with pets — packing, stops, and safety.</div>
        </article>
      </section>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.sample-two-col .split { display:flex; gap:12px; }
.sidebar { width:260px; padding:12px; }
.mini-card { margin-top:10px; background:#fff; padding:8px; border-radius:8px; }
.main-feed { flex:1; display:flex; flex-direction:column; gap:12px; }
.post { background:#fff; padding:12px; border-radius:10px; box-shadow:0 6px 14px rgba(0,0,0,0.04); }
.post-head { display:flex; gap:10px; align-items:center; }
.avatar { width:44px; height:44px; border-radius:50%; background:#d1d5db; display:flex; align-items:center; justify-content:center; font-weight:700; }
.post-body { margin-top:8px; }

@media(max-width:700px){ .sample-two-col .split { flex-direction:column; } .sidebar{ width:100%; } }
</style>
