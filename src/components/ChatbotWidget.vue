<script setup>
import { ref, reactive, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { sendChat } from '@/lib/chatApi'
import pawUrl from '@/assets/Main_Logo.png' // replace with your paw asset if needed

const CHAT_ENABLED = import.meta.env.VITE_CHATBOT_ENABLED !== 'false'
const CHAT_MODEL = import.meta.env.VITE_CHAT_MODEL || 'openrouter/auto'

const open = ref(false)
const unread = ref(0)
const sending = ref(false)
const input = ref('')
const inputEl = ref(null)
const listEl = ref(null)
const errorText = ref('')

const systemMsg = {
  role: 'system',
  content:
    'You are Peddit’s helpful assistant. Be concise, friendly, and focus on pet nutrition, pet profiles, and social help. If you need user account data, ask first.'
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
  state.messages = [{ role: 'assistant', content: 'Cleared. How can I help?' }]
  persist()
}

onMounted(() => {
  nextTick(() => {
    if (listEl.value) listEl.value.scrollTop = listEl.value.scrollHeight
  })
})
</script>

<template>
  <div v-if="CHAT_ENABLED" class="peddit-chat top-right">
    <!-- Bubble (paw + faint circular bg) -->
    <button
      aria-label="Open chat"
      class="peddit-chat-bubble"
      @click="toggle"
      title="Chat with Peddit"
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
            <button class="btn btn-sm btn-outline-secondary" @click="clearChat" :disabled="sending">Clear</button>
            <button class="btn btn-sm btn-outline-dark" @click="toggle" :disabled="sending">Close</button>
          </div>
        </div>

        <div class="card-body p-0">
          <div class="peddit-chat-list bodyFont" ref="listEl">
            <div v-for="(m, i) in state.messages" :key="i" class="p-3 border-bottom" :class="m.role">
              <div class="small text-muted mb-1">
                {{ m.role === 'user' ? 'You' : (m.role === 'assistant' ? 'Peddit' : 'System') }}
              </div>
              <div class="message-content">
                <template v-if="m.content === '…thinking'">
                  <span class="typing"><span></span><span></span><span></span></span>
                </template>
                <template v-else>{{ m.content }}</template>
              </div>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div v-if="errorText" class="alert alert-danger py-2 mb-2">{{ errorText }}</div>
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
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--peddit-bubble-bg, rgba(34, 77, 218, 0.094));
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
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: var(--bs-danger, #DA3E52);
  color: #fff;
  border-radius: 9999px;
  font-size: 12px;
  line-height: 20px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0,0,0,.2);
}

/* Chat panel below the bubble */
.peddit-chat.top-right .peddit-chat-panel {
  position: fixed;
  right: 20px;
  top: calc(var(--navbar-height, 64px) + 8px + var(--bubble-size, 56px) + 12px);
  width: min(380px, 92vw);
  max-height: calc(100vh - (var(--navbar-height, 64px) + 8px + var(--bubble-size, 56px) + 24px));
  display: flex;
  flex-direction: column;
  z-index: 1100;
  border-radius: var(--peddit-radius, 16px);
  overflow: hidden;
  box-shadow: var(--peddit-shadow, 0 12px 30px rgba(0,0,0,.15));
  background: var(--bs-body-bg, #fff);
}

/* Messages list */
.peddit-chat-list {
  max-height: 50vh;
  overflow: auto;
  background: var(--bs-body-bg, #fff);
}

.user .message-content,
.assistant .message-content {
  white-space: pre-wrap;
}

/* Typing animation: three moving dots */
.typing { display: inline-flex; gap: 4px; align-items: center; }
.typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: .35;
  animation: typing-bounce 1s infinite ease-in-out;
}
.typing span:nth-child(2){ animation-delay: .2s }
.typing span:nth-child(3){ animation-delay: .4s }
@keyframes typing-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: .35 }
  40% { transform: translateY(-3px); opacity: .9 }
}

/* Slide/scale in (from top) */
.chat-slide-enter-from,
.chat-slide-leave-to { opacity: 0; transform: translateY(-6px) scale(0.98); }
.chat-slide-enter-active,
.chat-slide-leave-active { transition: all .16s ease; }
</style>
