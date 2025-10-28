<script setup>
import { computed, ref } from 'vue';
import BaseAvatar from '@/components/atomic/BaseAvatar.vue';
import BaseLabel from '@/components/atomic/BaseLabel.vue';
import BaseStatNumber from '@/components/atomic/BaseStatNumber.vue';
import ShareButton from '@/components/Organisms/social/ShareButton.vue';
import UpvoteControl from '@/components/molecules/social/VoteControl.vue';
import Button from '@/components/atoms/button.vue';
import Comment from '@/components/atoms/social/Comment.vue';
import TextInput from '@/components/atoms/TextInput.vue';
// Dummy static Data in 
const props = defineProps({
  Content : {type: String, default: 'This is the new Recipe that I made. Check it out!'},
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
    type: Array,
    default: () => ( [
      { LabelName: 'Iron', value: '69', unit: 'mg' },
      { LabelName: 'Calcium', value: '120', unit: 'mg' },
      { LabelName: 'Vitamin A', value: '69', unit: 'mg' },
      { LabelName: 'Fibre', value: '4', unit: 'g' }
    ])
  }
});

// --- Dummy static comments loaded into the comment section ---
const comments = ref([
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

// client-side UI helpers for comment list
const showAllComments = ref(false);
const submitting = ref(false);

const displayedComments = computed(() => {
  return showAllComments.value ? comments.value : comments.value.slice(0, 3);
});
const hasMoreComments = computed(() => comments.value.length > displayedComments.value.length);

// simple comment submit handler (adds new comment to top)
async function handleCommentSubmit(text) {
  if (!text || !text.trim()) return;
  submitting.value = true;
  try {
    const now = new Date().toISOString();
    const newComment = {
      id: `c${Date.now()}`,
      profiles: { display_name: props.Username || 'You', avatar_url: props.User_Image || 'https://picsum.photos/seed/default/80/80' },
      content: text.trim(),
      created_at: now
    };
    comments.value.unshift(newComment);
    // optionally expand to show the new comment
    showAllComments.value = true;
  } finally {
    submitting.value = false;
  }
}

// add reactive vote state and handler (mirror ViewPost pattern)
const serverVote = ref(0); // -1 | 0 | 1

function onVote(v) {
  const num = Number(v) || 0;
  const normalized = [-1, 0, 1].includes(num) ? num : 0;
  serverVote.value = normalized;
  console.log('[VOTE]', serverVote.value);
}

// --- helpers used elsewhere in template ---
const defaultAvatar = props.User_Image || 'https://picsum.photos/seed/defaultpet/120/120';
const combinedShareText = computed(() => `${props.Recipe_Name} — ${props.Recipe_Desc}\n\nCheck this recipe on Peddit!`);
function formatCurrency(v){ return typeof v === 'number' ? `$ ${v.toFixed(2)}` : v; }
function formatDate(d){ return d ? new Date(d).toLocaleDateString() : ''; }
</script>

<template>
  <main class="bg-light py-4">
    <div class="container-md mx-auto">
      <div class="card post-modern-card">
        <div class="card-body">
          <div class="post-meta d-flex align-items-center gap-3 small mb-3">
            <BaseAvatar :src="defaultAvatar" size="sm" class="avatar" />
            <div>
              <div class="fw-bold text-body">@{{ props.Username }}</div>
              <small class="text-muted">Recipe • {{ props.Animal_Type }} • {{ props.Animal_Breed }}</small>
            </div>
            <div class="ms-auto text-end">
              <div class="fw-bold">Cost: <span class="text-success">{{ formatCurrency(props.Cost_Per_Week) }}</span> / Week</div>
              <div class="small text-muted">{{ formatDate(props.createdAt) }}</div>
            </div>
          </div>
          <!-- Content Text -->
          <h2 v-if="props.Content && props.Content.trim()" class="mb-3 bodyFont">{{ props.Content }}</h2>

          <!-- START: encapsulated recipe block -->
          <div class="recipe-banner mb-3 shadow-sm">
            <div class="recipe-badge">Recipe</div>

            <div class="recipe-body">
              <h1 class="post-title h3 headingFont fw-bold mb-2">{{ props.Recipe_Name }}</h1>
              <p class="post-subtitle text-muted mb-3">{{ props.Recipe_Desc }}</p>

              <!-- Nutrition grid (move inside banner) -->
              <section class="nutrition-section mb-3">
                <h6 class="mb-2">Nutrition</h6>
                <div class="nutr-grid">
                  <div class="nutr-item" v-for="(n, idx) in props.Recipe_Nutrition_Stats" :key="n.LabelName + '-' + idx">
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
                <Button label="View Full Recipe" class="btn-primary" />
                <Button outline label="Save" />
                <div class="ms-auto d-flex align-items-center gap-3">
                  <ShareButton :initialText="combinedShareText" :title="props.Recipe_Name" button-label="Share" />
                  <UpvoteControl :initialVote="serverVote" :score="props.Vote_score" @vote="onVote" />
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