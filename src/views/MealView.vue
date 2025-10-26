<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import TextInput from '@/components/atoms/TextInput.vue';
import MealPlanCard from '@/components/PetViewComponents/MealPlanCard.vue';

const featured = Array.from({length:5}).map((_,i)=>(
    { id:`f${i}`, name:`Feature ${i+1}`, desc:'Popular pick' }));
const recommended = Array.from({length:8}).map((_,i)=>(
    { id:`r${i}`, name:`Rec ${i + 1}`, desc:'Suggested' }));

const carouselEl = ref(null);
const carouselInner = ref(null);
let ro = null;

async function measureAndLockHeight() {
  await nextTick();
  try {
    const inner = carouselInner.value;
    if (!inner) return;
    const items = Array.from(inner.querySelectorAll('.carousel-item'));
    if (!items.length) return;
    // measure rendered heights of each slide's content
    let max = 0;
    for (const it of items) {
      // measure the visible content inside the slide
      const content = it.querySelector('.w-100') || it;
      const h = content.getBoundingClientRect().height;
      if (h > max) max = h;
    }
    inner.style.height = max ? `${Math.ceil(max)}px` : '';
  } catch (e) { /* ignore measurement errors */ }
}

onMounted(() => {
  // initial measure
  measureAndLockHeight();
  // update on resize
  window.addEventListener('resize', measureAndLockHeight);
  // observe DOM changes in carousel (images loading, async content)
  try {
    ro = new ResizeObserver(measureAndLockHeight);
    const el = carouselEl.value;
    if (el) ro.observe(el);
  } catch (e) {}
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureAndLockHeight);
  if (ro) ro.disconnect();
});
</script>

<template>
  <main class="">
    <h1 class="text-center headingFont mb-3">Search Meal Plans</h1>
    <div class="d-flex justify-content-center mb-3"><TextInput label="Search" class="w-75"/></div>

    <!-- fade carousel, center slide and add visual lift -->
    <div id="featuredCarousel" ref="carouselEl" class="carousel carousel-fade mb-4" data-bs-ride="carousel" data-bs-interval="5000">
        <h1 class="text-center headingFont bg-primary text-white py-2">Popular Meal Plans</h1>
      <div class="carousel-inner text-center bg-primary-light" ref="carouselInner">
         <div v-for="(f, idx) in featured" :key="f.id" :class="['carousel-item', {active: idx===0}]">
          <div class="d-flex flex-column flex-md-row align-items-center mx-5 py-3 px-2">
            <!-- Text panel -->
            <div class="carousel-text-panel  text-center text-md-end">
              <h3 class="mb-1">{{ f.name }}</h3>
              <p class="small text-muted mb-2">{{ f.desc }}</p>
              <ul class="list-unstyled small mb-3">
                <li>• Balanced nutrition</li>
                <li>• Age specific</li>
                <li>• Vet approved</li>
              </ul>
              <div class="d-flex justify-content-center justify-content-md-end gap-2 pb-2">
                <button class="btn btn-primary btn-sm">View Plan</button>
                <button class="btn btn-outline-light btn-sm">Save</button>
              </div>
            </div>

            <!-- Card -->
            <div class="carousel-card mx-auto d-flex" style="max-width:420px;">
              <MealPlanCard
                :name="f.name"
                :rec_id="f.id"
                :desc="f.desc"
                style="width:100% !important; height:100% !important; margin:0 !important; display:block !important;"
              />
            </div>
          </div>
         </div>
      </div>
       <button class="carousel-control-prev" type="button" data-bs-target="#featuredCarousel" data-bs-slide="prev">
         <span class="carousel-control-prev-icon"></span>
       </button>
       <button class="carousel-control-next" type="button" data-bs-target="#featuredCarousel" data-bs-slide="next">
         <span class="carousel-control-next-icon"></span>
       </button>
     </div>
 
     <!-- Recommended: GRID (variant 1) -->
     <section class="mx-auto">
        <h1 class="text-center headingFont bg-primary text-white py-2 ">Recommended</h1>
       <div class=" py-4 row recommend-grid row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 d-flex justify-content-center">
         <div v-for="r in recommended" :key="r.id" class=" col">
           <div class="card-wrapper w-100 justify-content-center">
             <MealPlanCard :name="r.name" :rec_id="r.id" :desc="r.desc" class="w-100"/>
           </div>
         </div>
       </div>
     </section>
   </main>
</template>

<style scoped>
/* ensure slides overlap instead of stacking during transition and keep inner stable */

/* optional: avoid double-render artifacts from internal transitions */

/* carousel wrapper: neutral background, card fills it */
.carousel-inner { background: transparent; }
/* keep wrapper neutral and force the component element to behave as block-level full size */
.carousel-card {
  padding: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  max-height: 520px; /* safety cap so long cards don't blow up layout */
}

/* best-effort fallback for browsers: style the custom element tag too */
.carousel-card > meal-plan-card {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

/* keep carousel fade transition smooth */
.carousel-fade .carousel-item { transition: opacity .45s ease; }

/* Recommended grid tweaks remain... */
.recommend-grid .card-wrapper { display:flex; align-items:stretch; }
.recommend-grid .card-wrapper .recipeCard {
  width: 100% !important;
  height: auto !important;
  min-height: 240px;
  margin-bottom: 0;
}

.carousel-text-panel{
  width:100%;
  background:transparent;
  color:var(--bs-body-color);
}
@media(min-width:768px){
  .carousel-text-panel{ width:40%; padding-right:1rem; }
  .carousel-card{ width:56%; }
}
.carousel-text-panel h3{ font-weight:600; margin-bottom:.25rem; }
.carousel-text-panel ul li{ color:rgba(255,255,255,0.85); }
</style>