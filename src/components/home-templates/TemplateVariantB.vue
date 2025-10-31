<template>
  <div class="template-b sample-mag">
    <header class="mag-header">
      <div>
        <h2>Explore posts — Magazine</h2>
        <p class="muted">An image-forward grid that feels like a magazine homepage.</p>
      </div>
      <div>
        <input placeholder="Search posts" class="search" />
      </div>
    </header>

    <section class="mag-grid">
      <article class="mag-card large">
        <div class="media"/>
        <h3>How to read pet labels</h3>
        <p class="muted">Quick guide to choosing the right kibble.</p>
      </article>

      <article class="mag-card">
        <div class="media small"/>
        <h4>Best treats of 2025</h4>
      </article>

      <article class="mag-card">
        <div class="media small alt"/>
        <h4>Puppy training 101</h4>
      </article>

      <article class="mag-card">
        <div class="media small alt2"/>
        <h4>Community stories</h4>
      </article>
    </section>

    <footer class="mag-footer muted">Tip: click a card to open detailed view (sample only).</footer>

    <div class="mag-extras">
      <div class="pet-widget">
        <div style="display:flex; gap:10px; align-items:center;">
          <div class="avatar">C</div>
          <div>
            <strong>Charlie</strong>
            <div class="muted">3 y · Labrador</div>
          </div>
        </div>
        <div class="small-stat">
          <div>Weight: <strong>28kg</strong></div>
          <div>Activity: <strong>5km</strong></div>
        </div>
      </div>

      <div class="service-list">
        <div class="service-tile">Pet stores</div>
        <div class="service-tile">Clinics</div>
        <div class="service-tile">Groomers</div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.sample-mag { display:flex; flex-direction:column; gap:12px; }
.mag-header { display:flex; justify-content:space-between; align-items:center; }
.search { padding:8px 10px; border-radius:8px; border:1px solid #e6e6e6; }
.mag-grid { display:grid; grid-template-columns: 2fr 1fr 1fr; gap:12px; }
.mag-card { background:#fff; padding:10px; border-radius:10px; box-shadow:0 6px 14px rgba(0,0,0,0.04); }
.mag-card.large { grid-column:1 / 2; }
.media { height:140px; border-radius:8px; background:linear-gradient(135deg,#fff4f0,#fffaf0); margin-bottom:8px; }
.media.small { height:80px; }
.media.alt { background:linear-gradient(135deg,#e8f6ff,#eefcfa); }
.media.alt2 { background:linear-gradient(135deg,#f0f7ff,#f8f0ff); }
.mag-footer { padding-top:6px; }

@media(max-width:900px){ .mag-grid { grid-template-columns:1fr; } }
</style>


<style scoped>
.mag-extras { margin-top:12px; display:flex; gap:10px; }
.pet-widget { background:#fff; padding:10px; border-radius:8px; width:220px; box-shadow:0 6px 12px rgba(0,0,0,0.04); }
.pet-widget .avatar { width:56px; height:56px; border-radius:50%; background:#d1d5db; display:inline-flex; align-items:center; justify-content:center; font-weight:700; }
.pet-widget .small-stat { display:flex; gap:8px; margin-top:8px; }
.service-list { display:flex; gap:8px; align-items:center; }
.service-tile { background:#f4f6f8; padding:8px 10px; border-radius:8px; }
</style>
