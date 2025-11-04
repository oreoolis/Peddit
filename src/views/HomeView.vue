<script setup>
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { usePetStore } from '@/stores/petStore';
import QuickStatsGrid from '@/components/molecules/health/QuickStatsGrid.vue';

// social/post data
import AnimatedImage from '@/components/atoms/animated/animatedImage.vue';
import CreatePostModal from '@/components/Organisms/social/CreatePostModal.vue';
import ShareRecipePostModal from '@/components/Organisms/social/ShareRecipePostModal.vue';
import { usePostStore } from '@/stores/postStore';
import { useProfileStore } from '@/stores/profileStore';
import PostSearch from '@/components/molecules/social/PostSearch.vue';
import { useDebounce } from '@vueuse/core';
import Button from '@/components/atoms/button.vue';
import { useRouter } from 'vue-router';
import { usePetNutritionStore } from '@/stores/petNutritionStore';
import RecipeSearch from '@/components/social/RecipeSearch.vue';
// --- inlined from HomeTemplate (kept here so HomeView is self-contained) ---
const petStore = usePetStore();
const { pets } = storeToRefs(petStore);
const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);

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

// posts/profiles fetching (reuse Social.vue approach)
const postStore = usePostStore();
const { posts, filteredPosts } = storeToRefs(postStore);
const profileStore = useProfileStore();

const debFilteredPosts = useDebounce(filteredPosts, 300);

// limit shown posts on HomeView to the latest 5 so we can render a recipe section below
const latestPosts = computed(() => {
  const arr = debFilteredPosts?.value || [];
  return Array.isArray(arr) ? arr.slice(0, 3) : [];
});

const petNutritionStore = usePetNutritionStore();
const { recipePosts } = storeToRefs(petNutritionStore);

onMounted(async () => {
  try {
    await profileStore.fetchAllProfiles();
    await postStore.fetchPosts();
    await petNutritionStore.fetchAllRecipePost();
    // fetch pets so stats update when HomeView is shown
    try {
      // if we have a userId, fetch for that user; otherwise fetch default
      if (userId && userId.value) {
        await petStore.fetchPets(userId.value);
      } else if (petStore.fetchPets) {
        await petStore.fetchPets();
      }
    } catch (petErr) {
      console.warn('Failed to fetch pets in HomeView:', petErr);
    }
  } catch (err) {
    console.error('Error fetching social data in HomeView:', err);
  }
});
const router = useRouter();
function goToMap(type){
  router.push({ path: '/map', query: { type } });
}

// Helpers
const truncate = (text = '', max = 100) => {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

// Create post / share recipe modal state & handler (moved from Social.vue)
const showCreatePostModal = ref(false);
const showShareRecipePostModal = ref(false);

const handleCreatePost = async (postData) => {
  if (!authStore.user) {
    alert('You must be logged in to create a post.');
    return;
  }
  if (postData.imageFile) {
   
  }
  await postStore.createPost(authStore.user.id, postData);
  showCreatePostModal.value = false;
};

const handleShareRecipe = async (postData) => {
  if (!authStore.user) {
    alert('You must be logged in to share a recipe.');
    return;
  }
  
  await petNutritionStore.createRecipePost(authStore.user.id, { 
    recipeId: postData.recipeId,
    title: postData.title ?? "Heelo, check out this SICK recipe!",
    content: postData.content
  });
  showCreatePostModal.value = false;
}

function goToHealthDashboard(){
  router.push({ path: '/health'});
}

function goToMeal(){
  router.push({ path: '/meal'});
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

  <div class="home-view">

    <main class="m-2">
      <div class="row">
        <div class="col-12 col-lg-8">
          <section class="dashboard mb-3">
            <div class="card template-explorer">
              <div class="card-body p-0">
                <div class="preview p-3">
                  <!-- inlined HomeTemplate content (converted to Bootstrap utilities) -->
                  <div class=" sample-home">
                      <div class="flex-grow-1">
                        <h1 class="mb-1 brandFont ">
                        <AnimatedImage src="/src/assets/Sprite/Dog/Idle.png" :frameWidth="48" :frameHeight="48" :frames="4" :fps="4" :width="64" :height="64" />
                          Welcome to Peddit!              
                        <AnimatedImage src="/src/assets/Sprite/Cat/Idle.png" :frameWidth="48" :frameHeight="48" :frames="4" :fps="4" :width="64" :height="64" />
                          </h1>
                        <p class="text-muted mb-2">Discover pets, read tips and share moments with other pet lovers.</p>
                        <div class="d-flex gap-2 flex-wrap justify-content-end">
                             <Button @click="showCreatePostModal = true" label="Create Post" ></Button>
                                <CreatePostModal 
                                :show="showCreatePostModal" 
                                @update:show="showCreatePostModal = $event"
                                @create-post="handleCreatePost"
                              />
                              <Button class="ms-2" outline label="Share Recipe" @click="showShareRecipePostModal = true" />
                              <ShareRecipePostModal
                                :show="showShareRecipePostModal"
                                @update:show="showShareRecipePostModal = $event"
                                @create-post="handleShareRecipe"
                              />
                          <Button outline label="Explore Meals" color="secondary"  @click.prevent="goToMeal()" ></Button>
                        </div>
                      </div>
                    </div>

                    <section class="feed mt-3">
                      <h1 class="brandFont text-center m-3 border-bottom pb-2">Latest Posts</h1>

                      <div v-if="(posts || []).length === 0" class="text-muted mb-2">No posts to display — check the console (Fetched posts:)</div>

                      <div>
                        <PostSearch
                          v-for="post in latestPosts"
                          :key="post?.id ?? post?.link ?? post?.title"
                          :link="post?.id ?? post?.link"
                          :title="post?.title"
                          :Name="post?.profiles?.display_name || post?.profile?.display_name || post?.author_name || 'Unknown'"
                          :Image="post?.profiles?.avatar_url || post?.profile?.avatar_url || post?.avatar_url || '/src/assets/person.jpg'"
                          :CommentCount="post?.comment_count"
                          :VoteScore="post?.vote_score"
                          :created_at="post?.created_at"
                          
                        >
                        <div class="mt-2 ms-1" >{{ truncate(post?.content, 100) }}</div>
                      </PostSearch>
                        
                      </div>

                    </section>
                    <section class="feed mt-3">
                      <h1 class="brandFont text-center m-3 border-bottom pb-2">Latest Recipes</h1>

                      <div v-if="(posts || []).length === 0" class="text-muted mb-2">No posts to display — check the console (Fetched posts:)</div>

                      <div>
                        <!-- TODO: LINK UP RECIPE POST -->
                        <RecipeSearch
                          class="my-3"
                        
                          v-for="post in recipePosts"
                          :key="post?.id ?? post?.link ?? post?.title"
                          :RecipeId="post?.id ?? post?.link"
                          :Username="post?.profiles?.display_name || post?.profile?.display_name || post?.author_name || 'Unknown'"
                          :User_Image="post?.profiles?.avatar_url || post?.profile?.avatar_url || post?.avatar_url || '/src/assets/person.jpg'"
                          :Recipe_Name="post.recipes.recipe_name"
                          :Recipe_Desc="post.recipes.description"
                          :Comment_count="post?.comment_count"
                          :Vote_score="post?.vote_score"
                          :Animal_Type="post.recipes.pet_kind"
                          :Cost_Per_Week="post.recipes.price_per_week"
                          :Recipe_Nutrition_Stats="aggregateNutritionFromRecipe(post.recipes)"
                        >
                        <div class="mt-2 ms-1" >{{ truncate(post?.content, 100) }}</div>
                        </RecipeSearch>
                        
                      </div>

                    </section>                    
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
                <h2 class="mb-4 primary section-title">Find nearby</h2>
                <div class="d-flex">
                  <Button class="w-50 justify-content-center mx-2" outline label="Pet Stores" @click.prevent="goToMap('petstore')" />
                  <Button class="w-50 justify-content-center mx-2" outline label="Pet Clinics" @click.prevent="goToMap('clinic')" />
                </div>
              </div>
            </div>
              <div class="card">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <h2 class="primary section-title">Pet Dashboard</h2>
                    <Button outline label="View DashBoard" @click.prevent="goToHealthDashboard()"></Button>
                  </div>
                  <QuickStatsGrid class="shadow-none" :stats="statsData" />
                </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  </div>
</template>



