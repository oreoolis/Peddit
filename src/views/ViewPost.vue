<script setup>
import { onMounted, ref, computed } from 'vue';
import Comment  from '../components/atoms/social/Comment.vue';
import TextInput from '@/components/atoms/TextInput.vue';
import { usePostStore } from '@/stores/postStore';
import { storeToRefs } from 'pinia';
import { useCommentStore } from '@/stores/commentStore';
import { useProfileStore } from '@/stores/profileStore';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import UpvoteControl from '@/components/molecules/social/VoteControl.vue';
import ShareButton from '@/components/Organisms/social/ShareButton.vue';
import PostContentCarousel from '@/components/molecules/social/PostContentCarousel.vue';
import { supabase } from '@/lib/supabaseClient';
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
const serverVote = ref(0); // -1 | 0 | 1

// --- 2. START: "Show More" Logic ---
const INITIAL_COMMENT_COUNT = 3; // Number of comments to show initially
const showAllComments = ref(false);
const hasMoreComments = computed(() => comments.value.length > INITIAL_COMMENT_COUNT);

// This computed property returns the list of comments to be rendered
const displayedComments = computed(() => {
  if (showAllComments.value) {
    return comments.value; // Show all comments
  }
  // Otherwise, show only the initial amount
  return comments.value.slice(0, INITIAL_COMMENT_COUNT);
});

onMounted(async () =>{
    if (props.postId) {
        await postStore.fetchPostById(props.postId);
        await commentStore.fetchCommentsByPostID(props.postId);
        // Attempt to determine current user's persisted vote for UI
        try {
            // 1) If the fetched post includes per-post votes, use them
            const post = currentPost.value;
            let myVote = 0;
            if (post) {
                // common shapes: post.post_votes (array of { voter_id, vote })
                if (Array.isArray(post.post_votes)) {
                    const found = post.post_votes.find(v => v && v.voter_id === user.value?.id);
                    if (found) myVote = Number(found.vote) || 0;
                }
                // alternate shape: post.user_vote or post.my_vote
                if (!myVote && typeof post.user_vote !== 'undefined') {
                    myVote = Number(post.user_vote) || 0;
                }
                if (!myVote && typeof post.my_vote !== 'undefined') {
                    myVote = Number(post.my_vote) || 0;
                }
            }

            // 2) Fallback: query post_votes table directly (no store changes)
            if ((myVote === 0) && user.value?.id) {
                const { data: voteRow, error: voteErr } = await supabase
                    .from('post_votes')
                    .select('vote')
                    .eq('post_id', props.postId)
                    .eq('voter_id', user.value.id)
                    .single();

                if (!voteErr && voteRow) {
                    myVote = Number(voteRow.vote) || 0;
                }
            }

            serverVote.value = myVote;
        } catch (err) {
            // don't block rendering on vote lookup errors
            console.error('Error resolving persisted vote for post:', err);
        }
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

const onVote = async (v) => {
  const num = Number(v) || 0;
  const normalized = [-1, 0, 1].includes(num) ? num : 0;
  serverVote.value = normalized;
  console.log('[VOTE]', serverVote.value); // prints -1, 0 or 1
  console.log(user.value.id);

  if(user.value.id){
    await postStore.voteOnPost(currentPost.value.id, user.value.id, serverVote.value);
  }
};

// helper: remove HTML and shorten content for share text
function stripHtml(html = '') {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || '').trim();
}

// keep combinedMessage for default text to pass into ShareButton
const combinedMessage = computed(() => {
  const url = window.location.href;
  return `Check out this link from Peddit!\n\n${url}`;
});
console.log(currentPost)
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
                    <!-- TODO: TO ATTACH post_media -->
                    <PostContentCarousel  :data="currentPost.post_media" class="border-top :data "></PostContentCarousel>
                    
                </div>
                <div class="card-footer bg-transparent d-flex align-items-center gap-3 justify-content-end border-top">

                    <!-- single reusable share component -->
                    <ShareButton
                      :initialText="combinedMessage"
                      :title="currentPost.title"
                      button-label="Share" />
                     <UpvoteControl
                         :initialVote="serverVote"
                         :score="currentPost.vote_score"
                         @vote="onVote"
                     />
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
                <div v-else class="card mt-4" id="CommentSection">
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

/* modal styles (simple, self-contained) */
.share-modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;           /* center on desktop by default */
  justify-content: center;
  background: rgba(6,10,18,0.35);
  z-index: 2000;
  padding: 1rem;
}

/* modal shell */

</style>