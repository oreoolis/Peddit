<script setup>
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePetStore } from '@/stores/petStore';
import QuickStatsGrid from '@/components/molecules/health/QuickStatsGrid.vue';

// social/post data
import { usePostStore } from '@/stores/postStore';
import { useProfileStore } from '@/stores/profileStore';
import PostSearch from '@/components/molecules/social/PostSearch.vue';
import { useDebounce } from '@vueuse/core';
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

// posts/profiles fetching (reuse Social.vue approach)
const postStore = usePostStore();
const { posts, filteredPosts } = storeToRefs(postStore);
const profileStore = useProfileStore();

const debFilteredPosts = useDebounce(filteredPosts, 300);

onMounted(async () => {
  try {
    await profileStore.fetchAllProfiles();
    await postStore.fetchPosts();
    console.log('Fetched posts (HomeView):', posts.value);
  } catch (err) {
    console.error('Error fetching social data in HomeView:', err);
  }
});
console.log(debFilteredPosts.data);
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
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <div class="flex-grow-1">
                        <h1 class="mb-1 brandFont">Welcome to Peddit!</h1>
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

                    <section class="feed mt-3">
                      <h5>Latest Posts</h5>

                      <div v-if="(posts || []).length === 0" class="text-muted mb-2">No posts to display — check the console (Fetched posts:)</div>

                      <div>
                        <PostSearch
                          v-for="post in debFilteredPosts"
                          :key="post?.id ?? post?.link ?? post?.title"
                          :link="post?.id ?? post?.link"
                          :title="post?.title"
                          :Name="post?.profiles?.display_name || post?.profile?.display_name || post?.author_name || 'Unknown'"
                          :Image="post?.profiles?.avatar_url || post?.profile?.avatar_url || post?.avatar_url || '/src/assets/person.jpg'"
                          :CommentCount="post?.comment_count"
                          :VoteScore="post?.vote_score"
                          :created_at="post?.created_at"
                        >
                        <div class="mt-2 ms-1">{{ post?.content }}</div>
                      </PostSearch>
                        
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
                    <div class="mb-2"><strong>Pet Dashboard</strong></div>
                    <QuickStatsGrid :stats="statsData" />
          </section>
        </aside>
      </div>
    </main>
  </div>
</template>



