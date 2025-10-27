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


// use the composable (local or remote search)
//const { query, results, loading, searchNow, setItems } = useMealSearch({ debounceMs: 250 });
const petNutritionStore = usePetNutritionStore();
const { recipeQuery, filteredRecipes: foundPosts } = storeToRefs(petNutritionStore);

// TO WORK ON
// const props = defineProps({
//   FoundPosts: {
//     type: Array,
//     default: () => ([
//       {
//         RecipeId: "123",
//         Username: "JohnDoe",
//         User_Image: "https://picsum.photos/seed/john/120/120",
//         Recipe_Name: "Beef Boost",
//         Recipe_Desc: "A Yummy Treat for golden Retrievers",
//         vote_score: 99,
//         comment_count: 12,
//         Animal_Type: "dog",
//         Animal_Breed: "Golden Retriever",
//         Cost_Per_Week: 25.5,
//         createdAt: "2024-08-12T10:00:00Z",
//         Recipe_Nutrition_Stats: [
//           { LabelName: 'Iron', value: '69', unit: 'mg' },
//           { LabelName: 'Calcium', value: '120', unit: 'mg' },
//           { LabelName: 'Vitamin A', value: '69', unit: 'mg' },
//           { LabelName: 'Fibre', value: '4', unit: 'g' }
//         ]
//       },
//       {
//         RecipeId: "124",
//         Username: "SallyP",
//         User_Image: "https://picsum.photos/seed/sally/120/120",
//         Recipe_Name: "Salmon Special",
//         Recipe_Desc: "Omega-rich plan for shiny coats",
//         vote_score: 142,
//         comment_count: 34,
//         Animal_Type: "cat",
//         Animal_Breed: "Siamese",
//         Cost_Per_Week: 28,
//         createdAt: "2025-02-02T08:30:00Z",
//         Recipe_Nutrition_Stats: [
//           { LabelName: 'Protein', value: '30', unit: 'g' },
//           { LabelName: 'Omega-3', value: '2.4', unit: 'g' },
//           { LabelName: 'Vitamin D', value: '12', unit: 'IU' },
//           { LabelName: 'Iron', value: '3.2', unit: 'mg' },
//           { LabelName: 'Iron', value: '3.2', unit: 'mg' }
//         ]
//       },
//       {
//         RecipeId: "125",
//         Username: "PetChef",
//         User_Image: "https://picsum.photos/seed/chef/120/120",
//         Recipe_Name: "Chicken Feast",
//         Recipe_Desc: "High-protein plan for active adults",
//         vote_score: 87,
//         comment_count: 9,
//         Animal_Type: "dog",
//         Animal_Breed: "Mixed",
//         Cost_Per_Week: 22,
//         createdAt: "2025-05-10T14:20:00Z",
//         Recipe_Nutrition_Stats: [
//           { LabelName: 'Protein', value: '26', unit: 'g' },
//           { LabelName: 'Calories', value: '420', unit: 'kcal' },
//           { LabelName: 'Fiber', value: '3', unit: 'g' },
//           { LabelName: 'Calcium', value: '90', unit: 'mg' }
//         ]
//       },
//       {
//         RecipeId: "126",
//         Username: "GreenBites",
//         User_Image: "https://picsum.photos/seed/green/120/120",
//         Recipe_Name: "Veg Mix",
//         Recipe_Desc: "Gentle option for sensitive stomachs",
//         vote_score: 44,
//         comment_count: 5,
//         Animal_Type: "dog",
//         Animal_Breed: "Small Breed",
//         Cost_Per_Week: 18,
//         createdAt: "2024-11-01T09:00:00Z",
//         Recipe_Nutrition_Stats: [
//           { LabelName: 'Fiber', value: '6', unit: 'g' },
//           { LabelName: 'Vitamin A', value: '80', unit: 'IU' },
//           { LabelName: 'Iron', value: '2', unit: 'mg' },
//           { LabelName: 'Protein', value: '8', unit: 'g' }
//         ]
//       },
//       {
//         RecipeId: "127",
//         Username: "AllergyCare",
//         User_Image: "https://picsum.photos/seed/allergy/120/120",
//         Recipe_Name: "Turkey Comfort",
//         Recipe_Desc: "Limited-ingredient plan for sensitivities",
//         vote_score: 150,
//         comment_count: 21,
//         Animal_Type: "dog",
//         Animal_Breed: "Labrador",
//         Cost_Per_Week: 30,
//         createdAt: "2025-01-18T12:00:00Z",
//         Recipe_Nutrition_Stats: [
//           { LabelName: 'Protein', value: '28', unit: 'g' },
//           { LabelName: 'Omega-6', value: '1.8', unit: 'g' },
//           { LabelName: 'Vitamin E', value: '6', unit: 'mg' },
//           { LabelName: 'Calcium', value: '110', unit: 'mg' }
//         ]
//       }
//     ])
//   }
// });

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

  console.log(recipeQuery.value);
  console.log(foundPosts.value);
});

// run initial search if q present
onMounted(() => {
  petNutritionStore.fetchRecipes();
  recipeQuery.value = initialQuery;
  if (initialQuery) recipeQuery.value = initialQuery;
});

// react to query param changes (browser back/forward or external navigation)
watch(() => route.query.q, (q) => {
  query.value = q || '';
  if (q) recipeQuery = q;
  else {
    // clear results or re-seed if desired
    // results.value = [];
  }
});

// helper called by the TextInput submit button (or parent)
function goToSearchResults(submittedValue) {
  const term = (typeof submittedValue === 'string' && submittedValue.trim().length)
    ? submittedValue.trim()
    : (recipeQuery.value ?? '').toString().trim();

  // if blank, navigate to route without q (optional)
  const target = term ? { name: 'SearchResults', query: { q: term } } : { name: 'SearchResults', query: {} };

  // push new route (this updates route.query and triggers the watcher above)
  router.push(target).catch(() => { /* ignore NavigationDuplicated */ });

  // also trigger an immediate search so results populate fast
  if (term) recipeQuery = term;
}
</script>

<template>
  <main class="p-3 ">


    <h1 class="text-center headingFont my-3">Search Meal Plans</h1>
    <div class="d-flex justify-content-center mb-3">
      <!-- keep TextInput unchanged: listen to its submit event and handle in this view -->
      <TextInput label="Search" :modelValue="recipeQuery" @submit="goToSearchResults" class="w-75" />
      <!-- If your TextInput does not support modelValue/v-model, it still should emit submit(value);
           goToSearchResults will use submitted value when provided. -->
    </div>
    <header class="section-header border-bottom mb-2 d-flex w-75 mx-auto">
      <BaseBadge pill variant="info" class="px-3 fs-5 my-2 mx-3">Posts</BaseBadge>
      <h1 class="section-title pb-2">Search results for "{{ recipeQuery }}"</h1>
      
    </header>
    <!-- New Post Design For found result, with User Info, Score and other good things, we can reuse some information -->
     <!-- Reusable Information name, desc, animal, breed, price_per_week: likes, username, user_image -->
    <RecipeSearch class="mx-3 mb-3 w-75 mx-auto"
      v-for="(post, idx) in foundPosts"
      :key="post.id + '-' + idx"
      :RecipeId="post.id"
      :Username="post.profiles.display_name"
      :User_Image="post.profiles.avatar_url"
      :Recipe_Name="post.recipe_name"
      :Recipe_Desc="post.description"
      :Vote_score="post.vote_score"
      :Comment_count="post.comment_count"
      :Animal_Type="post.pet_kind"
      :Animal_Breed="post.pet_breed"
      :Cost_Per_Week="post.price_per_week"
      :Recipe_Nutrition_Stats="post.Recipe_Nutrition_Stats"
    > 
    </RecipeSearch>
    <div v-if="loading" class="skeleton-list">
      <div class="skeleton-card" v-for="n in 4" :key="n"></div>
    </div>

    <div class="results-grid bg-primary" v-else>
      <RecipeSearch v-for="post in visibleItems" :key="post.RecipeId" v-bind="post" />
    </div>


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