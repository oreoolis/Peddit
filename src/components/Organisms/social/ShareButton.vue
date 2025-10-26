<script setup>
import { ref, nextTick, onBeforeUnmount, watch } from 'vue';
import Button from '@/components/atoms/button.vue';
import ButtonTogglable from '@/components/atoms/buttonTogglable.vue';
import SelectAndOption from '@/components/atoms/SelectAndOption.vue';

const props = defineProps({
  initialText: { type: String, default: '' },
  title: { type: String, default: 'Share' },
  url: { type: String, default: () => (typeof window !== 'undefined' ? window.location.href : '') },
  buttonLabel: { type: String, default: 'Share' }
});

const show = ref(false);
const shareText = ref('');
const shareTextRef = ref(null);
const showClipboardToast = ref(false);
const selectedShare = ref(null);

// reference to the SelectAndOption component root so we can wire native change listener
const selectCompRef = ref(null);
let nativeSelectEl = null;
let nativeChangeHandler = null;

const providers = [
  { value: 'twitter', label: 'Twitter' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'facebook', label: 'Facebook' }
];

function init() { shareText.value = props.initialText || `Check this out:\n\n${props.url}`; }

// --- missing helpers (required by copyAndToast / copyAndClose / onNativeShareClick) ---
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text || '');
      return true;
    }
  } catch (e) {
    console.warn('copyToClipboard failed', e);
  }
  return false;
}

async function tryNativeShare() {
  if (!navigator.share) return false;
  try {
    await navigator.share({ title: props.title, text: shareText.value, url: props.url });
    return true;
  } catch (e) {
    console.warn('tryNativeShare failed', e);
    return false;
  }
}

function openProvider(p) {
  if (!p) return;
  const t = encodeURIComponent(shareText.value || '');
  const u = encodeURIComponent(props.url || '');
  const map = {
    twitter: `https://twitter.com/intent/tweet?text=${t}`,
    telegram: `https://t.me/share/url?url=${u}&text=${t}`,
    whatsapp: `https://wa.me/?text=${t}%20${u}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`
  };
  const url = map[p];
  if (url) {
    // MUST be synchronous to avoid popup blockers
    window.open(url, 'share', 'width=700,height=500');
  }
  selectedShare.value = null;
  if (nativeSelectEl) nativeSelectEl.value = '';
}
// --- end helpers ---

/* NEW helper functions (replace inline handlers to avoid template compilation using _ctx.setTimeout) */
async function copyAndToast() {
  await copyToClipboard(shareText.value);
  showClipboardToast.value = true;
  window.setTimeout(() => { showClipboardToast.value = false; }, 2000);
}

async function copyAndClose() {
  await copyToClipboard(shareText.value);
  showClipboardToast.value = true;
  window.setTimeout(() => { showClipboardToast.value = false; }, 2000);
  close();
}

async function onNativeShareClick() {
  const ok = await tryNativeShare();
  if (ok) close();
}

/* ...existing code... */
function open() { init(); show.value = true; document.body.classList.add('modal-open'); nextTick(()=> shareTextRef.value?.focus()); attachNativeSelectListener(); }
function close() { show.value = false; document.body.classList.remove('modal-open'); detachNativeSelectListener(); }

async function primaryShare() {
  const ok = await tryNativeShare();
  if (ok) return close();
  const copied = await copyToClipboard(shareText.value);
  if (copied) { showClipboardToast.value = true; setTimeout(()=> showClipboardToast.value=false,2000); close(); }
}

/* -- attach a native change listener to the rendered <select> inside the SelectAndOption component
   This avoids modifying SelectAndOption and ensures selection works even if that component doesn't emit events.
*/
function attachNativeSelectListener() {
  nextTick(() => {
    try {
      const compRoot = selectCompRef.value?.$el ?? selectCompRef.value;
      if (!compRoot) return;
      const sel = compRoot.querySelector && compRoot.querySelector('select');
      if (!sel) return;
      nativeSelectEl = sel;
      nativeChangeHandler = (e) => {
        const val = e.target.value || null;
        selectedShare.value = val;
        if (val) openProvider(val);
      };
      sel.addEventListener('change', nativeChangeHandler);
    } catch (e) {
      // ignore attach errors
      console.warn('attachNativeSelectListener failed', e);
    }
  });
}

function detachNativeSelectListener() {
  try {
    if (nativeSelectEl && nativeChangeHandler) {
      nativeSelectEl.removeEventListener('change', nativeChangeHandler);
    }
  } catch (e) {
    /* ignore */
  } finally {
    nativeSelectEl = null;
    nativeChangeHandler = null;
  }
}

onBeforeUnmount(() => {
  detachNativeSelectListener();
});

/* also watch show so we attach/detach when modal toggles (safety) */
watch(show, (v) => {
  if (v) attachNativeSelectListener();
  else detachNativeSelectListener();
});

watch(selectedShare, (val) => {
  if (val) {
    // call synchronously
    openProvider(val);
  }
});
</script>

<template>
  <div class="d-inline-block">
    <Button variant="subtle" @click="open" :label="buttonLabel">
      <i class="bi bi-share-fill me-2" ></i>
    </Button>

    <div v-if="show" class="share-modal-backdrop " @keydown.esc="close" role="dialog" aria-modal="true">
      <div class="share-modal " role="document" @click.stop>
        <header class="d-flex align-items-center justify-content-between mb-2">
          <div class="d-flex gap-2 align-items-center">
            <i class="bi bi-share-fill fs-5"></i>
            <h5 class="m-0">Share post</h5>
          </div>
          <Button outline color="danger" label="" @click="close"><i class="bi bi-x-lg"></i></Button>
        </header>

        <div class="mb-3 ">
          <label class="form-label small mb-1">Message</label>
          <textarea ref="shareTextRef" v-model="shareText" rows="4" class="form-control mb-2"></textarea>

          <div class="d-flex gap-2 flex-wrap align-items-center mb-2">
            <!-- use new handler -->
            <ButtonTogglable 
              @click="copyAndToast" 
              labelON="Copied!" 
              labelOFF="Copy" 
              iconLinkON="bi-clipboard-fill" 
              iconLinkOFF="bi-clipboard"
              colorON="primary" />

            <!-- native share now uses named handler -->
            <Button color="primary" label="Native Share" @click="onNativeShareClick"><i class="bi bi-phone-fill me-1"></i> </Button>

            <SelectAndOption ref="selectCompRef" class="ms-1" :options="providers" v-model="selectedShare" defaultLabel="More..." />
            <div class="ms-auto small text-muted">Preview:</div>
          </div>

          <div class="preview-box p-2 small text-break">{{ shareText }}</div>
        </div>

        <footer class="d-flex justify-content-end gap-2">
          <!-- footer now copies and closes via function -->
          <Button color="success" label="Copy & Done" @click="copyAndClose"><i class="bi bi-check2 me-1"></i></Button>
        </footer>
      </div>
    </div>

    <div v-if="showClipboardToast" class="clipboard-toast alert alert-success small position-fixed bottom-0 end-0 m-3">Share text copied to clipboard.</div>
  </div>
</template>

<style scoped>
.share-modal-backdrop{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:1rem;z-index:2000;background:rgba(0,0,0,0.32)}
.share-modal{width:100%;max-width:560px;background:var(--bs-body-bg,#fff);border-radius:8px;padding:1rem;box-shadow:0 10px 30px rgba(0,0,0,0.12)}
.preview-box{background:#fbfdff;border:1px dashed rgba(0,0,0,0.06);border-radius:6px;padding:.5rem;white-space:pre-wrap}
.modal-open{overflow:hidden}
</style>