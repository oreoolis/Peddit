<script setup>
import { ref } from 'vue';
import HealthView from './HealthView.vue';
import TemplateVariantA from '../components/home-templates/TemplateVariantA.vue';
import TemplateVariantB from '../components/home-templates/TemplateVariantB.vue';
import TemplateVariantC from '../components/home-templates/TemplateVariantC.vue';

// template chooser state (now primary on the Home page)
const selectedTemplate = ref('A');
const templates = [
  { id: 'A', name: 'Classic', comp: TemplateVariantA },
  { id: 'B', name: 'Card grid', comp: TemplateVariantB },
  { id: 'C', name: 'Two-column', comp: TemplateVariantC }
];
const templatesMap = {
  A: TemplateVariantA,
  B: TemplateVariantB,
  C: TemplateVariantC
};
</script>

<template>

  <div class="home-view">
    <header class="topbar">
      <h4>Peddit</h4>
    </header>

    <main class="panel">
      <section class="dashboard">
        <div class="template-explorer card">
          <div class="controls">
            <label style="font-weight:600; margin-right:8px">Choose template:</label>
            <select v-model="selectedTemplate">
              <option v-for="t in templates" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>

            <div class="thumbs">
              <button v-for="t in templates" :key="t.id" @click="selectedTemplate = t.id" :class="{active: selectedTemplate===t.id}" class="thumb">{{ t.id }}</button>
            </div>
          </div>

          <div class="preview">
            <component :is="templatesMap[selectedTemplate]" />
          </div>
        </div>

        <!-- keep HealthView for reference below the template preview -->
        <!-- <HealthView /> -->
      </section>

      <!-- quick links kept as a small card area -->
      <section class="quick-links">
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
</style>
