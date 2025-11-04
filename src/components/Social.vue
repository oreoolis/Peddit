<script setup>
import ProfileSearch from "./molecules/social/ProfileSearch.vue"
import PostSearch from "./molecules/social/PostSearch.vue"
import Button from "../components/atoms/button.vue"
import searchBar from "./atoms/searchBar.vue"
import buttonTogglable from "./atoms/buttonTogglable.vue"
import { usePostStore } from "@/stores/postStore"
import { storeToRefs } from "pinia"
import { useCommentStore } from "@/stores/commentStore"
import { useUserStore } from "@/stores/userStore"
import { useAuthStore } from "@/stores/authStore"
import { useProfileStore } from "@/stores/profileStore"
import { computed, onMounted, ref } from "vue"
import CreatePostModal from "./Organisms/social/CreatePostModal.vue"
import { useDebounce, useDebounceFn } from "@vueuse/core"
import ShareRecipePostModal from "./Organisms/social/ShareRecipePostModal.vue"

const postStore = usePostStore();
const { posts, query: postQuery, filteredPosts } = storeToRefs(postStore);
const authStore = useAuthStore();

const commentStore = useCommentStore();
const { comments, commentLoading: loading } = storeToRefs(commentStore);

const userStore = useUserStore();
const { profile: authorProfile } = storeToRefs(userStore);

// Store comments by post ID
const commentsByPostId = ref({});

const profileStore = useProfileStore();
const { query, filteredProfiles } = storeToRefs(profileStore);

const debFilteredProfiles = useDebounce(filteredProfiles, 300);
const debFilteredPosts = useDebounce(filteredPosts, 300);

// UI: limit lists and allow expanding
const INITIAL_LIST_COUNT = 5;
const showAllProfiles = ref(false);
const showAllPosts = ref(false);

const visibleProfiles = computed(() => {
  const arr = debFilteredProfiles.value || [];
  return showAllProfiles.value ? arr : arr.slice(0, INITIAL_LIST_COUNT);
});

const visiblePosts = computed(() => {
  const arr = debFilteredPosts.value || [];
  return showAllPosts.value ? arr : arr.slice(0, INITIAL_LIST_COUNT);
});

const combinedQuery = computed({
  get(){ return query.value },
  set(newVal){
    query.value = newVal;
    postQuery.value = newVal;
  }
});

// const props = defineProps({
//     foundProfiles:{
//         type: Array,
//         default:
//             [
//                 {
//                     Name: "@bernardcks",
//                     Image: "/src/assets/person.jpg",
//                     Following: 1,
//                     followers: 100,
//                 },{
//                     Name: "@johnDoe",
//                     Image: "/src/assets/person.jpg",
//                     Following: 111,
//                     followers: 100,                    
//                 },{
//                     Name: "@MaryJane",
//                     Image: "/src/assets/person.jpg",
//                     Following: 179,
//                     followers: 999,
//                 }
//             ]
//     } ,

// }
// )
onMounted(async () => {
    try {
        await profileStore.fetchAllProfiles();
        await postStore.fetchPosts();
    } catch (err) {
        console.error("Error fetching posts:", err);
    }
});


</script>


<template>
  <!-- search bar -->
   <searchBar class="w-75" placeholder="Search..." v-model="combinedQuery">
    <i class="bi bi-search"></i>
   </searchBar>
  <section class="section w-75 mx-auto">
    <header class="section-header border-bottom mb-2">
      <div class="badge mx-2">Profiles</div>
      <h1 class="pb-2 section-title" >Discover people</h1>
    </header>

    <div class="grid">
        <ProfileSearch
          v-for="(profile, idx) in visibleProfiles"
          :key="profile.id + '_' + idx"
          :Name="profile.display_name"
          :Image="profile.avatar_url"
          :handle="'@'+profile.display_name"
          :Following="profile.following_count"
          :Followers="profile.follower_count"
          :LinkID="profile.display_name"
          class="card card-profile"
        />
      </div>
      <div class="text-center mt-2">
        <Button
          v-if="(debFilteredProfiles.length || 0) > INITIAL_LIST_COUNT && !showAllProfiles"
          outline
          :label="`Show all ${debFilteredProfiles.length} profiles`"
          @click="showAllProfiles = true"
        />
        <Button
          v-else-if="showAllProfiles"
          outline
          label="Show less"
          @click="showAllProfiles = false"
        />
      </div>
  </section>



    <section class="section mt-4 mx-auto w-75">
        <header class="section-header border-bottom mb-2">
            <div class="badge badge-alt mx-2">Posts</div>
            <h1 class="section-title pb-2">Trending posts</h1>
        </header>

  <div class="grid">
            <!-- friendly empty state / debug hint -->
            <div v-if="(posts || []).length === 0" class="empty text-muted p-3">
                No posts to display — check the console (Fetched posts:)
            </div>

            <!-- safer prop access for post fields so a missing `profiles` doesn't break rendering -->
            <PostSearch
                v-for="post in visiblePosts"
                :key="post?.id ?? post?.link ?? post?.title"
                :link="post?.id ?? post?.link"
                :title="post?.title"
                :Name="post?.profiles?.display_name || post?.profile?.display_name || post?.author_name || 'Unknown'"
                :Image="post?.profiles?.avatar_url || post?.profile?.avatar_url || post?.avatar_url || '/src/assets/person.jpg'"
                :CommentCount="post?.comment_count"
                :VoteScore="post?.vote_score"
                :created_at="post?.created_at"
            />
        </div>
        <div class="text-center mt-2">
          <Button
            v-if="(debFilteredPosts.length || 0) > INITIAL_LIST_COUNT && !showAllPosts"
            outline
            :label="`Show all ${debFilteredPosts.length} posts`"
            @click="showAllPosts = true"
          />
          <Button
            v-else-if="showAllPosts"
            outline
            label="Show less"
            @click="showAllPosts = false"
          />
        </div>
    </section>
  <!-- create post modal here -->


</template>
<style scoped>

/* Section header */
.section {
  margin-top: 1rem;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 2rem;

}
.badge {
  background: linear-gradient(135deg,#ffdca3,#ffb86b);
  color: #3b2e14;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(255,165,60,0.16);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}
.badge-alt {
  background: linear-gradient(135deg,#c7f0ff,#7fd2ff);
  box-shadow: 0 6px 18px rgba(60,160,220,0.12);
}


/* Grids */
.grid {
  display: grid;
  gap: 5px;
}




</style>