<script setup>
import { computed, onMounted, ref } from 'vue';
import BaseAvatar from '@/components/atomic/BaseAvatar.vue';
import BaseLabel from '@/components/atomic/BaseLabel.vue';
import BaseStatNumber from '@/components/atomic/BaseStatNumber.vue';
import ShareButton from '@/components/Organisms/social/ShareButton.vue';
import UpvoteControl from '@/components/molecules/social/VoteControl.vue';
import Button from '@/components/atoms/button.vue';
import Comment from '@/components/atoms/social/Comment.vue';
import TextInput from '@/components/atoms/TextInput.vue';
import { usePetNutritionStore } from '@/stores/petNutritionStore';
import { storeToRefs } from 'pinia';
import { usePostStore } from '@/stores/postStore';
import { useCommentStore } from '@/stores/commentStore';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
// Dummy static Data in 
const props = defineProps({
  postId: {type: String, required: true}
  // RecipeId: { type: String, default: '123e' },
  // Username: { type: String, default: 'JohnDoe' },
  // User_Image: { type: String, default: '/src/assets/person.jpg' },
  // Recipe_Name: { type: String, default: 'Beef Boost' },
  // Recipe_Desc: { type: String, default: 'A Yummy Treat for golden Retrievers' },
  // Vote_score: { type: Number, default: 99 },
  // Comment_count: { type: Number, default: 12 },
  // Animal_Type: { type: String, default: 'dog' },
  // Animal_Breed: { type: String, default: 'Golden Retriever' },
  // Cost_Per_Week: { type: Number, default: 25.5 },
  // Recipe_Nutrition_Stats: {
  //   type: Array,
  //   default: () => ( [
  //     { LabelName: 'Iron', value: '69', unit: 'mg' },
  //     { LabelName: 'Calcium', value: '120', unit: 'mg' },
  //     { LabelName: 'Vitamin A', value: '69', unit: 'mg' },
  //     { LabelName: 'Fibre', value: '4', unit: 'g' }
  //   ])
  // }
});

// --- Dummy static comments loaded into the comment section ---
const comments2 = ref([
  {
    id: 'c1',
    profiles: { display_name: 'Alice', avatar_url: 'https://picsum.photos/seed/alice/80/80' },
    content: 'Tried this recipe — my dog loved it! Will make again.',
    created_at: '2025-09-01T10:12:00Z'
  },
  {
    id: 'c2',
    profiles: { display_name: 'Ben', avatar_url: 'https://picsum.photos/seed/ben/80/80' },
    content: 'Can you share the exact ingredient quantities?',
    created_at: '2025-09-02T09:05:00Z'
  },
  {
    id: 'c3',
    profiles: { display_name: 'Cara', avatar_url: 'https://picsum.photos/seed/cara/80/80' },
    content: 'Great alternative for sensitive stomachs.',
    created_at: '2025-09-03T14:22:00Z'
  },
  {
    id: 'c4',
    profiles: { display_name: 'Derek', avatar_url: 'https://picsum.photos/seed/derek/80/80' },
    content: 'I swapped chicken for turkey and it worked well.',
    created_at: '2025-09-04T08:45:00Z'
  },
  {
    id: 'c5',
    profiles: { display_name: 'Eve', avatar_url: 'https://picsum.photos/seed/eve/80/80' },
    content: 'Does this scale for small breeds?',
    created_at: '2025-09-05T12:30:00Z'
  }
]);

const postStore = usePostStore();
//const { loading, currentPost } = storeToRefs(postStore);

const petNutriStore = usePetNutritionStore();
const { currentRecipePost: currentPost } = storeToRefs(petNutriStore);

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
// --- END: "Show More" Logic ---

onMounted(async () => {
  console.log(props.postId);
  if (props.postId) {
      console.log("sds");
      await petNutriStore.fetchRecipePostById(props.postId);
      await commentStore.fetchCommentsByPostID(props.postId);
      console.log(currentPost.value);
      // optionally: fetch user's vote here and set serverVote
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

// client-side UI helpers for comment list
// const showAllComments = ref(false);
// const submitting = ref(false);

// const displayedComments = computed(() => {
//   return showAllComments.value ? comments.value : comments.value.slice(0, 3);
// });
// const hasMoreComments = computed(() => comments.value.length > displayedComments.value.length);

// // simple comment submit handler (adds new comment to top)
// async function handleCommentSubmit(text) {
//   if (!text || !text.trim()) return;
//   submitting.value = true;
//   try {
//     const now = new Date().toISOString();
//     const newComment = {
//       id: `c${Date.now()}`,
//       profiles: { display_name: props.Username || 'You', avatar_url: props.User_Image || 'https://picsum.photos/seed/default/80/80' },
//       content: text.trim(),
//       created_at: now
//     };
//     comments.value.unshift(newComment);
//     // optionally expand to show the new comment
//     showAllComments.value = true;
//   } finally {
//     submitting.value = false;
//   }
// }

// // add reactive vote state and handler (mirror ViewPost pattern)
// const serverVote = ref(0); // -1 | 0 | 1

// function onVote(v) {
//   const num = Number(v) || 0;
//   const normalized = [-1, 0, 1].includes(num) ? num : 0;
//   serverVote.value = normalized;
//   console.log('[VOTE]', serverVote.value);
// }

// --- helpers used elsewhere in template ---
const defaultAvatar = props.User_Image || 'https://picsum.photos/seed/defaultpet/120/120';
const combinedShareText = computed(() => `${props.Recipe_Name} — ${props.Recipe_Desc}\n\nCheck this recipe on Peddit!`);
function formatCurrency(v){ return typeof v === 'number' ? `$ ${v.toFixed(2)}` : v; }
function formatDate(d){ return d ? new Date(d).toLocaleDateString() : ''; }
</script>

<template>
  <div v-if="!currentPost">LOADING</div>
  <main v-else class="bg-light py-4">
    <div class="container-md mx-auto">
      <div class="card post-modern-card">
        <div class="card-body">
          <div class="post-meta d-flex align-items-center gap-3 small mb-3">
            <BaseAvatar :src="currentPost.profiles.avatar_url" size="sm" class="avatar" />
            <div>
              <div class="fw-bold text-body">@{{ currentPost.profiles.display_name }}</div>
              <small class="text-muted">Recipe • {{ currentPost.recipes.pet_kind }} • {{ currentPost.recipes.pet_breed }}</small>
            </div>
            <div class="ms-auto text-end">
              <div class="fw-bold">Cost: <span class="text-success">{{ formatCurrency(currentPost.recipes.price_per_week) }}</span> / Week</div>
              <div class="small text-muted">{{ formatDate(currentPost.recipes.created_at) }}</div>
            </div>
          </div>

          <h1 class="post-title h3 headingFont fw-bold mb-2">{{ currentPost.recipes.recipe_name }}</h1>
          <p class="post-subtitle text-muted mb-3">{{ currentPost.recipes.description }}</p>

          <!-- Nutrition grid -->
          <section class="nutrition-section mb-3">
            <h6 class="mb-2">Nutrition</h6>
            <div class="nutr-grid">
              <div class="nutr-item" v-for="(n, idx) in currentPost.recipes.nutrition_stats" :key="n.LabelName + '-' + idx">
                <BaseLabel size="sm" variant="dark">{{ n.LabelName }}</BaseLabel>
                <BaseStatNumber :value="n.value" :unit="n.unit" />
              </div>
            </div>
          </section>

          <!-- actions -->
          <div class="d-flex align-items-center gap-3">
            <Button label="View Full Recipe" class="btn-primary" />
            <Button outline label="Save" />
            <div class="ms-auto d-flex align-items-center gap-3">
              <ShareButton :initialText="combinedShareText" :title="currentPost.recipes.recipe_name" button-label="Share" />
              <UpvoteControl :initialVote="serverVote" :score="currentPost.vote_score" @vote="onVote" />
            </div>
          </div>
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
                        <Comment v-for="comment in displayedComments" 
                        :key="comment.id" 
                        :Name="comment.profiles.display_name" 
                        :Picture="comment.profiles.avatar_url" 
                        :Content="comment.content" 
                        :timestamp="comment.created_at" />
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
  box-shadow: 0 6px 22px rgba(8,18,40,0.06);
}
.avatar { width: 44px; height: 44px; }
.nutrition-section { background: rgba(250,250,255,0.6); padding: .75rem; border-radius: 8px; }
.nutr-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 16px;
  align-items: center;
}
.nutr-item { display:flex; justify-content:space-between; align-items:center; padding:6px 8px; background: rgba(255,255,255,0.6); border-radius:6px; }
@media (max-width: 576px) {
  .nutr-grid { grid-template-columns: 1fr; }
  .ms-auto { margin-left: 0 !important; }
}

</style>