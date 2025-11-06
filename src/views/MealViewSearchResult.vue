<script setup>
import { watch, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TextInput from '@/components/atoms/TextInput.vue';
import MealPlanCard from '@/components/PetViewComponents/MealPlanCard.vue';
import useMealSearch from '@/composables/useMealSearch.js';
import BaseBadge from '@/components/atomic/BaseBadge.vue';
import BaseAvatar from '@/components/atomic/BaseAvatar.vue';
import BaseLabel from '@/components/atomic/BaseLabel.vue';
import BaseStatNumber from '@/components/atomic/BaseStatNumber.vue';
import Button from '@/components/atoms/button.vue';
import RecipeSearch from '@/components/social/RecipeSearch.vue';
import ShareButton from '@/components/Organisms/social/ShareButton.vue';
import { usePetNutritionStore } from '@/stores/petNutritionStore';
import { storeToRefs } from 'pinia';
const route = useRoute();
const router = useRouter();
const initialQuery = route.query.q || '';


const petNutritionStore = usePetNutritionStore();
const { recipePostQuery, filteredRecipePosts: foundPosts, loading } = storeToRefs(petNutritionStore);

const visibleItems = ref([]);

// simple batch mount helper (call when results change)
function mountInBatches(items, batchSize = 6, delay = 50) {
  visibleItems.value = [];
  let i = 0;
  function step() {
    const next = items.slice(i, i + batchSize);
    visibleItems.value.push(...next);
    i += batchSize;
    if (i < items.length) setTimeout(step, delay);
  }
  step();
}

watch(foundPosts, (newList) => {
  if (!newList) visibleItems.value = [];
  else mountInBatches(newList, 6, 40);


});

// run initial search if q present
onMounted(() => {
  petNutritionStore.fetchRecipes();
  petNutritionStore.fetchAllRecipePost();
  if (initialQuery) recipePostQuery.value = initialQuery;

});

// react to query param changes (browser back/forward or external navigation)
watch(() => route.query.q, (q) => {
  recipePostQuery.value = q || '';
  if (q) recipePostQuery.value = q;
  else {
    // clear results or re-seed if desired
    // results.value = [];
  }
});

// helper called by the TextInput submit button (or parent)
function goToSearchResults(submittedValue) {
  const term = (typeof submittedValue === 'string' && submittedValue.trim().length)
    ? submittedValue.trim()
    : (recipePostQuery.value ?? '').toString().trim();

  // if blank, navigate to route without q (optional)
  const target = term ? { name: 'SearchResults', query: { q: term } } : { name: 'SearchResults', query: {} };

  // push new route (this updates route.query and triggers the watcher above)
  router.push(target).catch(() => { /* ignore NavigationDuplicated */ });

  // also trigger an immediate search so results populate fast
  if (term) recipePostQuery.value = term;
}

function aggregateNutritionFromRecipe(recipe) {
  if (!recipe?.recipe_ingredients) return {};
  const totals = {};
  recipe.recipe_ingredients.forEach(ri => {
    const qty = Number(ri.quantity_g || 0);
    const factor = qty / 100; // nutrition values are per-100g
    const nut = ri.food_ingredients?.nutrition || {};
    Object.entries(nut).forEach(([key, info]) => {
      if (!info) return;
      const v = (Number(info.value) || 0) * factor;
      const unit = info.unit || '';
      if (!totals[key]) totals[key] = { value: 0, unit };
      totals[key].value += v;
    });
  });
  // round results
  Object.keys(totals).forEach(k => {
    totals[k].value = Math.round((totals[k].value + Number.EPSILON) * 100) / 100;
  });
  return totals; // shape: { fat: {unit:'g', value: 1.23}, iron: {unit:'mg', value: 0.7}, ... }
}
</script>

<template>
  <main class="p-3 ">
    <h1 class="text-center headingFont my-3">Search Meal Plans</h1>
    <div class="d-flex justify-content-center mb-3">
      <!-- keep TextInput unchanged: listen to its submit event and handle in this view -->
      <TextInput label="Search" :modelValue="recipePostQuery" @submit="goToSearchResults" class="w-75" />
      <!-- If your TextInput does not support modelValue/v-model, it still should emit submit(value);
           goToSearchResults will use submitted value when provided. -->
    </div>
    <header class="section-header border-bottom mb-2 d-flex w-75 mx-auto">
      <BaseBadge pill variant="info" class="px-3 fs-5 my-2 mx-3">Posts</BaseBadge>
      <h1 class="section-title pb-2">Search results for "{{ recipePostQuery }}"</h1>
      
    </header>
    <!-- New Post Design For found result, with User Info, Score and other good things, we can reuse some information -->
     <!-- Reusable Information name, desc, animal, breed, price_per_week: likes, username, user_image -->
    <RecipeSearch class="mx-3 mb-3 w-75 mx-auto"
      v-for="(post, idx) in foundPosts"
      :key="post.id + '-' + idx"
      :RecipeId="post.id"
      :Username="post.profiles.display_name"
      :User_Image="post.profiles.avatar_url"
      :Recipe_Name="post.recipes.recipe_name"
      :Recipe_Desc="post.recipes.description"
      :Vote_score="post.vote_score"
      :Comment_count="post.comment_count"
      :Animal_Type="post.recipes.pet_kind"
      :Animal_Breed="post.recipes.pet_breed"
      :Cost_Per_Week="post.recipes.price_per_week"
      :Recipe_Nutrition_Stats="aggregateNutritionFromRecipe(post.recipes)"
    > 
    </RecipeSearch>
    <div v-if="loading" class="skeleton-list">
      <div class="skeleton-card" v-for="n in 4" :key="n"></div>
    </div>
<!-- 
    <div class="results-grid bg-primary" v-else>
      <RecipeSearch v-for="post in visibleItems" :key="post.RecipeId" v-bind="post" />
    </div> -->


  </main>
</template>

<style scoped>
/* optional layout tweaks */
.section-title {
  margin: 0;
  font-weight: 800;
  color: #112;
  text-shadow: 0 1px 0 rgba(255,255,255,0.6);
}
.skeleton-card { height: 120px; border-radius:8px; background: linear-gradient(90deg,#eee,#f6f6f6,#eee); animation: shimmer 1.1s linear infinite; }
@keyframes shimmer { 0% { background-position: -200px 0 } 100% { background-position: 200px 0 } }
</style>