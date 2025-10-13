<script setup>
/**
 * Peddit Chatbot Widget (Batch 2 — Streaming, Cancel, Regenerate)
 * - Streaming replies with Abort (Cancel)
 * - Regenerate (re-ask last user prompt)
 * - Safe Markdown + suggestion chips (chips only before first user message)
 * - LocalStorage persistence
 * - Strict feature flag (VITE_CHATBOT_ENABLED === 'true')
 */

// #region Imports
import { ref, reactive, watch, nextTick, onMounted, onBeforeUnmount, computed } from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import { sendChatStream, sendChat } from '@/lib/chatApi' // stream + fallback
import pawUrl from '@/assets/Main_Logo.png'
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
const controllerRef = ref(null) // AbortController for streaming

const md = new MarkdownIt({ html: false, linkify: true, breaks: true })
function renderMarkdown(text) {
  const html = md.render(text || '')
  return DOMPurify.sanitize(html)
}

// Suggestion chips (only before first user message)
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
    'You are Peddit’s helpful assistant.' + 
    'Below are some rules you must abide to:' +
    '1) Be concise, friendly, and focus on pet nutrition, pet profiles, and social help.' +
    '2) If you need user account data, ask first.' +
    '3) Use short lists, practical tips, and clear cautions.' + 
    '4) If symptoms seem urgent, recommend seeing a vet.' +
    '5) If not made clear, always ask for user pet characteristics like age, breed, gender or any kind of health allergy or complication' +
    '6) If not made clear, always ask for what country or state they are from so we can recommend places / items / products that could be within their vicinity'
}

const state = reactive({ messages: loadHistory() })

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

// auto-scroll when messages length changes
watch(
  () => state.messages.length,
  async () => {
    await nextTick()
    scrollToBottom()
  }
)

function scrollToBottom() {
  const el = listEl.value
  if (el) el.scrollTop = el.scrollHeight
}

// Computed flags
const hasUserMessage = computed(() => state.messages.some(m => m?.role === 'user'))
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

// #region Chat flow (Streaming + Cancel + Regenerate)
async function onSend() {
  const text = input.value?.trim()
  if (!text || sending.value) return
  errorText.value = ''
  input.value = ''
  autosize()

  // push user's message + temporary placeholder
  state.messages.push({ role: 'user', content: text, ts: Date.now() })
  state.messages.push({ role: 'assistant', content: '…thinking', ts: Date.now(), status: 'streaming' })
  sending.value = true

  // Build model messages (drop the placeholder)
  const recent = state.messages.filter(Boolean).slice(-20)
  const payloadMessages = [systemMsg, ...recent.filter(m => !(m.role === 'assistant' && m.content === '…thinking'))]

  const controller = new AbortController()
  controllerRef.value = controller

  try {
    // Find the placeholder index and clear it on first chunk
    const idx = state.messages.findIndex(m => m.role === 'assistant' && m.content === '…thinking')
    if (idx === -1) throw new Error('Stream placeholder missing')

    let seenFirst = false
    let full = ''

    await sendChatStream(payloadMessages, {
      model: CHAT_MODEL,
      controller,
      onToken(token) {
        full += token
        if (!seenFirst) {
          // swap out the placeholder
          state.messages[idx].content = token
          seenFirst = true
        } else {
          state.messages[idx].content += token
        }
        // keep it feeling live
        scrollToBottom()
      }
    })

    // finalize
    state.messages[idx].status = 'done'
    persist()
    if (!open.value) unread.value += 1
  } catch (e) {
    // aborted vs error
    const idx = state.messages.findIndex(m => m.role === 'assistant' && m.status === 'streaming')
    if (idx !== -1) {
      if (e?.name === 'AbortError') {
        // keep whatever we have; mark cancelled
        if (state.messages[idx].content === '…thinking') {
          // nothing received—remove placeholder
          state.messages.splice(idx, 1)
        } else {
          state.messages[idx].content += '\n\n*Cancelled.*'
          state.messages[idx].status = 'cancelled'
        }
      } else {
        state.messages.splice(idx, 1)
        errorText.value = e?.message || 'Chat failed. Check backend URL or quota.'
      }
    }
    persist()
  } finally {
    sending.value = false
    controllerRef.value = null
  }
}

function cancelStreaming() {
  try { controllerRef.value?.abort() } catch {}
}

function onKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    onSend()
  }
}

function clearChat() {
  state.messages = [{ role: 'assistant', content: 'Cleared. How can I help?', ts: Date.now() }]
  persist()
}

function lastUserMessage() {
  for (let i = state.messages.length - 1; i >= 0; i--) {
    if (state.messages[i]?.role === 'user') return state.messages[i].content
  }
  return ''
}

function regenerate() {
  if (sending.value) return
  const last = lastUserMessage()
  if (!last) return
  input.value = last
  focusInput()
  autosize()
  // Option A: auto-send immediately. Option B: let them edit. We do auto-send:
  onSend()
}
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
          <div class="d-flex gap-2 align-items-center">
            <span class="text-muted small me-2" v-if="sending">streaming…</span>
            <button class="btn btn-sm btn-outline-danger" v-if="sending" @click="cancelStreaming">Cancel</button>
            <button class="btn btn-sm btn-outline-secondary" @click="clearChat" :disabled="sending">Clear</button>
            <button class="btn btn-sm btn-outline-dark" @click="toggle" :disabled="sending">Close</button>
          </div>
        </div>

        <!-- Make body a flex column and the list the scrolling region -->
        <div class="card-body p-0 bodyFlex">
          <div class="peddit-chat-list bodyFont" ref="listEl" aria-live="polite">
            <div v-for="(m, i) in state.messages" :key="i" class="p-3 border-bottom" :class="m.role">
              <div class="small text-muted mb-1 d-flex align-items-center gap-2">
                <span>{{ m.role === 'user' ? 'You' : (m.role === 'assistant' ? 'Peddit' : 'System') }}</span>
                <span v-if="m.ts" class="text-muted" style="font-size: 11px;">· {{ new Date(m.ts).toLocaleTimeString() }}</span>
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
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-outline-secondary" @click="regenerate" :disabled="sending || !hasUserMessage">Regenerate</button>
            <button class="btn btn-primary" @click="onSend" :disabled="sending || !input.trim()">Send</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* === Floating chat bubble ABOVE the navbar, right side === */
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

/* Bubble bg */
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

.bubble-img { width: 70%; height: 70%; object-fit: contain; display: block; }

.unread-badge {
  position: absolute; top: -6px; right: -6px;
  min-width: 20px; height: 20px; padding: 0 6px;
  background: var(--bs-danger, #DA3E52); color: #fff; border-radius: 9999px;
  font-size: 12px; line-height: 20px; font-weight: 700;
  box-shadow: 0 2px 6px rgba(0,0,0,.2);
}

/* Panel */
.peddit-chat.top-right .peddit-chat-panel {
  position: fixed; right: 20px;
  top: calc(var(--navbar-height, 64px) + 8px + var(--bubble-size, 56px) + 12px);
  width: min(380px, 92vw);
  max-height: calc(100dvh - (var(--navbar-height, 64px) + 8px + var(--bubble-size, 56px) + 24px));
  display: flex; flex-direction: column; z-index: 1100;
  border-radius: var(--peddit-radius, 16px); overflow: hidden;
  box-shadow: var(--peddit-shadow, 0 12px 30px rgba(0,0,0,.15));
  background: var(--bs-body-bg, #fff);
}

/* Body as scroll container */
.bodyFlex { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.peddit-chat-list { flex: 1; overflow: auto; background: var(--bs-body-bg, #fff); }

.user .message-content, .assistant .message-content { white-space: normal; }

/* Typing dots */
.typing { display: inline-flex; gap: 4px; align-items: center; }
.typing span {
  width: 6px; height: 6px; border-radius: 50%;
  background: currentColor; opacity: .35;
  animation: typing-bounce 1s infinite ease-in-out;
}
.typing span:nth-child(2){ animation-delay: .2s }
.typing span:nth-child(3){ animation-delay: .4s }
@keyframes typing-bounce { 0%, 80%, 100% { transform: translateY(0); opacity: .35 } 40% { transform: translateY(-3px); opacity: .9 }}

/* Chips */
.suggestions { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; overflow-x: auto; padding-bottom: 2px; }
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

/* Markdown */
.md { color: var(--bs-body-color, #141414); }
.md p { margin: 0 0 .5rem 0; }
.md ul, .md ol { padding-left: 1.2rem; margin: 0 0 .6rem 0; }
.md li + li { margin-top: .2rem; }
.md a { color: var(--bs-primary, #247BA0); text-decoration: underline; }
.md code { background: rgba(0,0,0,.06); padding: .1rem .3rem; border-radius: 4px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.md pre { background: rgba(0,0,0,.06); padding: .6rem; border-radius: 8px; overflow: auto; }
.md h1, .md h2, .md h3 { margin: .4rem 0; font-weight: 700; }
.md blockquote { border-left: 3px solid rgba(0,0,0,.15); padding-left: .8rem; color: rgba(0,0,0,.7); margin: .4rem 0; }

/* Transition */
.chat-slide-enter-from, .chat-slide-leave-to { opacity: 0; transform: translateY(-6px) scale(0.98); }
.chat-slide-enter-active, .chat-slide-leave-active { transition: all .16s ease; }
</style>
