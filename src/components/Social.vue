<script setup>
import ProfileSearch from "../components/social/ProfileSearch.vue"
import PostSearch from "../components/social/PostSearch.vue"
import { usePostStore } from "@/stores/postStore";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCommentStore } from "@/stores/commentStore";
import { useUserStore } from "@/stores/userStore";

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
    foundPosts: {
        type: Array,
        default:[
            {
                link : 0,
                title: "Best Meal for a baby dog",
                Name: "@bernardcks",
                Image: "src/assets/person.jpg",
            },
            {
                link : 1,
                title: "Eat Healthier for cats!",
                Name: "@MaryJane",
                Image: "src/assets/person.jpg",
            },
            {
                link : 2,
                title: "Milk Brands for pets ranked",
                Name: "@johnDoe",
                Image: "src/assets/person.jpg",               
            },
        ]
    }
}
)

const postStore = usePostStore();
const { posts } = storeToRefs(postStore);

const commentStore = useCommentStore();
const { comments, commentLoading: loading } = storeToRefs(commentStore);

const userStore = useUserStore();

// Store comments by post ID
const commentsByPostId = ref({});

onMounted(async () => {
    await postStore.fetchPosts();
    // Pre-load comments for all posts
    await loadAllComments();
});

// Load comments for all posts
const loadAllComments = async () => {
    if (!posts.value || posts.value.length === 0) return;
    
    for (const post of posts.value) {
        if (post.id) {
            try {
                const { data: postComments } = await commentStore.fetchCommentsByPostID(post.id);
                console.log(postComments);
                commentsByPostId.value[post.id] = postComments || [];
            } catch (error) {
                console.error(`Error loading comments for post ${post.id}:`, error);
                commentsByPostId.value[post.id] = [];
            }
        }
    }
};

</script>


<template>
             <div class="input-group w-75 mx-auto py-3 bodyFont">
            <button class="btn border rounded-start-pill" type="button" id="SearchButton"><img src="../assets/Sprite/HomeIcons/Search.png" alt=""></button>
            <input type="text" class="form-control rounded-end-pill " placeholder="Search" aria-label="Search" aria-describedby="visible-addon">
            <input type="text" class="form-control d-none " placeholder="Hidden input" aria-label="Hidden input" aria-describedby="visible-addon">
        </div>
        <div class="text-center headingFont fw-bold fs-1">Profiles</div>
        <div class="w-75 mx-auto" id="ProfileList">
            <!-- ProfileSearchResult -->
             <ProfileSearch v-for="profile in props.foundProfiles"
             :Name = "profile.Name"
             :Image = "profile.Image"
             ></ProfileSearch>
            <!-- ProfileSearchResult -->
        </div>
        <div class="text-center headingFont fw-bold fs-1">Posts</div>

        <div class="w-75 mx-auto" id="PostList">
            <!-- SimplePostSearchResult -->
             <PostSearch v-for="post in posts"
             :link="post.link"
             :title="post.title"
             :Name="post.Name">
             </PostSearch>
            <!-- SimplePostSearchResult -->
        </div>
</template>