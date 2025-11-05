<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import TextInput from '@/components/atoms/TextInput.vue';
import MealPlanCard from '@/components/PetViewComponents/MealPlanCard.vue';
import Button from '@/components/atoms/button.vue';
import BaseAvatar from '@/components/atomic/BaseAvatar.vue';
import RecommendedMeals from '@/components/Organisms/social/RecommendedMeals.vue';
import StatCard from '@/components/atomic/StatCard.vue';
import InfoDetail from '@/components/atomic/InfoDetail.vue';
import useMealSearch from '@/composables/useMealSearch.js';
import MealViewSearchResult from './MealViewSearchResult.vue';
import router from '@/router';
import { usePetNutritionStore } from '@/stores/petNutritionStore';
import { storeToRefs } from 'pinia';
import MealInfoModal from '@/components/PetViewComponents/MealInfoModal.vue';


// TODO: Bern code
const petNutritionStore = usePetNutritionStore();
const { recipeQuery, recipes } = storeToRefs(petNutritionStore);
// provide a local `query` binding used by the template's v-model
const query = recipeQuery;

const featured = computed(() => recipes.value);


// modal state for viewing meal info
const selectedRecipeId = ref(null);
const showMealInfo = ref(false);
// whether the modal should show edit/delete actions
const modalEditable = ref(true);

// carousel refs used in the template
const carouselEl = ref(null);
const carouselInner = ref(null);

// style used to constrain carousel content width (keeps controls visible)
const contentMaxWidth = computed(() => 'min(1100px, 95vw)');

const openMealInfo = (payload) => {
  // payload might be a plain id, or an object like { rec_id }
  if (payload && typeof payload === 'object') {
    selectedRecipeId.value = payload.rec_id ?? payload.id ?? null;
    // if editable was provided, use it; otherwise default true
    modalEditable.value = typeof payload.editable === 'boolean' ? payload.editable : true;
  } else {
    selectedRecipeId.value = payload;
    modalEditable.value = true;
  }
  showMealInfo.value = true;
}

function goToSearchResults(submittedValue) {

  // if (typeof searchNow === 'function') searchNow(term);
  recipeQuery.value = submittedValue;

  // navigate to search results view with query param
  router.push({
    name: 'SearchResults',
    query: { q: recipeQuery.value }
  });
}

onMounted(async () => {
  try {
    await petNutritionStore.fetchRecipes();
    // debug - shows what the store returned
  } catch (err) {

  }
});

</script>

<template>
  <main class="">
    <h1 class="text-center headingFont mb-3">Search Meal Plans</h1>
    <div class="d-flex justify-content-center mb-3"><TextInput label="Search" v-model="query" class="w-75" @submit="goToSearchResults" /></div>

    <!-- fade carousel, center slide and add visual lift -->
    <div id="featuredCarousel" ref="carouselEl" class="carousel carousel-fade mb-4" data-bs-ride="carousel" data-bs-interval="5000">
      <h1 class="text-center headingFont bg-primary text-white py-2">Popular Meal Plans</h1>
      <div class="carousel-inner text-center bg-primary-light" ref="carouselInner">
        <div v-if="!featured">Nothing</div>
    <div v-for="(f, idx) in featured" 
  :key="f.id" 
  :class="['carousel-item', {active: idx===0}]">
          <!-- centered content container: keeps content away from the very edges so controls stay visible -->
          <div class="carousel-content-container w-100 py-3 px-2">
            <div class="carousel-content mx-auto d-flex flex-column flex-md-row align-items-center justify-content-center" :style="{ maxWidth: contentMaxWidth }">
              <!-- LEFT: feature panel -->
              <div class="feature-panel p-5 mb-3  text-center text-md-start">
                <StatCard 
                :label="f.recipe_name ?? ''" 
                value="" 
                :unit="f.notes ?? ''" 
                size="sm" highlight />
                <div class="mt-3">
                  <InfoDetail label="Pet Type and Breed" :value="(f.pet_kind || '') + (f.pet_breed ? ' - ' + f.pet_breed : '')"/>
                  <InfoDetail label="Likes" :value="f.likes ?? 0"/>
                </div>
                <p class="text-muted mt-2 fs-5">Created by @{{ f.profiles.display_name }}
                    <base-avatar
                    :src="f.profiles.avatar_url" size="xs">
                    </base-avatar>
                </p>


              </div>

              <!-- RIGHT: card -->
              <div class="carousel-card d-flex" style="max-width:420px;">
                <MealPlanCard 
                :editable="false" 
                :name="f.recipe_name"
                :rec_id="f.id" 
                :desc="f.description" 
                :petKind="f.pet_kind" 
                @open-meal-info="openMealInfo" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- keep outer edge controls at very edges -->
      <button class="carousel-control-prev" type="button" data-bs-target="#featuredCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#featuredCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>
 
     <!-- TODO: Need to insert Plans here into RecommendedMeals -->
      <div v-if="!featured">Nothing</div>
      <RecommendedMeals
        :plans="featured"
        @open-meal-info="openMealInfo"
      ></RecommendedMeals>
      
    <!-- Meal info modal -->
    <MealInfoModal v-model:show="showMealInfo" :rec_id="selectedRecipeId ?? '' " :editable="modalEditable" />
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
  width: 80% !important;
  height: 100% !important;
}

/* keep carousel fade transition smooth */
.carousel-fade .carousel-item { transition: opacity .45s ease; }

/* center content inside a fixed-width container so controls at edges remain visible */
.carousel-content-container { width: 100%; }
.carousel-content { gap: 1.25rem; align-items: center; }
/* tune maximum inner content width (adjust to taste) */
.carousel-content { max-width: 1100px; margin: 0 auto; }

/* ensure outer controls sit above content and remain clickable */
#featuredCarousel .carousel-control-prev,
#featuredCarousel .carousel-control-next {
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  background-color:rgba(255, 255, 255, 0.096); 
  height: 64px;
  min-width: 56px;
}

/* feature panel + card sizing */
.feature-panel { 
    min-width:260px; 
    justify-self:flex-end;
}
@media(min-width:768px){ .feature-panel{ width:40% } .carousel-card{ width:56% } }


</style>

