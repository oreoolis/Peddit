<script setup>
import ProfileSearch from "../components/social/ProfileSearch.vue"
import PostSearch from "../components/social/PostSearch.vue"
import Button from "../components/atoms/button.vue"
import searchBar from "./atoms/searchBar.vue"
import { usePostStore } from "@/stores/postStore"
import { storeToRefs } from "pinia"
import { useCommentStore } from "@/stores/commentStore"
import { useUserStore } from "@/stores/userStore"
import { useAuthStore } from "@/stores/authStore"
import { onMounted, ref } from "vue"
import CreatePostModal from "./social/CreatePostModal.vue"
const props = defineProps({
    foundProfiles:{
        type: Array,
        default:
            [
                {
                    Name: "@bernardcks",
                    Image: "/src/assets/person.jpg"
                },{
                    Name: "@johnDoe",
                    Image: "/src/assets/person.jpg"
                },{
                    Name: "@MaryJane",
                    Image: "/src/assets/person.jpg"
                }
            ]
    } ,

}
)
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

onMounted(async () => {
    await postStore.fetchPosts();
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
};

</script>


<template>
  <!-- search bar -->
   <searchBar class="w-75" placeholder="Search...">
    <i class="bi bi-search"></i>
   </searchBar>
  <section class="section w-75 mx-auto">
    <header class="section-header border-bottom mb-2">
      <div class="badge mx-2">Profiles</div>
      <h1 class="section-title pb-2">Discover people</h1>
    </header>

    <div class="grid">
      <ProfileSearch
        v-for="(profile, idx) in props.foundProfiles"
        :key="profile.Name + '_' + idx"
        :Name="profile.Name"
        :Image="profile.Image"
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
      <PostSearch
        v-for="post in posts"
        :key="post.id"
        :link="post.id"
        :title="post.title"
        :Name="post.profiles.display_name"
        :Image="post.profiles.avatar_url"
        class=""
        :CommentCount="post.comment_count"
        :VoteScore="post.vote_score"
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