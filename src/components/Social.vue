<script setup>
import ProfileSearch from "./molecules/social/ProfileSearch.vue"
import PostSearch from "./molecules/social/PostSearch.vue"
import Button from "../components/atoms/button.vue"
import searchBar from "./atoms/searchBar.vue"
import { usePostStore } from "@/stores/postStore"
import { storeToRefs } from "pinia"
import { useCommentStore } from "@/stores/commentStore"
import { useUserStore } from "@/stores/userStore"
import { useAuthStore } from "@/stores/authStore"
import { useProfileStore } from "@/stores/profileStore"
import { onMounted, ref } from "vue"
import CreatePostModal from "./Organisms/social/CreatePostModal.vue"
import { useDebounce, useDebounceFn } from "@vueuse/core"

const postStore = usePostStore();
const { posts } = storeToRefs(postStore);
const authStore = useAuthStore();

const commentStore = useCommentStore();
const { comments, commentLoading: loading } = storeToRefs(commentStore);

const userStore = useUserStore();
const { profile: authorProfile } = storeToRefs(userStore);
console.log("Author Profile in Search View: ", authorProfile.value);
// Store comments by post ID
const commentsByPostId = ref({});

const profileStore = useProfileStore();
const { profiles, query, filteredProfiles } = storeToRefs(profileStore);

const debFilteredProfiles = useDebounce(filteredProfiles, 300);

const props = defineProps({
    foundProfiles:{
        type: Array,
        default:
            [
                {
                    Name: "@bernardcks",
                    Image: "/src/assets/person.jpg",
                    Following: 1,
                    followers: 100,
                },{
                    Name: "@johnDoe",
                    Image: "/src/assets/person.jpg",
                    Following: 111,
                    followers: 100,                    
                },{
                    Name: "@MaryJane",
                    Image: "/src/assets/person.jpg",
                    Following: 179,
                    followers: 999,
                }
            ]
    } ,

}
)
onMounted(async () => {
    try {
        await profileStore.fetchAllProfiles();
        await postStore.fetchPosts();
        // debug - shows what the store returned
        console.log("Fetched posts:", posts.value);
        //console.log("Fetched profiles:", profiles.value);
    } catch (err) {
        console.error("Error fetching posts:", err);
    }
});

const showCreatePostModal = ref(false);
const handleCreatePost = async (postData) => {
    if (!authStore.user) {
        alert("You must be logged in to create a post.");
        return;
    }
    
    // Call the Pinia store action to create the post
    console.log("--- New Post Data Received ---");
    console.log("Author ID:", authStore.user.id);
    console.log("Title:", postData.title);
    console.log("Content:", postData.content);

    // Check if an image file was included and log its details
    if (postData.imageFile) {
        console.log("Image File Attached:", postData.imageFile);
        console.log("  - Name:", postData.imageFile.name);
        console.log("  - Size:", postData.imageFile.size, "bytes");
        console.log("  - Type:", postData.imageFile.type);
    } else {
        console.log("Image File Attached: None");
    }

    postStore.createPost(authStore.user.id, postData);
};

</script>


<template>
  <!-- search bar -->
   <searchBar class="w-75" placeholder="Search..." v-model="query">
    <i class="bi bi-search"></i>
   </searchBar>
  <section class="section w-75 mx-auto">
    <header class="section-header border-bottom mb-2">
      <div class="badge mx-2">Profiles</div>
      <h1 class="section-title pb-2">Discover people</h1>
    </header>

    <div class="grid">
      <ProfileSearch
        v-for="(profile, idx) in debFilteredProfiles"
        :key="profile.id + '_' + idx"
        :Name="profile.display_name"
        :Image="profile.avatar_url"
        :handle="'@'+profile.display_name"
        :Following="profile.following_count"
        :Followers="profile.follower_count"
        class="card card-profile"
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
                v-for="post in posts"
                :key="post?.id ?? post?.link ?? post?.title"
                :link="post?.id ?? post?.link"
                :title="post?.title"
                :Name="post?.profiles?.display_name || post?.profile?.display_name || post?.author_name || 'Unknown'"
                :Image="post?.profiles?.avatar_url || post?.profile?.avatar_url || post?.avatar_url || '/src/assets/person.jpg'"
                :CommentCount="post?.comment_count"
                :VoteScore="post?.vote_score"
            />
        </div>
    </section>
  <!-- create post modal here -->
   <div class="d-flex justify-content-center my-2">
   <Button @click="showCreatePostModal = true" label="Create Post" ></Button>
     <CreatePostModal 
    :show="showCreatePostModal" 
    @update:show="showCreatePostModal = $event"
    @create-post="handleCreatePost"
  />
  <Button @click="showShareRecipePostModal = true" label="ShareRecipe"></Button>
    
   </div>

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

/* Title styling */
.section-title {
  margin: 0;
  font-weight: 800;
  color: #112;
  text-shadow: 0 1px 0 rgba(255,255,255,0.6);
}

/* Grids */
.grid {
  display: grid;
  gap: 5px;
}




</style>