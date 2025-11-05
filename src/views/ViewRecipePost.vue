<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseAvatar from '@/components/atomic/BaseAvatar.vue';
import BaseLabel from '@/components/atomic/BaseLabel.vue';
import BaseStatNumber from '@/components/atomic/BaseStatNumber.vue';
import ShareButton from '@/components/Organisms/social/ShareButton.vue';
import UpvoteControl from '@/components/molecules/social/VoteControl.vue';
import Button from '@/components/atoms/button.vue';
import MealInfoModal from '@/components/PetViewComponents/MealInfoModal.vue';
import Comment from '@/components/atoms/social/Comment.vue';
import TextInput from '@/components/atoms/TextInput.vue';
import { usePetNutritionStore } from '@/stores/petNutritionStore';
import { storeToRefs } from 'pinia';
import { usePostStore } from '@/stores/postStore';
import { supabase } from '@/lib/supabaseClient';
import { useCommentStore } from '@/stores/commentStore';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
// Dummy static Data in 
const props = defineProps({
  Content : {type: String, default: 'This is the new Recipe that I made. Check it out!'},
  postId: {type: String, required: true},
  RecipeId: { type: String, default: '123e' },
  Username: { type: String, default: 'JohnDoe' },
  User_Image: { type: String, default: '/src/assets/person.jpg' },
  Recipe_Name: { type: String, default: 'Beef Boost' },
  Recipe_Desc: { type: String, default: 'A Yummy Treat for golden Retrievers' },
  Vote_score: { type: Number, default: 99 },
  Comment_count: { type: Number, default: 12 },
  Animal_Type: { type: String, default: 'dog' },
  Animal_Breed: { type: String, default: 'Golden Retriever' },
  Cost_Per_Week: { type: Number, default: 25.5 },
  Recipe_Nutrition_Stats: {
    // Accept nutrition as an object keyed by nutrient name, e.g.
    // { fat: { unit: 'g', value: 1.2 }, iron: { unit: 'mg', value: 0.7 } }
    type: Object,
    default: () => ({
      'fat': {
        unit: "g",
        value: 1.2},
      "iron": {
        unit: "mg",
        value: 0.7
        }
        })
  }
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
const router = useRouter();

const commentStore = useCommentStore();
const { submitting, comments } = storeToRefs(commentStore)

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const userStore = useUserStore();
const { profile: authorProfile } = storeToRefs(userStore);

const isLiked = ref(false);
const serverVote = ref(0); // -1 | 0 | 1
const showMealInfoModal = ref(false);

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
// Disable the comment input when submitting or when the user is not authenticated
const commentDisabled = computed(() => {
  return submitting.value || !user.value || !user.value.id;
});

// Show a helpful label when the input is disabled due to auth
const commentLabel = computed(() => {
  return (!user.value || !user.value.id) ? 'Please Log in to comment' : 'What are your thoughts?';
});
// --- END: "Show More" Logic ---

onMounted(async () => {

  if (props.postId) {

      await petNutriStore.fetchRecipePostById(props.postId);
      await commentStore.fetchCommentsByPostID(props.postId);
      // Attempt to determine current user's persisted vote for UI (same logic as ViewPost)
      try {
        const post = currentPost.value;
        let myVote = 0;
        if (post) {
          if (Array.isArray(post.post_votes)) {
            const found = post.post_votes.find(v => v && v.voter_id === user.value?.id);
            if (found) myVote = Number(found.vote) || 0;
          }
          if (!myVote && typeof post.user_vote !== 'undefined') {
            myVote = Number(post.user_vote) || 0;
          }
          if (!myVote && typeof post.my_vote !== 'undefined') {
            myVote = Number(post.my_vote) || 0;
          }
        }

        // Fallback: query post_votes table directly
        if ((myVote === 0) && user.value?.id) {
          const { data: voteRow, error: voteErr } = await supabase
            .from('post_votes')
            .select('vote')
            .eq('post_id', props.postId)
            .eq('voter_id', user.value.id)
            .maybeSingle();

          if (!voteErr && voteRow) {
            myVote = Number(voteRow.vote) || 0;
          }
        }

        serverVote.value = myVote;
      } catch (err) {
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
  // Require authentication before allowing vote changes
  if (!user.value || !user.value.id) {
    alert('Please sign in to vote.');
    return;
  }

  const num = Number(v) || 0;
  const normalized = [-1, 0, 1].includes(num) ? num : 0;
  serverVote.value = normalized;

  // Perform vote via postStore (centralized) then refresh recipe post so the UI shows updated score
  await postStore.voteOnPost(currentPost.value.id, user.value.id, serverVote.value);
  // refresh the recipe post to pick up updated vote_score
  try {
    await petNutriStore.fetchRecipePostById(props.postId);
  } catch (err) {
    console.warn('Failed to refresh recipe post after voting', err);
  }
};

const handleAuthRequired = () => {
  // parent reacts when VoteControl blocked an interaction due to disabled state
  alert('Please sign in to vote.');
  router.push('/login');
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

// derive an array from the object-shaped nutrition prop so the template can render it
const nutritionArray = computed(() => {
  const obj = currentPost.value?.recipes?.recipe_ingredients[0].food_ingredients.nutrition || {};
  // if it's already an array (back-compat), return it
  if (Array.isArray(obj)) return obj;

  return Object.keys(obj).map(key => ({
    LabelName: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: obj[key]?.value ?? 0,
    unit: obj[key]?.unit || ''
  }));
});

// --- helpers used elsewhere in template ---
const defaultAvatar = props.User_Image || 'https://picsum.photos/seed/defaultpet/120/120';
const combinedShareText = computed(() => {
  // Prefer the loaded post's recipe data; fall back to props or a generic message
  const title = currentPost.value?.recipes?.recipe_name || props.Recipe_Name || 'A Recipe on Peddit';
  const rawDesc = currentPost.value?.recipes?.description || currentPost.value?.content || props.Recipe_Desc || '';
  const desc = stripHtml(String(rawDesc || '')).trim();
  const url = (typeof window !== 'undefined' && window.location) ? window.location.href : '';
  const body = desc ? `${title} — ${desc}` : title;
  return `${body}\n\nCheck this recipe on Peddit!${url ? `\n${url}` : ''}`;
});
function formatCurrency(v){ return typeof v === 'number' ? `$ ${v.toFixed(2)}` : v; }
function formatDate(d){
  if (!d) return '';
  const date = new Date(d);
  // human friendly: relative short (e.g. "2h ago") when recent, otherwise medium date + short time
  try {
    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    const formatted = date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

    if (diffSec < 5) return `just now · ${formatted}`;
    if (diffSec < 60) return `${diffSec}s ago · ${formatted}`;
    if (diffMin < 60) return `${diffMin}m ago · ${formatted}`;
    if (diffHour < 24) return `${diffHour}h ago · ${formatted}`;
    if (diffDay < 7) return `${diffDay}d ago · ${formatted}`;

    return formatted;
  } catch (err) {
    return new Date(d).toLocaleString();
  }
}
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
              <!-- <div class="fw-bold">Cost: <span class="text-success">{{ formatCurrency(currentPost.recipes.price_per_week) }}</span> / Week</div> -->
              <div class="small text-muted">{{ formatDate(currentPost.created_at) }}</div>
            </div>
          </div>
          <!-- Content Text -->
          <h2 v-if="currentPost.content && currentPost.content.trim()" class="mb-3 bodyFont">{{ currentPost.content }}</h2>

          <!-- START: encapsulated recipe block -->
          <div class="recipe-banner mb-3 shadow-sm">
            <div class="recipe-badge">Recipe</div>

            <div class="recipe-body">
              <h1 class="post-title h3 headingFont fw-bold mb-2">{{ currentPost.recipes.recipe_name }}</h1>
              <p class="post-subtitle text-muted mb-3">{{ currentPost.recipes.description }}</p>

              <!-- Nutrition grid (move inside banner) -->
              <section class="nutrition-section mb-3">
                <h6 class="mb-2">Nutrition</h6>
                <div class="nutr-grid">
                  <div class="nutr-item" v-for="(n, idx) in nutritionArray" :key="n.LabelName + '-' + idx">
                    <BaseLabel size="sm" variant="dark">{{ n.LabelName }}</BaseLabel>
                    <BaseStatNumber :value="n.value" :unit="n.unit" />
                  </div>
                </div>
              </section>
              </div>
            </div>
          <!-- END: encapsulated recipe block -->
              <!-- actions (kept inside banner for clarity) -->
              <div class="d-flex align-items-center gap-3">
                <Button label="View Full Recipe" class="btn-primary" @click="showMealInfoModal = true" />
                <div class="ms-auto d-flex align-items-center gap-3">
                  <ShareButton :initialText="combinedShareText" :title="currentPost.recipes.recipe_name" button-label="Share" />
                  <UpvoteControl 
                  :initialVote="serverVote" 
                  :score="currentPost.vote_score"
                  :disabled="!user || !user.id"
                  @vote="onVote"
                  @auth-required="handleAuthRequired"
                  />
                </div>
              </div>

          

        </div>
      </div>

      <!-- Comment Section -->

                 <div v-if="comments && comments.length > 0" class="card mt-4" id="CommentSection">
                <div class="card-body">
                    <h5 class="mb-4">Comments ({{ comments.length }})</h5>
                    <TextInput class="mb-4" :label="commentLabel" @submit="handleCommentSubmit" :disabled="commentDisabled" />
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
                    <TextInput class="mb-4" :label="commentLabel" @submit="handleCommentSubmit" :disabled="commentDisabled" />
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
  <!-- Meal Info Modal -->
  <MealInfoModal
    :rec_id="currentPost?.recipe_id ?? currentPost?.recipes?.id ?? ''"
    :show="showMealInfoModal"
    @update:show="val => showMealInfoModal = val"
    :editable="false"
  />
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
/* new: visual separation for recipe info */
.recipe-banner {
  background: linear-gradient(-90deg, #ffffff, #f8f8f8);
  border-left: 4px solid var(--bs-primary); /* primary accent */
  padding: 14px;
  border-radius: 10px;
}

/* small badge label at top-left of the banner */
.recipe-badge {
  font-size: 12px;
  color: var(--bs-primary);
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: 0.3px;
}

/* slightly darker title inside the banner for clarity */
.recipe-body .post-title { color: #0b2540; }

/* make the nutrition area softer inside the banner */
.recipe-banner .nutrition-section {
  background: #f3f8ff;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
}

/* keep existing grid responsiveness */
@media (max-width: 576px) {
  .nutr-grid { grid-template-columns: 1fr; }
  .ms-auto { margin-left: 0 !important; }
}
</style>