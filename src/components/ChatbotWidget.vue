<script setup>
/**
 * Peddit Chatbot Widget — branching history per USER prompt (with tail)
 * --------------------------------------------------------------------
 * - Edit or Regenerate creates a new *version* on the USER prompt.
 * - Each version stores: { prompt, reply, tail[] } where `tail` is the
 *   full sequence of messages that followed that assistant reply.
 * - Switching versions on a USER replaces the assistant reply *and*
 *   swaps the entire tail, so you get behavior like:
 *     v1: A -> resp A -> B -> resp B
 *     v2: A -> resp C
 *
 * Tweaks in this build:
 * - Hitting Enter while editing calls confirmEditResend() and replaces
 *   the edited user prompt in place (no new user turn added at the end).
 */

import { ref, reactive, watch, nextTick, onMounted, onBeforeUnmount, computed } from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import { sendChatStream } from '@/lib/chatApi'
import pawUrl from '@/assets/Main_Logo.png'

// ---------- Config ----------
const CHAT_ENABLED = import.meta.env.VITE_CHATBOT_ENABLED === 'true'
const CHAT_MODEL = import.meta.env.VITE_CHAT_MODEL || 'openrouter/auto'
const THINKING = '…thinking'
const GREETING = 'Hi! Ask me anything about your pet.'
const STORAGE_KEY = 'peddit_chat'
const STORAGE_BRANCH_KEY = STORAGE_KEY + '_branches' // legacy snapshots
const MAX_CONTEXT_MESSAGES = 20

// Mode switch
const MODE_STORAGE_KEY = 'peddit_chat_mode'
const selectedMode = ref(localStorage.getItem(MODE_STORAGE_KEY) || 'simple')
watch(selectedMode, (v) => localStorage.setItem(MODE_STORAGE_KEY, v))
const selectedModel = computed(() => {
  const simple = import.meta.env.VITE_CHAT_SIMPLE_MODEL || CHAT_MODEL
  const thinking = import.meta.env.VITE_CHAT_THINKING_MODEL || CHAT_MODEL
  return selectedMode.value === 'thinking' ? thinking : simple
})

/** Model capability map for multi-image support. */
const MODEL_CAPS = Object.freeze({
  'meta-llama/llama-3.2-11b-vision-instruct': { maxImages: 1 },
  'openai/gpt-4o-mini': { maxImages: 16 },
})
function getModelCaps(name){
  return MODEL_CAPS[name] || { maxImages: 3 }
}

/** Create a single collage data URL from up to 3 images for models that only accept one image. */
async function composeImagesGrid(urls){
  const srcs = (urls || []).slice(0,3)
  const imgs = await Promise.all(srcs.map(u => new Promise((res, rej)=>{
    const im = new Image()
    im.crossOrigin = 'anonymous'
    im.onload = () => res(im)
    im.onerror = () => rej(new Error('Image load failed'))
    im.src = u
  })))
  const n = imgs.length
  const cols = n === 1 ? 1 : 2
  const rows = n === 1 ? 1 : 2
  const cell = 384
  const pad = 8
  const w = cols*cell + (cols-1)*pad
  const h = rows*cell + (rows-1)*pad
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,w,h)
  imgs.forEach((im, idx) => {
    const c = idx % cols, r = Math.floor(idx/cols)
    const x = c*(cell+pad), y = r*(cell+pad)
    const scale = Math.min(cell / im.width, cell / im.height)
    const dw = Math.round(im.width * scale)
    const dh = Math.round(im.height * scale)
    const dx = x + Math.floor((cell - dw)/2)
    const dy = y + Math.floor((cell - dh)/2)
    ctx.drawImage(im, dx, dy, dw, dh)
  })
  return canvas.toDataURL('image/jpeg', 0.9)
}


/** @type {readonly string[]} */
const SUGGESTIONS = [
  'Create a 7-day meal plan for a 2-year-old Labrador (25kg)',
  'List 10 safe fruits/veggies under 100 kcal per snack',
  'My dog has diarrhea—what should I do?',
  'How much kibble per day for steady weight loss?',
]

const SYSTEM_MSG = {
  role: 'system',
  content: [
    'You are Peddit’s helpful assistant.',
    'Rules that you must always abide to before responding:',
    '0) Always respond in a structured manner with appropriate paragraphings, headings and boldings.',
    '1) Be concise, friendly, and focus on pet nutrition, pet profiles, and social help.',
    '2) Use short lists, practical tips, and clear cautions.',
    '3) If symptoms seem urgent, recommend seeing a vet.',
    '4) If not clear, ask for pet age, breed, gender, allergies/conditions.',
    '5) Ask for country/state to recommend local products or places.',
  ].join(' '),
}

/**
 * @typedef {{ role: 'system'|'user'|'assistant', content: string, ts?: number, status?: 'streaming'|'done'|'cancelled',
 *             history?: Array<{prompt: string, reply: string, tail: any[]}>, vpos?: number }} Message
 */

// ---------- State ----------
const open = ref(false)
const unread = ref(0)
const sending = ref(false)
const input = ref('')
const inputEl = ref(/** @type {HTMLTextAreaElement|null} */(null))
const listEl = ref(/** @type {HTMLDivElement|null} */(null))
const errorText = ref('')

// Resizable panel state
const panelEl = ref(/** @type {HTMLDivElement|null} */(null))
const panelW = ref(0)
const panelH = ref(0)
const RESIZE_LS_W = 'peddit_chat_w'
const RESIZE_LS_H = 'peddit_chat_h'
const resizing = reactive({ active:false, dir:'', sx:0, sy:0, sw:0, sh:0 })

onMounted(() => {
  // seed from DOM or localStorage
  const w = parseInt(localStorage.getItem(RESIZE_LS_W) || '0', 10)
  const h = parseInt(localStorage.getItem(RESIZE_LS_H) || '0', 10)
  if (w) panelW.value = w
  if (h) panelH.value = h
})

function startResize(dir, e){
  const el = panelEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  resizing.active = true
  resizing.dir = dir
  resizing.sx = e.clientX
  resizing.sy = e.clientY
  resizing.sw = rect.width
  resizing.sh = rect.height
  document.body.style.userSelect = 'none'
  window.addEventListener('mousemove', onResizeMove)
  window.addEventListener('mouseup', onResizeEnd)
}

function onResizeMove(e){
  if (!resizing.active) return
  const minW = 320, maxW = Math.min(window.innerWidth*0.92, 720)
  const minH = 280, maxH = Math.min(window.innerHeight*0.9, 1000)
  const dx = e.clientX - resizing.sx
  const dy = e.clientY - resizing.sy
  if (resizing.dir === 'left' || resizing.dir === 'corner-tl'){
    panelW.value = Math.max(minW, Math.min(maxW, Math.round(resizing.sw - dx)))
  }
  if (resizing.dir === 'top' || resizing.dir === 'corner-tl'){
    panelH.value = Math.max(minH, Math.min(maxH, Math.round(resizing.sh - dy)))
  }
}

function onResizeEnd(){
  if (!resizing.active) return
  resizing.active = false
  document.body.style.userSelect = ''
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup', onResizeEnd)
  // persist
  if (panelW.value) localStorage.setItem(RESIZE_LS_W, String(panelW.value))
  if (panelH.value) localStorage.setItem(RESIZE_LS_H, String(panelH.value))
}

const panelStyle = computed(() => {
  return {
    width: panelW.value ? panelW.value + 'px' : undefined,
    height: panelH.value ? panelH.value + 'px' : undefined,
  }
})
const controllerRef = ref(/** @type {AbortController|null} */(null))

const histories = ref([]) // legacy top-level branch snapshots (kept for BC)

const state = reactive({
  /** @type {Message[]} */
  messages: loadHistory(),
})

/** copy tick + toast */
const copiedIndex = ref(-1)
const toast = reactive({ show: false, text: '' })
function showToast(t) {
  toast.text = t;
  toast.show = true;
  setTimeout(() => (toast.show = false), 1800);
}
const fileInput = ref(/** @type {HTMLInputElement|null} */(null))
const attached = reactive({ files: /** @type {File[]} */([]), urls: /** @type {string[]} */([]) })
const _attachedSig = new Set()
function _sig(f){ return `${f?.name || ''}|${f?.size || 0}|${f?.lastModified || 0}` }
const dragActive = ref(false)

const editMode = reactive({ active: false, index: -1 })
const editBuffer = ref('')
const editRefMap = new Map()
function startEdit(i) {
  const m = state.messages[i]
  if (!m || m.role !== 'user' || sending.value) return
  editMode.active = true
  editMode.index = i
  editBuffer.value = m.content
  nextTick(()=>{
    const el = editRefMap.get(i)
    if (el){ el.focus(); el.selectionStart = el.selectionEnd = el.value.length }
  })
}
function cancelEdit() { editMode.active = false; editMode.index = -1; editBuffer.value = '' }

// ---------- Markdown ----------
const md = new MarkdownIt({ html: false, linkify: true, breaks: true })
function renderMarkdown(text) { return DOMPurify.sanitize(md.render(text || '')) }

// ---------- History load/save ----------
function sanitizeHistory(msgs) {
  return (msgs || []).map(m =>
    (m?.role === 'assistant' && m?.content === THINKING)
      ? { ...m, content: '(previous reply not saved)' }
      : m
  )
}
function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [{ role: 'assistant', content: GREETING }]
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? sanitizeHistory(parsed) : [{ role: 'assistant', content: GREETING }]
  } catch { return [{ role: 'assistant', content: GREETING }] }
}
function persist(){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.messages)) } catch {}
}
function loadBranches() { try { const raw = localStorage.getItem(STORAGE_BRANCH_KEY); const parsed = raw?JSON.parse(raw):null; if (Array.isArray(parsed)) histories.value = parsed } catch {} }
function persistBranches() { try { localStorage.setItem(STORAGE_BRANCH_KEY, JSON.stringify(histories.value)) } catch {} }

watch(() => state.messages, persist, { deep: true })
watch(() => state.messages.length, async ()=>{ await nextTick(); scrollToBottom() })

// ---------- Helpers ----------
function deepClone(x){ return JSON.parse(JSON.stringify(x)) }
function scrollToBottom(){ const el = listEl.value; if (el) el.scrollTop = el.scrollHeight }
function autosize(){ const el = inputEl.value; if (!el) return; el.style.height='auto'; el.style.height=el.scrollHeight+'px' }
function newline(e){
  const el = inputEl.value
  if (!el) return
  const start = el.selectionStart ?? input.value.length
  const end = el.selectionEnd ?? start
  const val = input.value
  input.value = val.slice(0, start) + '\n' + val.slice(end)
  nextTick(() => {
    el.selectionStart = el.selectionEnd = start + 1
    autosize()
  })
}

function focusInput(){ nextTick(()=> inputEl.value?.focus()) }
function toggle(){ if (!CHAT_ENABLED) return; open.value = !open.value; if (open.value){ unread.value = 0; focusInput() } errorText.value='' }
function useSuggestion(s){ input.value = s; focusInput(); autosize() }
function onKeydown(e){
  if (e.key === 'Enter' && !e.shiftKey){
    e.preventDefault()
    if (editMode.active) confirmEditResend()
    else onSend()
  }
}
function onDocKey(e){
  if (e.key === 'Escape'){
    if (editMode.active) { cancelEdit(); return }
    if (open.value) toggle()
  }
}
onMounted(()=>{ document.addEventListener('keydown', onDocKey); loadBranches() })
onBeforeUnmount(()=> document.removeEventListener('keydown', onDocKey))

const hasUserMessage = computed(()=> state.messages.some(m => m?.role === 'user'))
const showSuggestions = computed(()=> !hasUserMessage.value && open.value && !sending.value)

function findStreamingIndex(){ return state.messages.findIndex(m => m.role==='assistant' && m.status==='streaming') }
function findAssistantAfter(userIndex){
  for (let k=userIndex+1; k<state.messages.length; k++) if (state.messages[k]?.role==='assistant') return k
  return -1
}

function buildPayloadMessages(){
  const recent = state.messages.filter(Boolean).slice(-MAX_CONTEXT_MESSAGES)
  const cleaned = recent.filter(m => !(m.role==='assistant' && m.content===THINKING))
  // Map any user message with image to OpenAI-compatible "content" parts
  const mapped = [SYSTEM_MSG, ...cleaned].map(m => {
    if (m.role === 'user' && (m.imageUrls?.length)) {
      return {
        role: 'user',
        content: [
          { type: 'text', text: String(m.content || '') },
          ...m.imageUrls.slice(0,3).map(u => ({ type: 'image_url', image_url: { url: u } }))
        ]
      }
    }
    if (m.role === 'user' && m.imageUrl) {
      return {
        role: 'user',
        content: [
          { type: 'text', text: String(m.content || '') },
          { type: 'image_url', image_url: { url: m.imageUrl } }
        ]
      }
    }
    return m
  })
  return mapped
}

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,6) }

// ---------- USER history helpers (with tail) ----------
function snapshotTailFromUser(uIdx){
  const aIdx = findAssistantAfter(uIdx)
  if (aIdx === -1) return []
  return deepClone(state.messages.slice(aIdx + 1))
}
function ensureUserHistorySnapshot(uIdx){
  const u = state.messages[uIdx]
  if (!u || u.role !== 'user') return
  if (!Array.isArray(u.history)) { u.history = []; u.vpos = 0 }
  const aIdx = findAssistantAfter(uIdx)
  const aText = (aIdx !== -1) ? (state.messages[aIdx].content || '') : ''
  const pair = { prompt: u.content || '', reply: aText, tail: snapshotTailFromUser(uIdx) }
  const last = u.history[u.history.length - 1]
  if (!last || last.prompt !== pair.prompt || last.reply !== pair.reply) {
    u.history.push(pair)
    u.vpos = u.history.length - 1
  } else {
    // keep tail updated if conversation grew
    last.tail = pair.tail
    u.vpos = u.history.length - 1
  }
}
function appendUserVersion(uIdx, promptText, replyText, tail){
  const u = state.messages[uIdx]
  if (!u || u.role !== 'user') return
  if (!Array.isArray(u.history)) { u.history = []; u.vpos = 0 }
  u.history.push({ prompt: promptText, reply: replyText, tail: deepClone(tail || []) })
  u.vpos = u.history.length - 1
}
function gotoUserHistory(uIdx, pos){
  const u = state.messages[uIdx]
  if (!u || u.role !== 'user' || !u.history?.length) return
  const clamped = Math.max(0, Math.min(pos, u.history.length - 1))
  const version = u.history[clamped]

  // rebuild messages: [before] + user(version.prompt) + assistant(version.reply) + tail
  const before = deepClone(state.messages.slice(0, uIdx))
  const newUser = { ...u, content: version.prompt, vpos: clamped } // keep its history array
  const newAssistant = { role: 'assistant', content: version.reply, ts: Date.now(), status: 'done' }
  const newTail = deepClone(version.tail || [])

  state.messages = [...before, newUser, newAssistant, ...newTail]
  persist()
  nextTick(scrollToBottom)
}
function prevUserVersion(uIdx){ const u = state.messages[uIdx]; if (!u?.history?.length) return; gotoUserHistory(uIdx, (u.vpos ?? 0) - 1) }
function nextUserVersion(uIdx){ const u = state.messages[uIdx]; if (!u?.history?.length) return; gotoUserHistory(uIdx, (u.vpos ?? 0) + 1) }

// ---------- Send (new turn at end) ----------

// ---------- Image attach & drag/drop ----------
function handleFiles(files){
  const list = Array.from(files || [])
  const imgs = list.filter(f => f && f.type && f.type.startsWith('image/'))
  if (!imgs.length) return
  for (const f of imgs){
    if (attached.files.length >= 3) break
    const sig = _sig(f)
    if (_attachedSig.has(sig)) continue
    const reader = new FileReader()
    reader.onload = () => {
      const url = typeof reader.result === 'string' ? reader.result : ''
      if (!url) return
      if (attached.files.length >= 3 || _attachedSig.has(sig)) return
      _attachedSig.add(sig)
      attached.files.push(f)
      attached.urls.push(url)
    }
    reader.readAsDataURL(f)
  }
}
function onDragEnter(e){ e.stopPropagation?.(); dragActive.value = true }
function onDragOver(e){ e.preventDefault(); e.stopPropagation?.(); dragActive.value = true }
function onDragLeave(e){ e.stopPropagation?.(); dragActive.value = false }
function onDrop(e){
  e.preventDefault()
  e.stopPropagation?.()
  dragActive.value = false
  const files = e.dataTransfer?.files
  if (files?.length) handleFiles(files)
}
function onFileChange(e){
  const files = e?.target?.files
  if (files?.length) handleFiles(files)
  if (e?.target) e.target.value = ''
}
function removeAttachment(){
  attached.files = []
  attached.urls = []
  _attachedSig.clear()
}
function removeAttachmentAt(idx){
  const f = attached.files[idx]
  if (f) _attachedSig.delete(_sig(f))
  attached.files.splice(idx,1)
  attached.urls.splice(idx,1)
}
function onPaste(e){
  const items = e.clipboardData?.items || []
  for (const it of items){
    if (it.type && it.type.startsWith('image/')){
      const f = it.getAsFile?.()
      if (f){ handleFiles([f]); e.preventDefault?.() }
    }
  }
}
async function onSend() {
  const text = input.value?.trim()
  if (!text || sending.value) return

  errorText.value = ''
  input.value = ''
  autosize()

  // push new user + placeholder assistant (end of convo)
  const __imgs = attached.urls || [];
  let attachPayload = {};
  const caps = getModelCaps(selectedModel.value);
  if (__imgs.length) {
    if (__imgs.length > 1 && caps.maxImages === 1) {
      try {
        const collage = await composeImagesGrid(__imgs);
        attachPayload = { imageUrl: collage };
      } catch {}
    } else {
      attachPayload = { imageUrls: __imgs.slice(0, Math.min(3, caps.maxImages)) };
    }
  }
  state.messages.push({ role: 'user', content: text, ts: Date.now(), ...attachPayload });
  removeAttachment()
  removeAttachment()
  state.messages.push({ role: 'assistant', content: THINKING, ts: Date.now(), status: 'streaming' })
  sending.value = true

  const controller = new AbortController()
  controllerRef.value = controller

  try {
    const idx = findStreamingIndex()
    if (idx === -1) throw new Error('Stream placeholder missing')
    const uIdx = idx - 1

    let started = false
    await sendChatStream(buildPayloadMessages(), {
      model: selectedModel.value,
      controller,
      reasoning: selectedMode.value === 'thinking',
      onToken(token){
        if (!started){ state.messages[idx].content = token; started = true } else { state.messages[idx].content += token }
        scrollToBottom()
      },
    })
    state.messages[idx].status = 'done'

    // commit initial version for this user (tail likely empty now)
    ensureUserHistorySnapshot(uIdx)

    if (!open.value) unread.value += 1
  } catch (e) {
    const idx = findStreamingIndex()
    if (idx !== -1) {
      if (e?.name === 'AbortError') {
        if (state.messages[idx].content === THINKING) state.messages.splice(idx,1)
        else { state.messages[idx].content += '\n\n*Cancelled.*'; state.messages[idx].status='cancelled' }
      } else {
        state.messages.splice(idx,1); errorText.value = e?.message || 'Chat failed. Check backend URL or quota.'
      }
    }
  } finally {
    sending.value = false
    controllerRef.value = null
    persist()
  }
}

function cancelStreaming(){ try { controllerRef.value?.abort() } catch {} }

// ---------- Copy ----------
async function copyMessage(i){
  const m = state.messages[i]; if (!m) return
  try {
    await navigator.clipboard.writeText(m.content || '')
    copiedIndex.value = i
    showToast('Copied to Clipboard')
    setTimeout(() => { if (copiedIndex.value === i) copiedIndex.value = -1 }, 1500)
  } catch {
    showToast('Copy failed')
  }
}

// ---------- Regenerate IN-PLACE on assistant i (new version under the preceding USER) ----------
async function regenerateFrom(i){
  if (sending.value) return
  const m = state.messages[i]
  if (!m || m.role !== 'assistant') return

  // find the user before i
  let uIdx = -1
  for (let k=i-1; k>=0; k--) if (state.messages[k]?.role === 'user') { uIdx = k; break }
  if (uIdx === -1) return

  // snapshot current version (with full tail) BEFORE mutation
  ensureUserHistorySnapshot(uIdx)

  // legacy snapshot for BC/debug
  histories.value.push({ id: uid(), title: 'Before regenerate', messages: deepClone(state.messages), createdAt: Date.now() })
  persistBranches()

  // Trim tail after assistant and re-stream in place
  state.messages = state.messages.slice(0, i+1)
  state.messages[i].content = THINKING
  state.messages[i].status = 'streaming'
  state.messages[i].ts = Date.now()

  // Stream new reply for SAME prompt; new version tail is empty
  sending.value = true
  const controller = new AbortController()
  controllerRef.value = controller
  try {
    await sendChatStream(buildPayloadMessages(), {
      model: selectedModel.value,
      controller,
      reasoning: selectedMode.value === 'thinking',
      onToken(token){
        const streaming = state.messages[i]
        if (streaming.content === THINKING) streaming.content = token
        else streaming.content += token
        scrollToBottom()
      },
    })
    state.messages[i].status = 'done'
    appendUserVersion(uIdx, state.messages[uIdx].content, state.messages[i].content, /*tail*/[])
  } catch (e) {
    if (e?.name === 'AbortError') {
      if (state.messages[i].content === THINKING) state.messages.splice(i,1)
      else { state.messages[i].content += '\n\n*Cancelled.*'; state.messages[i].status='cancelled' }
    } else {
      errorText.value = e?.message || 'Regenerate failed.'
      if (state.messages[i] && state.messages[i].content === THINKING) state.messages.splice(i,1)
    }
  } finally {
    sending.value = false
    controllerRef.value = null
    persist()
  }
}

// ---------- Confirm Edit → replace user i and regenerate assistant; new version under that USER ----------
async function confirmEditResend(){
  if (!editMode.active || sending.value) return
  const i = editMode.index
  const txt = editBuffer.value?.trim()
  if (!txt) return

  // snapshot current version (with full tail) BEFORE mutation
  ensureUserHistorySnapshot(i)

  // legacy snapshot
  histories.value.push({ id: uid(), title: 'Before edit', messages: deepClone(state.messages), createdAt: Date.now() })
  persistBranches()

  // update user in place
  const userMsg = state.messages[i]
  if (!userMsg || userMsg.role !== 'user') return
  userMsg.content = txt
  userMsg.ts = Date.now()

  // find/create assistant slot
  let aIdx = findAssistantAfter(i)
  if (aIdx === -1) {
    state.messages.splice(i+1, 0, { role: 'assistant', content: THINKING, ts: Date.now(), status: 'streaming' })
    aIdx = i + 1
  } else {
    // remove the entire tail and reuse the same assistant slot
    state.messages = state.messages.slice(0, aIdx + 1)
    state.messages[aIdx].content = THINKING
    state.messages[aIdx].status = 'streaming'
    state.messages[aIdx].ts = Date.now()
  }

  // exit edit UI
  editMode.active = false
  editMode.index = -1
  input.value = ''
  autosize()

  // stream
  sending.value = true
  const controller = new AbortController()
  controllerRef.value = controller
  try {
    await sendChatStream(buildPayloadMessages(), {
      model: selectedModel.value,
      controller,
      reasoning: selectedMode.value === 'thinking',
      onToken(token){
        const streaming = state.messages[aIdx]
        if (streaming.content === THINKING) streaming.content = token
        else streaming.content += token
        scrollToBottom()
      },
    })
    state.messages[aIdx].status = 'done'
    // New version: edited prompt + new reply, tail cleared
    appendUserVersion(i, state.messages[i].content, state.messages[aIdx].content, [])
  } catch (e) {
    if (e?.name === 'AbortError') {
      if (state.messages[aIdx].content === THINKING) state.messages.splice(aIdx,1)
      else { state.messages[aIdx].content += '\n\n*Cancelled.*'; state.messages[aIdx].status='cancelled' }
    } else {
      errorText.value = e?.message || 'Edit re-send failed.'
      if (state.messages[aIdx] && state.messages[aIdx].content === THINKING) state.messages.splice(aIdx,1)
    }
  } finally {
    sending.value = false
    controllerRef.value = null
    persist()
  }
}

function regenerate(){
  if (sending.value) return
  // fallback: regenerate last assistant turn in place
  for (let i=state.messages.length-1;i>=0;i--){
    if (state.messages[i]?.role==='assistant') { regenerateFrom(i); break }
  }
}

function clearChat(){
  state.messages = [{ role: 'assistant', content: 'Cleared. How can I help?', ts: Date.now() }]
  persist()
}
</script>

<template>
  <div v-if="CHAT_ENABLED" class="peddit-chat top-right" data-testid="peddit-chat" @dragenter.prevent="onDragEnter" @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop">
    <!-- Bubble -->
    <button aria-label="Open chat" class="peddit-chat-bubble" @click="toggle" title="Chat with Peddit" :aria-expanded="open ? 'true' : 'false'">
      <span class="bubble-circle"><img class="bubble-img" :src="pawUrl" alt="Open chat" /></span>
      <span v-if="unread" class="unread-badge">{{ unread }}</span>
    </button>

    <!-- Panel -->
      <!-- drop overlay moved below -->
    <transition name="chat-slide">
      <div v-if="open" class="peddit-chat-panel card" ref="panelEl" :style="panelStyle" @dragenter.prevent="onDragEnter" @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop">
        <div class="card-header d-flex justify-content-between align-items-center headingFont">
          <strong>Peddit Chat</strong>
          <div class="d-flex gap-2 align-items-center">
            <!-- mode switch moved to footer -->
            <span class="text-muted small me-2" v-if="sending">streaming…</span>
            <button class="btn btn-sm btn-outline-danger" v-if="sending" @click="cancelStreaming">Cancel</button>
            <button class="btn btn-sm btn-outline-secondary" @click="clearChat" :disabled="sending">Clear</button>
            <button class="btn btn-sm btn-outline-dark" @click="toggle" :disabled="sending">Close</button>
          </div>
        </div>

        <div class="drop-overlay" v-if="dragActive">Drop image anywhere to attach</div>
        <div class="resize-handle left" @mousedown="startResize('left', $event)" aria-label="Resize width"></div>
        <div class="resize-handle top" @mousedown="startResize('top', $event)" aria-label="Resize height"></div>
        <div class="resize-handle corner-tl" @mousedown="startResize('corner-tl', $event)" aria-label="Resize panel"></div>

        <!-- Body -->
        <div class="card-body p-0 bodyFlex">
          <div class="peddit-chat-list bodyFont" ref="listEl" aria-live="polite">
            <div v-for="(m, i) in state.messages" :key="i" class="p-3 msg-row" :class="m.role">
              <div class="small text-muted mb-1 d-flex align-items-center gap-2 header-row">
                <span>{{ m.role === 'user' ? 'You' : (m.role === 'assistant' ? 'Peddit' : 'System') }}</span>
                <span v-if="m.ts" class="text-muted" style="font-size: 11px;">· {{ new Date(m.ts).toLocaleTimeString() }}</span>
              </div>

              

<div v-if="m.role === 'user' && (m.imageUrls?.length || m.imageUrl)" class="msg-attachments">
  <template v-if="m.imageUrls?.length">
    <div class="img-grid">
      <img v-for="(u,ux) in m.imageUrls.slice(0,3)" :key="ux" :src="u" alt="attachment" />
    </div>
  </template>
  <img v-else :src="m.imageUrl" alt="attachment" />
</div>

<div class="message-content">
<template v-if="m.content === '…thinking'">
    <span class="typing"><span></span><span></span><span></span></span>
  </template>
  <template v-else>
    <template v-if="editMode.active && editMode.index === i && m.role==='user'">
      <textarea class="inline-edit"
                v-model="editBuffer"
                :ref="el => el && editRefMap.set(i, el)"
                @keydown.enter.exact.prevent="confirmEditResend"
                @keydown.esc.prevent="cancelEdit"></textarea>
      <div class="d-flex gap-2 mt-2">
        <button class="btn btn-secondary" @click="cancelEdit" :disabled="sending">Cancel</button>
        <button class="btn btn-light" @click="confirmEditResend" :disabled="sending || !editBuffer.trim()">Send</button>
      </div>
    </template>
    <template v-else>
      <div class="md" v-html="renderMarkdown(m.content)"></div>
    </template>
  </template>
</div>

<!-- Hover actions -->
              <div class="msg-actions" :class="m.role">
                <template v-if="m.role === 'user'">
                  <button class="icon-btn" title="Edit" aria-label="Edit message" @click="startEdit(i)">
                    <svg width="16" height="16" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34c-.39-.39-1.03-.39-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>
                  </button>
                  <button class="icon-btn" :class="{ tick: copiedIndex === i }" title="Copy" aria-label="Copy message" @click="copyMessage(i)">
                    <span v-if="copiedIndex === i">✓</span>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                  </button>
                </template>
                <template v-else-if="m.role === 'assistant'">
                  <button class="icon-btn" title="Regenerate" aria-label="Regenerate from here" @click="regenerateFrom(i)">
                    <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 6V3L8 7l4 4V8c3.31 0 6 2.69 6 6a6 6 0 01-6 6 6 6 0 01-6-6H4a8 8 0 008 8 8 8 0 008-8c0-4.42-3.58-8-8-8z"/></svg>
                  </button>
                  <button class="icon-btn" :class="{ tick: copiedIndex === i }" title="Copy" aria-label="Copy message" @click="copyMessage(i)">
                    <span v-if="copiedIndex === i">✓</span>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                  </button>
                </template>
              </div>

              <!-- User history nav -->
              <div class="variant-nav" v-if="m.role==='user' && m.history && m.history.length > 1">
                <button class="vnav-btn" :disabled="(m.vpos ?? 0) <= 0" @click="prevUserVersion(i)">‹</button>
                <span class="vnav-count">{{ (m.vpos ?? 0) + 1 }}/{{ m.history.length }}</span>
                <button class="vnav-btn" :disabled="(m.vpos ?? 0) >= m.history.length - 1" @click="nextUserVersion(i)">›</button>
              </div>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div v-if="errorText" class="alert alert-danger py-2 mb-2">{{ errorText }}</div>

          <!-- Suggestion chips (before first user message) -->
          <div class="suggestions" role="list" v-if="showSuggestions">
            <button v-for="(s, idx) in SUGGESTIONS" :key="idx" type="button" class="chip" role="listitem" @click="useSuggestion(s)">{{ s }}</button>
          </div>
<div v-if="attached.urls.length" class="attachment-preview" aria-label="Attached images preview">
  <div class="img-grid">
    <div v-for="(u, idx) in attached.urls.slice(0,3)" :key="idx" class="img-wrap">
      <img :src="u" alt="attached image" />
      <button type="button" class="btn btn-sm btn-outline-secondary mt-1" @click="removeAttachmentAt(idx)">Remove</button>
    </div>
  </div>
  <div class="text-muted small mt-1">Max 3 images.</div>
</div>

<input type="file" ref="fileInput" accept="image/*" multiple class="d-none" @change="onFileChange" />
          

                    <!-- Input row: text-only -->
<div class="input-top">
  <textarea ref="inputEl"
            class="prompt-input"
            rows="1"
            v-model="input"
            :placeholder="placeholder"
            @keydown.enter.exact.prevent="onSend"
            @keydown.shift.enter.prevent="newline"
            @paste="onPaste"
            @input="autosize"
            :disabled="sending"></textarea>
</div>

<!-- Control row: attach + mode + send -->
<div class="input-bottom" role="group" aria-label="Chat controls">
  <!-- Paperclip -->
  <button type="button" class="icon-btn attach-btn" title="Attach image" aria-label="Attach image" @click="fileInput?.click()">
    <svg width="18" height="18" viewBox="0 0 26 18" aria-hidden="true">
      <path d="M8.5 6.5l7.07-7.07a5 5 0 117.07 7.07l-9.9 9.9a7 7 0 11-9.9-9.9l9.19-9.19" fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>
  </button>

  <!-- Mode -->
  <select class="mode-select form-select form-select-sm" v-model="selectedMode" aria-label="Select mode" :disabled="sending">
    <option value="simple">Simple</option>
    <option value="thinking">Thinking</option>
  </select>

  <div class="spacer"></div>

  <!-- Send up-arrow -->
  <button type="button"
          class="icon-btn send-btn"
          :disabled="sending || !input.trim()"
          @click="onSend"
          title="Send"
          aria-label="Send message">
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17L17 7M17 7H9m8 0v8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</div>
          <div class="d-flex justify-content-between gap-2" v-if="false">
            <div class="text-muted small d-flex align-items-center">Editing previous prompt…</div>
            <div class="d-flex gap-2">
              <button class="btn btn-light" @click="cancelEdit" :disabled="sending">Cancel</button>
              <button class="btn btn-primary" @click="confirmEditResend" :disabled="sending || !input.trim()">Re‑send</button>
            </div>
          </div>
        </div>

        <!-- Toast -->
        <transition name="fade">
          <div v-if="toast.show" class="peddit-toast alert alert-success py-1 px-2">{{ toast.text }}</div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<style scoped>

/* Drop overlay covering the entire panel for drag & drop */
.peddit-chat { position: relative; }
.peddit-chat-panel { position: relative; }
.drop-overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  border: 2px dashed #999;
  background: rgba(0,0,0,0.35);
  color: #fff; font-weight: 600; font-size: 1rem;
  pointer-events: none;
  z-index: 10;
}
.attachment-preview { margin: 0 12px 8px 12px; border: 1px solid #e5e5e5; border-radius: 8px; padding: 8px; background: #fafafa; }
.attachment-preview img { max-width: 100%; max-height: 180px; height: auto; display: block; border-radius: 6px; object-fit: contain; }
.msg-image img { max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 8px; }

:host, .peddit-chat {
  --bubble-size: 56px;
  --navbar-height: 64px;
  --peddit-radius: 16px;
  --peddit-shadow: 0 12px 30px rgba(0,0,0,.15);
  --peddit-bubble-bg: rgba(85, 95, 238, 0.142);
  --peddit-bubble-border: rgba(20,20,20,.08);
}
.peddit-chat.top-right .peddit-chat-bubble {
  position: fixed; top: calc(var(--navbar-height) + 8px); right: 20px; z-index: 1100;
  background: transparent; border: 0; padding: 0; width: var(--bubble-size); height: var(--bubble-size); cursor: pointer;
}
.bubble-circle { width:100%; height:100%; display:grid; place-items:center; border-radius:50%; background:var(--peddit-bubble-bg); border:1px solid var(--peddit-bubble-border); box-shadow:0 6px 14px rgba(0,0,0,.12); transition: transform .15s, box-shadow .2s, background .2s; }
.peddit-chat-bubble:hover .bubble-circle { transform: translateY(-1px) scale(1.03); box-shadow: 0 10px 22px rgba(0,0,0,.16); }
.peddit-chat-bubble:active .bubble-circle { transform: scale(.96); }
.bubble-img { width:70%; height:70%; object-fit:contain; display:block; }
.unread-badge { position:absolute; top:-6px; right:-6px; min-width:20px; height:20px; padding:0 6px; background:var(--bs-danger, #DA3E52); color:#fff; border-radius:9999px; font-size:12px; line-height:20px; font-weight:700; box-shadow:0 2px 6px rgba(0,0,0,.2); }

.peddit-chat.top-right .peddit-chat-panel {
  position: fixed; right: 20px; top: calc(var(--navbar-height) + 8px + var(--bubble-size) + 12px);
  width: min(380px, 92vw);
  max-height: calc(100dvh - (var(--navbar-height) + 8px + var(--bubble-size) + 24px));
  display: flex; flex-direction: column; z-index: 1100;
  border-radius: var(--peddit-radius); overflow: auto; box-shadow: var(--peddit-shadow);
  background: var(--bs-body-bg, #fff);
}

.bodyFlex { display:flex; flex-direction:column; flex:1; min-height:0; }
.peddit-chat-list { flex:1; overflow:auto; background: var(--bs-body-bg, #fff); }
.user .message-content, .assistant .message-content { white-space: normal; }

/* Typing */
.typing { display:inline-flex; gap:4px; align-items:center; }
.typing span { width:6px; height:6px; border-radius:50%; background: currentColor; opacity:.35; animation: typing-bounce 1s infinite ease-in-out; }
.typing span:nth-child(2){ animation-delay:.2s } .typing span:nth-child(3){ animation-delay:.4s }
@keyframes typing-bounce { 0%,80%,100%{ transform:translateY(0); opacity:.35 } 40%{ transform:translateY(-3px); opacity:.9 } }

/* Hover actions */
.msg-row { position: relative; }
.msg-actions {
  display: flex;
  gap: 8px;
  /* collapsed by default */
  max-height: 0;
  opacity: 0;
  visibility: hidden;
  overflow: hidden;
  margin-top: 0;
  transition:
    opacity .25s ease .18s,
    max-height .25s ease .18s,
    margin-top 0s linear .18s,
    visibility 0s linear .18s;
}
.msg-row:hover .msg-actions {
  visibility: visible;
  max-height: 40px;
  opacity: 1;
  margin-top: 4px;
  transition-delay: 0s, 0s, 0s, 0s;
}
.icon-btn { border:1px solid rgba(0,0,0,.12); background:var(--bs-body-bg, #fff); padding:4px 6px; border-radius:8px; line-height:1; cursor:pointer; font-size:12px; }
.icon-btn.tick { border-color: #198754; }
.icon-btn:focus { outline:none; }

/* User history nav (shows on hover of user row) */
.variant-nav { position:absolute; right:12px; bottom:6px; display:none; align-items:center; gap:6px; font-size:12px; }
.msg-row.user:hover .variant-nav { display:flex; }
.vnav-btn { border:1px solid rgba(0,0,0,.12); background:var(--bs-body-bg,#fff); padding:2px 6px; border-radius:6px; cursor:pointer; line-height:1; }
.vnav-btn:disabled { opacity:.35; cursor:default; }
.vnav-count { color: rgba(0,0,0,.6); font-weight:600; }

/* Toast */
.peddit-toast { position:absolute; right:12px; bottom:64px; z-index:10; }
.fade-enter-active, .fade-leave-active { transition: opacity .2s; } .fade-enter-from, .fade-leave-to { opacity:0; }

/* Suggestions */
.suggestions { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:8px; overflow-x:auto; padding-bottom:2px; }
.chip { border:1px solid rgba(20,20,20,.12); background:var(--bs-body-bg,#fff); color:var(--bs-body-color,#141414); border-radius:9999px; padding:6px 10px; font-size:12px; line-height:1; white-space:nowrap; cursor:pointer; }
.chip:hover { background: color-mix(in srgb, var(--bs-primary) 8%, white); } .chip:active { transform: translateY(1px); }

/* Markdown */
.md { color: var(--bs-body-color,#141414); }
.md p { margin: 0 0 .5rem 0; }
.md ul, .md ol { padding-left: 1.2rem; margin: 0 0 .6rem 0; }
.md li + li { margin-top: .2rem; }
.md a { color: var(--bs-primary,#247BA0); text-decoration: underline; }
.md code { background: rgba(0,0,0,.06); padding:.1rem .3rem; border-radius:4px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.md pre { background: rgba(0,0,0,.06); padding:.6rem; border-radius:8px; overflow:auto; }
.md h1, .md h2, .md h3 { margin:.4rem 0; font-weight:700; }
.md blockquote { border-left:3px solid rgba(0,0,0,.15); padding-left:.8rem; color: rgba(0,0,0,.7); margin:.4rem 0; }

/* Transitions + a11y */
.chat-slide-enter-from, .chat-slide-leave-to { opacity:0; transform: translateY(-6px) scale(.98); }
.chat-slide-enter-active, .chat-slide-leave-active { transition: all .16s ease; }
.form-control:focus { box-shadow:none !important; outline:none !important; }

/* Mode switch */
.mode-switch { display:inline-flex; border:1px solid rgba(0,0,0,.08); border-radius:999px; overflow:hidden; background:var(--bs-body-bg); }
.mode-switch .mode-btn { padding:6px 10px; font-size:12px; line-height:1; border:none; background:transparent; cursor:pointer; opacity:.7; }
.mode-switch .mode-btn.active { background: rgba(0,0,0,.06); opacity:1; font-weight:600; }
.mode-switch .mode-btn:focus { outline:none; box-shadow:none; }

/* Attach pin button positioned at the left of the prompt bar */
.card-footer { position: relative; }
.pin-btn { position:absolute; left:14px; top:14px; width:28px; height:28px; display:inline-grid; place-items:center; z-index:2; }
.card-footer .form-control { padding-left: 48px; }



/* === Input bar layout === */
.input-bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 8px;
  align-items: center;
}

.input-left .attach-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.icon-btn {
  border: none;
  background: transparent;
  padding: 6px;
  cursor: pointer;
}

.mode-select {
  min-width: 140px;
}

.prompt-input {
  width: 100%;
  min-height: 44px;
  max-height: 160px;
  resize: none;
  border-radius: 12px;
  padding: 10px 12px;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: var(--bs-primary);
  color: white;
  display: inline-grid;
  place-items: center;
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* remove old absolute pin styles if present */
.pin-btn { position: static; }

/* prevent overlap on textarea when old style is present */
.card-footer .form-control { padding-left: 12px; }

/* === Two-row input layout === */
.input-top { margin-bottom: 8px; }
.input-bottom { display: flex; align-items: center; gap: 10px; }
.input-bottom .spacer { flex: 1 1 auto; }

.prompt-input {
  width: 100%;
  min-height: 44px;
  max-height: 160px;
  resize: none;
  border-radius: 12px;
  padding: 10px 12px;
}

.icon-btn {
  border: none;
  background: transparent;
  padding: 6px;
  cursor: pointer;
}

.attach-btn { width: 32px; height: 32px; border-radius: 8px; }
.mode-select { min-width: 160px; }

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: var(--bs-primary);
  color: white;
  display: inline-grid;
  place-items: center;
}
.send-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* clean old absolute pin styles if any */
.pin-btn { position: static; }

/* ---- Attachment icon alignment fix ---- */
.input-bottom { align-items: center; }
.icon-btn { display: inline-flex; align-items: center; justify-content: center; padding: 0; }
.icon-btn svg { display: block; }
.attach-btn { width: 36px; height: 36px; border-radius: 8px; overflow: visible; }

/* --- Chat bubble alignment + spacing update --- */
.msg-row { padding-top: 8px !important; padding-bottom: 30px !important; }
.msg-row .message-content { 
  display: inline-block; 
  max-width: 85%;
  padding: 10px 12px; 
  border-radius: 14px;
  background: #f4f6f8;
  color: var(--bs-body-color, #141414);
}
.msg-row.user { display: flex; flex-direction: column; align-items: flex-end; }
.msg-row.user .message-content { 
  background: var(--bs-primary, #247BA0); 
  color: #fff; 
  border-top-right-radius: 8px; 
  border-top-left-radius: 14px; 
}
.msg-row.assistant { display: flex; flex-direction: column; align-items: flex-start; }
.msg-row.assistant .message-content { 
  background: #f1f3f5;
  color: var(--bs-body-color, #141414);
  border-top-left-radius: 8px;
  border-top-right-radius: 14px;
}

/* Remove any residual borders that created horizontal lines */
.msg-row, .msg-row + .msg-row { border-bottom: none !important; }

.header-row { width: 100%; display: flex; }
.msg-row.user .header-row { justify-content: flex-end; }

/* Role-aware alignment for inline action buttons and tighter spacing */
.msg-row.user .msg-actions { justify-content: flex-end; }
.msg-row.assistant .msg-actions { justify-content: flex-start; }
.msg-actions { margin-top: 4px; }

/* Trim trailing space inside each bubble */
.msg-row .md > *:last-child { margin-bottom: 0 !important; }

/* Resizers */
.peddit-chat-panel { position: relative; }
.resize-handle { position:absolute; z-index:20; }
.resize-handle.left { top:0; left:0; width:8px; height:100%; cursor: ew-resize; }
.resize-handle.top { left:0; top:0; width:100%; height:8px; cursor: ns-resize; }
.resize-handle.corner-tl { left:0; top:0; width:14px; height:14px; cursor: nwse-resize; }
.resize-handle:hover { background: transparent; } /* invisible grip */

/* Force white text for user bubble content */
.msg-row.user .md { color: #fff !important; }
.msg-row.user .md a { color: #fff !important; text-decoration: underline; }

/* Attachments above the user bubble */
.msg-row.user .msg-attachments { display: flex; justify-content: flex-end; align-self: flex-end; margin-bottom: 6px; }
.msg-row.user .msg-attachments .img-grid { display:flex; gap:8px; justify-content:flex-end; flex-wrap:wrap; }
.msg-row.user .msg-attachments img { max-width: 100%; border-radius: 8px; border: 1px solid #e5e7eb; }
</style>

<style>
.img-grid{ display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:8px; }
.img-grid img{ max-width:100%; border-radius:8px; border:1px solid #e5e7eb; }
.inline-edit{ width:100%; min-height:80px; padding:8px; border:1px solid #ced4da; border-radius:6px; font: inherit; }
</style>
