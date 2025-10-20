<script setup>
// view of a single post with comment section
import { onMounted, ref } from 'vue'; // Make sure ref is imported
import Comment  from '../components/social/Comment.vue';
import TextInput from '@/components/atoms/TextInput.vue';
import searchBar from '@/components/atoms/searchBar.vue';
import { usePostStore } from '@/stores/postStore';
import { storeToRefs } from 'pinia';
import { useCommentStore } from '@/stores/commentStore';
import { useProfileStore } from '@/stores/profileStore';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import buttonTogglable from '@/components/atoms/buttonTogglable.vue';
import Button from '@/components/atoms/button.vue';
const router = useRouter();

const props = defineProps({
  postId: {
    type: String,
    required: true
  }
});

const postStore = usePostStore();
const { loading, currentPost } = storeToRefs(postStore);

const commentStore = useCommentStore();
const { submitting, comments } = storeToRefs(commentStore)

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const userStore = useUserStore();
const { profile: authorProfile } = storeToRefs(userStore);

// Add back the local state for tracking the like status
const isLiked = ref(false);

onMounted(async () =>{
    if (props.postId) {
        await postStore.fetchPostById(props.postId);
        await commentStore.fetchCommentsByPostID(props.postId);
        // TODO: Set the initial 'isLiked' state from your store
        // isLiked.value = await postStore.checkIfUserLikedPost(props.postId, user.value.id);
    } else {
        router.push('/');
    }
});

const handleCommentSubmit = async (content) => {
    if (!user.value || !authorProfile.value) {
        console.error("User is not logged in or profile not loaded.");
        return;
    }

    console.log("Creating comment with content:", content);

    const result = await commentStore.createComment({
        postId: props.postId,
        authorId: user.value.id,
        content: content,
        authorProfile: authorProfile.value
    });

    if (!result.success) {
        console.error('Failed to submit comment:', result.error);
    }
};

// The toggle function now accepts the new state from the button's event
const toggleLike = async (newLikeState) => {
    isLiked.value = newLikeState;
    console.log("Toggling like for post ID:", props.postId, "New state:", isLiked.value);
    // TODO: implement like toggling logic
};
</script>

<template>
    <main>
        <div>  
        <div v-if="currentPost" class="w-75 mx-auto my-3 card">
            <div class="card-body">
                <h1 class="card-title headingFont fw-bold">{{ currentPost.title }}</h1>
                <div class="d-flex align-items-center">
                    <img class="rounded-circle float-start pe-2" width="45" :src="currentPost.profiles.avatar_url" alt="">
                    <div>
                    <h4 class="card-subtitle mb-2 text-body-secondary fs-bold headingFont">{{ currentPost.profiles.display_name }}</h4>                             
                    </div>
                </div>
                <p class="card-text mt-3 bodyFont" v-html="currentPost.content">
                </p>
                <div class="d-flex justify-content-end "> 
                    <!-- Pass the initial state and listen for the toggle event -->
                    <buttonTogglable 
                        class="mx-2" 
                        colorON="primary" 
                        :labelOFF="String(currentPost.vote_score)" 
                        :labelON="String(currentPost.vote_score + 1)" 
                        :initialState="isLiked"
                        @toggle="toggleLike"
                    ></buttonTogglable>
                    <Button class="mx-2" label="Share"><i class="bi bi-share-fill mx-1"></i></Button>
                </div>
                </div>
        </div>
        </div>
        <div v-if="comments" class="w-75 card mx-auto" id="CommentSection">
            <h3 class="card-header headingFont fw-bold">Comments
                <span class="badge bg-primary px-4 ">{{ comments.length }}</span>
            </h3>
             <Comment 
                v-for="comment in comments" 
                v-bind:key="comment.id"
                :Name="comment.profiles.display_name"
                :Picture="comment.profiles.avatar_url"
                :Content="comment.content"
             />
             <TextInput 
                label="Add a comment..." 
                @submit="handleCommentSubmit" 
                :disabled="submitting"
            />
        </div>

    </main>
</template>