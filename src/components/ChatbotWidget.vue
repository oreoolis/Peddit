<script setup>
/**
 * Peddit Chatbot Widget (Batch 1 — patch)
 * - Floating paw bubble + panel UI
 * - LocalStorage persistence (key: 'peddit_chat')
 * - Markdown rendering (safe via DOMPurify)
 * - Suggestion chips (shown only before FIRST user message)
 * - Strict feature flag: shows only when VITE_CHATBOT_ENABLED === 'true'
 *
 * Env:
 *  - VITE_CHATBOT_ENABLED ('true' to show)
 *  - VITE_CHAT_PROXY_URL (default /api/chat)
 *  - VITE_CHAT_MODEL (e.g., qwen/qwen-2.5-7b-instruct or openrouter/auto)
 */

// #region Imports
import { ref, reactive, watch, nextTick, onMounted, onBeforeUnmount, computed } from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import { sendChat } from '@/lib/chatApi'
import pawUrl from '@/assets/Main_Logo.png' // replace with your paw asset if needed
// #endregion

// #region Env & Flags
const CHAT_ENABLED = import.meta.env.VITE_CHATBOT_ENABLED === 'true'
const CHAT_MODEL = import.meta.env.VITE_CHAT_MODEL || 'openrouter/auto'
// #endregion

// #region State & Refs
const open = ref(false)
const unread = ref(0)
const sending = ref(false)
const input = ref('')
const inputEl = ref(null)
const listEl = ref(null)
const errorText = ref('')

const md = new MarkdownIt({
  html: false,     // do not trust raw HTML from model
  linkify: true,   // auto-link URLs
  breaks: true,    // respect line breaks
})
function renderMarkdown(text) {
  const html = md.render(text || '')
  return DOMPurify.sanitize(html)
}

// Suggestion chips (static for now; can vary by "mode" later)
// Shown ONLY before the first user message is sent.
const suggestions = [
  'Create a 7-day meal plan for a 2-year-old Labrador (25kg)',
  'List 10 safe fruits/veggies under 100 kcal per snack',
  'My dog has diarrhea—what should I do?',
  'How much kibble per day for steady weight loss?',
]

// #endregion

// #region System prompt & persistence
const systemMsg = {
  role: 'system',
  content:
    'You are Peddit’s helpful assistant. Be concise, friendly, and focus on pet nutrition, ' +
    'pet profiles, and social help. If you need user account data, ask first. Use short lists, ' +
    'practical tips, and clear cautions. If symptoms seem urgent, recommend seeing a vet.' +
    'Always ask for user pet characteristics like age, breed, gender or any kind of health' +
    'allergy or complication for better response. Also, ask where user is from as well so' +
    'that you can recommend places or items or products that could be within their vicinity.'
}

const state = reactive({
  messages: loadHistory()
})

function sanitizeHistory(msgs) {
  return (msgs || []).map(m =>
    (m?.role === 'assistant' && m?.content === '…thinking')
      ? { ...m, content: '(previous reply not saved)' }
      : m
  )
}

function loadHistory() {
  try {
    const raw = localStorage.getItem('peddit_chat')
    if (!raw) return [{ role: 'assistant', content: 'Hi! Ask me anything about your pet.' }]
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? sanitizeHistory(parsed) : [{ role: 'assistant', content: 'Hi! Ask me anything about your pet.' }]
  } catch {
    return [{ role: 'assistant', content: 'Hi! Ask me anything about your pet.' }]
  }
}

function persist() {
  try { localStorage.setItem('peddit_chat', JSON.stringify(state.messages)) } catch {}
}

// persist on any deep change
watch(() => state.messages, persist, { deep: true })

// auto-scroll on new message
watch(
  () => state.messages.length,
  async () => {
    await nextTick()
    if (listEl.value) listEl.value.scrollTop = listEl.value.scrollHeight
  }
)

// Computed: whether any user message exists in history
const hasUserMessage = computed(() => state.messages.some(m => m?.role === 'user'))
// Computed: show suggestion chips ONLY before first user message
const showSuggestions = computed(() => !hasUserMessage.value && open.value && !sending.value)
// #endregion

// #region UI handlers
function autosize() {
  const el = inputEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}
function focusInput() { nextTick(() => inputEl.value?.focus()) }

function toggle() {
  if (!CHAT_ENABLED) return
  open.value = !open.value
  if (open.value) { unread.value = 0; focusInput() }
  errorText.value = ''
}

function onDocKey(e) { if (e.key === 'Escape' && open.value) toggle() }
onMounted(() => document.addEventListener('keydown', onDocKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onDocKey))

function useSuggestion(s) {
  input.value = s
  focusInput()
  autosize()
}
// #endregion

// #region Chat flow
async function onSend() {
  const text = input.value?.trim()
  if (!text || sending.value) return
  errorText.value = ''
  input.value = ''
  autosize()

  state.messages.push({ role: 'user', content: text })
  state.messages.push({ role: 'assistant', content: '…thinking' })
  sending.value = true

  try {
    const recent = state.messages.filter(Boolean).slice(-20)
    const payloadMessages = [systemMsg, ...recent.filter(m => !(m.role === 'assistant' && m.content === '…thinking'))]
    const reply = await sendChat(payloadMessages, { model: CHAT_MODEL })

    const idx = state.messages.findIndex(m => m.role === 'assistant' && m.content === '…thinking')
    if (idx !== -1) state.messages[idx].content = reply || '(no response)'
    persist()

    if (!open.value) unread.value += 1
  } catch (e) {
    const idx = state.messages.findIndex(m => m.role === 'assistant' && m.content === '…thinking')
    if (idx !== -1) state.messages.splice(idx, 1)
    errorText.value = e?.message || 'Chat failed. Check backend URL or quota.'
    persist()
  } finally {
    sending.value = false
  }
}

function onKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    onSend()
  }
}

function clearChat() {
  state.messages = [{ role: 'assistant', content: '🗑️Chat Cleared🗑️\nHi I am Peddit, how can I help you today?' }]
  persist()
}

onMounted(() => {
  nextTick(() => {
    if (listEl.value) listEl.value.scrollTop = listEl.value.scrollHeight
  })
})
// #endregion
</script>

<template>
  <div v-if="CHAT_ENABLED" class="peddit-chat top-right">
    <!-- Bubble (paw + faint circular bg) -->
    <button
      aria-label="Open chat"
      class="peddit-chat-bubble"
      @click="toggle"
      title="Chat with Peddit"
      :aria-expanded="open ? 'true' : 'false'"
    >
      <span class="bubble-circle">
        <img class="bubble-img" :src="pawUrl" alt="Open chat" />
      </span>
      <span v-if="unread" class="unread-badge">{{ unread }}</span>
    </button>

    <!-- Panel -->
    <transition name="chat-slide">
      <div v-show="open" class="peddit-chat-panel card" role="dialog" aria-modal="true" aria-label="Peddit Chat">
        <div class="card-header d-flex justify-content-between align-items-center headingFont">
          <strong>Peddit Chat</strong>
          <div class="d-flex gap-2">
            <span class="text-muted small me-2">{{ sending ? 'sending…' : '' }}</span>
            <button class="btn btn-sm btn-outline-primary" @click="clearChat" :disabled="sending">Clear</button>
            <button class="btn btn-sm btn-outline-dark" @click="toggle" :disabled="sending">Close</button>
          </div>
        </div>

        <!-- Make body a flex column and the list the scrolling region -->
        <div class="card-body p-0 bodyFlex">
          <div class="peddit-chat-list bodyFont" ref="listEl" aria-live="polite">
            <div v-for="(m, i) in state.messages" :key="i" class="p-3 border-bottom" :class="m.role">
              <div class="small text-muted mb-1">
                {{ m.role === 'user' ? 'You' : (m.role === 'assistant' ? 'Peddit' : 'System') }}
              </div>
              <div class="message-content">
                <template v-if="m.content === '…thinking'">
                  <span class="typing"><span></span><span></span><span></span></span>
                </template>
                <template v-else>
                  <div class="md" v-html="renderMarkdown(m.content)"></div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div v-if="errorText" class="alert alert-danger py-2 mb-2">{{ errorText }}</div>

          <!-- Suggestion chips (ONLY before first user message) -->
          <div class="suggestions" role="list" v-if="showSuggestions">
            <button
              v-for="(s, idx) in suggestions"
              :key="idx"
              type="button"
              class="chip"
              role="listitem"
              @click="useSuggestion(s)"
            >{{ s }}</button>
          </div>

          <textarea
            ref="inputEl"
            class="form-control mb-2"
            rows="1"
            placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
            v-model="input"
            @keydown="onKeydown"
            @input="autosize"
            :disabled="sending"
          />
          <div class="d-flex justify-content-end">
            <button class="btn btn-primary" @click="onSend" :disabled="sending || !input.trim()">Send</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* === Floating chat bubble ABOVE the navbar, right side ===
   Uses tokens from base.css when present:
   --navbar-height, --bubble-size, --peddit-radius, --peddit-shadow, and Bootstrap --bs-* vars. */

.peddit-chat.top-right .peddit-chat-bubble {
  position: fixed;
  top: calc(var(--navbar-height, 64px) + 8px);
  right: 20px;
  z-index: 1100;
  background: transparent;
  border: 0;
  padding: 0;
  width: var(--bubble-size, 56px);
  height: var(--bubble-size, 56px);
  cursor: pointer;
}

/* Faint circular greyish background behind the paw */
.bubble-circle {
  width: 100%;
  height: 100%;
  display: grid; place-items: center;
  border-radius: 50%;
  background: var(--peddit-bubble-bg, rgba(20,20,20,.06));
  border: 1px solid var(--peddit-bubble-border, rgba(20,20,20,.08));
  box-shadow: 0 6px 14px rgba(0,0,0,.12);
  transition: transform .15s ease, box-shadow .2s ease, background .2s ease;
}
.peddit-chat-bubble:hover .bubble-circle { transform: translateY(-1px) scale(1.03); box-shadow: 0 10px 22px rgba(0,0,0,.16); }
.peddit-chat-bubble:active .bubble-circle { transform: scale(.96); }

/* Paw image */
.bubble-img {
  width: 70%;
  height: 70%;
  object-fit: contain;
  display: block;
}

/* Unread badge */
.unread-badge {
  position: absolute; top: -6px; right: -6px;
  min-width: 20px; height: 20px; padding: 0 6px;
  background: var(--bs-danger, #DA3E52); color: #fff; border-radius: 9999px;
  font-size: 12px; line-height: 20px; font-weight: 700;
  box-shadow: 0 2px 6px rgba(0,0,0,.2);
}

/* Chat panel below the bubble */
.peddit-chat.top-right .peddit-chat-panel {
  position: fixed; right: 20px;
  top: calc(var(--navbar-height, 64px) + 8px + var(--bubble-size, 56px) + 12px);
  width: min(380px, 92vw);
  /* Use dynamic viewport units for mobile keyboards */
  max-height: calc(100dvh - (var(--navbar-height, 64px) + 8px + var(--bubble-size, 56px) + 24px));
  display: flex; flex-direction: column; z-index: 1100;
  border-radius: var(--peddit-radius, 16px); overflow: hidden;
  box-shadow: var(--peddit-shadow, 0 12px 30px rgba(0,0,0,.15));
  background: var(--bs-body-bg, #fff);
}

/* Make the body a flexible scroll container */
.bodyFlex { 
  display: flex; 
  flex-direction: column; 
  flex: 1; 
  min-height: 0; /* allow child overflow in flexbox */
}

/* The message list fills available height and scrolls */
.peddit-chat-list {
  flex: 1;
  overflow: auto;
  background: var(--bs-body-bg, #fff);
}

.user .message-content, .assistant .message-content { white-space: normal; }

/* Typing animation: three moving dots */
.typing { display: inline-flex; gap: 4px; align-items: center; }
.typing span {
  width: 6px; height: 6px; border-radius: 50%;
  background: currentColor; opacity: .35;
  animation: typing-bounce 1s infinite ease-in-out;
}
.typing span:nth-child(2){ animation-delay: .2s }
.typing span:nth-child(3){ animation-delay: .4s }
@keyframes typing-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: .35 }
  40% { transform: translateY(-3px); opacity: .9 }
}

/* Suggestion chips */
.suggestions {
  display: flex; gap: 8px; flex-wrap: wrap;
  margin-bottom: 8px;
  overflow-x: auto; padding-bottom: 2px;
}
.chip {
  border: 1px solid rgba(20,20,20,.12);
  background: var(--bs-body-bg, #fff);
  color: var(--bs-body-color, #141414);
  border-radius: 9999px;
  padding: 6px 10px;
  font-size: 12px; line-height: 1;
  white-space: nowrap; cursor: pointer;
}
.chip:hover { background: color-mix(in srgb, var(--bs-primary) 8%, white); }
.chip:active { transform: translateY(1px); }

/* Markdown styling inside messages */
.md { color: var(--bs-body-color, #141414); }
.md p { margin: 0 0 .5rem 0; }
.md ul, .md ol { padding-left: 1.2rem; margin: 0 0 .6rem 0; }
.md li + li { margin-top: .2rem; }
.md a { color: var(--bs-primary, #247BA0); text-decoration: underline; }
.md code { background: rgba(0,0,0,.06); padding: .1rem .3rem; border-radius: 4px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.md pre { background: rgba(0,0,0,.06); padding: .6rem; border-radius: 8px; overflow: auto; }
.md h1, .md h2, .md h3 { margin: .4rem 0; font-weight: 700; }
.md blockquote { border-left: 3px solid rgba(0,0,0,.15); padding-left: .8rem; color: rgba(0,0,0,.7); margin: .4rem 0; }

/* Slide/scale in (from top) */
.chat-slide-enter-from, .chat-slide-leave-to { opacity: 0; transform: translateY(-6px) scale(0.98); }
.chat-slide-enter-active, .chat-slide-leave-active { transition: all .16s ease; }
</style>
