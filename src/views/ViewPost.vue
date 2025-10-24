<script setup>
// view of a single post with comment section
import { onMounted, ref, computed } from 'vue';
import Comment  from '../components/atoms/social/Comment.vue';
import TextInput from '@/components/atoms/TextInput.vue';
import searchBar from '@/components/atoms/searchBar.vue';
import { usePostStore } from '@/stores/postStore';
import { storeToRefs } from 'pinia';
import { useCommentStore } from '@/stores/commentStore';
import { useProfileStore } from '@/stores/profileStore';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import SelectAndOption from '@/components/atoms/SelectAndOption.vue';
import Button from '@/components/atoms/button.vue';
import UpvoteControl from '@/components/molecules/social/VoteControl.vue';

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

const onVote = (v) => {
  const num = Number(v) || 0;
  const normalized = [-1, 0, 1].includes(num) ? num : 0;
  serverVote.value = normalized;
  console.log('[VOTE]', serverVote.value); // prints -1, 0 or 1
};

// helper: remove HTML and shorten content for share text
function stripHtml(html = '') {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || '').trim();
}

const showClipboardToast = ref(false);

// new: editable share text so user can tweak before sending
import { watch, nextTick } from 'vue';
import ButtonTogglable from '@/components/atoms/buttonTogglable.vue';
const showShareModal = ref(false);
const shareTextRef = ref(null);
const shareText = ref('');

// keep combinedMessage for quick reset/default
const combinedMessage = computed(() => {
  const url = window.location.href;
  return `Check out this link from Peddit!\n\n${url}`;
});

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    console.warn('clipboard write failed', e);
  }
  return false;
}

async function tryNativeShare() {
  if (!navigator.share) return false;
  try {
    // omit `url` to avoid double-rendering in some clients; share the full text
    await navigator.share({
      title: currentPost?.title || 'Peddit',
      text: shareText.value || combinedMessage.value
    });
    return true;
  } catch (e) {
    console.warn('navigator.share failed', e);
    return false;
  }
}

function openProviderShare(provider) {
  const url = window.location.href;
  const text = encodeURIComponent(shareText.value || combinedMessage.value);
  let shareUrl = '';
  if (provider === 'twitter') {
    shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
  } else if (provider === 'telegram') {
    shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`;
  } else if (provider === 'whatsapp') {
    shareUrl = `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`;
  } else if (provider === 'facebook') {
    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  } else {
    copyToClipboard(decodeURIComponent(text));
    return;
  }
  const w = 700, h = 500;
  const left = (screen.width / 2) - (w / 2);
  const top = (screen.height / 2) - (h / 2);
  window.open(shareUrl, 'share', `width=${w},height=${h},top=${top},left=${left}`);
}

async function openShareModal() {
  // set editable text to default combined message, but don't auto-copy
  shareText.value = combinedMessage.value;
  showShareModal.value = true;
}

function closeShareModal() {
  showShareModal.value = false;
}

// focus & select textarea when modal opens
watch(showShareModal, async (val) => {
  if (val) {
    await nextTick();
    try { shareTextRef.value?.focus(); shareTextRef.value?.select(); } catch (e) {}
  }
});


const sharePost = async () => {
  const url = window.location.href;
  const combined = `Check out this link from Peddit!\n\n${url}`;
  const shareData = { title: currentPost?.title || 'Peddit', text: combined, url };

  // 1) Copy combined message to clipboard (reliable fallback / pasteable)
  const copied = await copyToClipboard(combined);
  if (copied) {
    showClipboardToast.value = true;
    setTimeout(() => (showClipboardToast.value = false), 3000);
  }

  // 2) Try native share (may drop text on some desktop targets)
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      console.log('[SHARE] navigator.share used', shareData);
      return;
    }
  } catch (err) {
    console.warn('navigator.share failed or dropped text:', err);
  }

  // If navigator.share not available or failed, clipboard already has the full message.
  console.log('[SHARE] fallback: combined text copied to clipboard');
};


const shareProviders = [
  { value: 'native', label: 'Native Share' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'copy', label: 'Copy to Clipboard' }
];


const selectedShare = ref(null);

watch(selectedShare, async (val) => {
  if (!val) return;
  // reset selection quickly so the same choice can be picked again
  selectedShare.value = null;

  if (val === 'native') {
    const ok = await tryNativeShare();
    if (ok) closeShareModal();
    return;
  }
  if (val === 'copy') {
    const text = shareText.value || combinedMessage.value;
    const copied = await copyToClipboard(text);
    if (copied) {
      showClipboardToast.value = true;
      setTimeout(() => (showClipboardToast.value = false), 2000);
    }
    return;
  }
  // other providers: open provider share window
  openProviderShare(val);
});


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

                    <Button variant="subtle" label="Share" @click="openShareModal"><i class="bi bi-share-fill me-2"></i></Button>

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

            <!-- clipboard toast -->
            <div v-if="showClipboardToast" class="clipboard-toast alert alert-success small position-fixed bottom-0 end-0 m-3" role="status">
              Share text copied to clipboard — paste into your app to share.
            </div>

            <!-- Share Modal -->
            <div v-if="showShareModal" class="share-modal-backdrop" @keydown.esc="closeShareModal" role="dialog" aria-modal="true">
              <div class="share-modal" role="document" @click.stop>
                <header class="share-modal-header d-flex align-items-center justify-content-between">
                  <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-share-fill fs-5"></i>
                    <h5 class="m-0">Share post</h5>
                  </div>
                  <Button outline color="danger"  @click="closeShareModal" label="">
                    <i class="bi bi-x-lg"></i>
                  </Button>
                </header>

                <div class="share-modal-body mt-3">
                  <label class="form-label small mb-1">Message</label>
                  <textarea
                    ref="shareTextRef"
                    v-model="shareText"
                    rows="4"
                    class="form-control share-textarea mb-2"
                    aria-label="Share message"
                  ></textarea>

                  <div class="d-flex gap-2 flex-wrap align-items-center mb-2">
                    <ButtonTogglable
                      @click="() => { copyToClipboard(shareText); }"
                      labelON="Copied!"
                      labelOFF="Copy"
                      colorON="primary"
                      colorOFF="primary"
                      iconLinkON="bi-clipboard-fill"
                      iconLinkOFF="bi-clipboard"
                    ></ButtonTogglable>

                    <button class="btn btn-primary btn-sm" @click="async () => { const ok = await tryNativeShare(); if (ok) closeShareModal(); }">
                      <i class="bi bi-phone-fill me-1"></i> Native Share
                    </button>

                    <!-- use SelectAndOption for provider selection (exclude native/copy there to keep them separate) -->
                    <SelectAndOption
                      class="ms-1"
                      :options="shareProviders.filter(p => p.value !== 'native' && p.value !== 'copy')"
                      v-model="selectedShare"
                      :defaultLabel="'More...'"
                    />

                    <div class="ms-auto text-muted small">Preview:</div>
                  </div>

                  <div class="preview-box p-2 small text-break">{{ shareText }}</div>


                </div>

                <footer class="share-modal-footer mt-3 d-flex justify-content-end gap-2">
                  <Button class="btn btn-success" label="Copy & Done" @click="() => { copyToClipboard(shareText); showClipboardToast = true; setTimeout(()=> showClipboardToast = false, 2000); }">
                    <i class="bi bi-check2 me-1"></i> 
                  </Button>
                </footer>
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
.clipboard-toast {
  z-index: 1200;
  opacity: 0.98;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
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
.share-modal {
  width: 100%;
  max-width: 680px;
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,255,0.96));
  border-radius: 12px;
  box-shadow: 0 24px 60px rgba(8,18,40,0.28);
  padding: 1rem;
  border: 1px solid rgba(10,20,40,0.04);
  animation: popIn 180ms cubic-bezier(.2,.9,.2,1);
}

/* header / body / footer */
.share-modal-header { padding-bottom: 0.4rem; border-bottom: 1px solid rgba(15,23,42,0.04); }
.share-modal-body { padding-top: 0.6rem; color: #203243; }
.share-modal-footer { padding-top: 0.6rem; border-top: 1px solid rgba(15,23,42,0.03); }

/* textarea + preview */
.share-textarea {
  min-height: 84px;
  resize: vertical;
  border-radius: 8px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
}
.preview-box {
  background: #fbfdff;
  border: 1px dashed rgba(15,23,42,0.06);
  border-radius: 8px;
  margin-top: 6px;
  white-space: pre-wrap;
}

/* small screen: transform into bottom-sheet */
@media (max-width: 576px) {
  .share-modal-backdrop { align-items: flex-end; padding: 0; background: linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.36)); }
  .share-modal {
    border-radius: 12px 12px 0 0;
    max-width: 100%;
    width: 100%;
    padding: 0.9rem;
    box-shadow: 0 -8px 30px rgba(6,12,24,0.18);
    animation: slideUp 220ms cubic-bezier(.2,.9,.2,1);
  }
}
@keyframes popIn { from { transform: translateY(6px) scale(.995); opacity: 0 } to { transform: translateY(0) scale(1); opacity: 1 } }
@keyframes slideUp { from { transform: translateY(18px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
</style>