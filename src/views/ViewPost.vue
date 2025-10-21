<script setup>
// view of a single post with comment section
import { onMounted, ref, computed } from 'vue'; // 1. Removed watch/nextTick, added computed
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

const isLiked = ref(false);

// --- 2. START: "Show More" Logic ---
const INITIAL_COMMENT_COUNT = 3; // Number of comments to show initially
const showAllComments = ref(false);

// This computed property determines if the "View More" button should be shown
const hasMoreComments = computed(() => comments.value.length > INITIAL_COMMENT_COUNT);

// This computed property returns the list of comments to be rendered
const displayedComments = computed(() => {
  if (showAllComments.value) {
    return comments.value; // Show all comments
  }
  // Otherwise, show only the initial amount
  return comments.value.slice(0, INITIAL_COMMENT_COUNT);
});
// --- END: "Show More" Logic ---


onMounted(async () =>{
    if (props.postId) {
        await postStore.fetchPostById(props.postId);
        await commentStore.fetchCommentsByPostID(props.postId);
    } else {
        router.push('/');
    }
});

const handleCommentSubmit = async (content) => {
    if (!user.value || !authorProfile.value) {
        console.error("User is not logged in or profile not loaded.");
        return;
    }
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

const toggleLike = async (newLikeState) => {
    isLiked.value = newLikeState;
    console.log("Toggling like for post ID:", props.postId, "New state:", isLiked.value);
};
</script>

<template>
    <main class="bg-light py-4 ">
        <div class="container-md mx-auto">
            <!-- Post Card -->
            <div v-if="currentPost" class="card post-modern-card">
                <div class="card-body">
                    <div class="post-meta d-flex align-items-center gap-2 small mb-3">
                        <img class="avatar rounded-circle" :src="currentPost.profiles.avatar_url" alt="">
                        <span class="fw-bold text-body">{{ currentPost.profiles.display_name }}</span>
                    </div>
                    <h1 class="post-title h2 headingFont fw-bold mb-4">{{ currentPost.title }}</h1>
                    <div class="post-body bodyFont fs-5" v-html="currentPost.content"></div>
                </div>
                <div class="card-footer bg-transparent d-flex align-items-center gap-3 justify-content-end border-top">
                    <buttonTogglable 
                        class="mx-2" 
                        colorON="primary" 
                        :labelOFF="String(currentPost.vote_score)" 
                        :labelON="String(currentPost.vote_score + 1)" 
                        :initialState="isLiked"
                        @toggle="toggleLike"
                    />
                    <Button variant="subtle" label="Share"><i class="bi bi-share-fill me-2"></i></Button>
                </div>
            </div>

            <!-- Comment Section -->
            <div v-if="comments && comments.length > 0" class="card mt-4" id="CommentSection">
                <div class="card-body">
                    <h5 class="mb-4">Comments ({{ comments.length }})</h5>
                    <TextInput class="mb-4" label="What are your thoughts?" @submit="handleCommentSubmit" :disabled="submitting" />
                    <div class="comment-list">
                        <!-- 3. Loop over the new 'displayedComments' computed property -->
                        <Comment v-for="comment in displayedComments" :key="comment.id" :Name="comment.profiles.display_name" :Picture="comment.profiles.avatar_url" :Content="comment.content" :timestamp="comment.created_at" />
                    </div>
                    
                    <!-- 4. "View More" Button -->
                    <div v-if="hasMoreComments && !showAllComments" class="text-center mt-3 border-top pt-3">
                        <button class="btn btn-link text-decoration-none" @click="showAllComments = true">
                            View all {{ comments.length }} comments
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.post-modern-card {
    border-radius: .75rem;
    border: none;
    box-shadow: 0 4px 25px rgba(0,0,0,0.05);
}
.avatar {
    width: 32px;
    height: 32px;
}
.card-footer {
    border-top: 1px solid var(--bs-border-color-translucent);
}
</style>