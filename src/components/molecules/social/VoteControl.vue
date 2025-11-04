<script setup>
import { ref, watch } from 'vue';
const emit = defineEmits(['vote']);

const props = defineProps({
  initialVote: { type: Number, default: 0 }, // -1 | 0 | 1 (controlled)
  score: { type: Number, default: 0 },
  // when true, disable controls (useful when user not authenticated)
  disabled: { type: Boolean, default: false }
});

const vote = ref(props.initialVote);
const burst = ref(false);

watch(() => props.initialVote, (v) => {
  if (v !== vote.value) {
    burst.value = true;
    setTimeout(() => (burst.value = false), 420);
  }
  vote.value = v;
});

const setVote = (val) => {
  if (props.disabled) {
    // Emit a clear signal so parent can react (e.g., show login)
    emit('auth-required');
    return;
  }
  const newVote = vote.value === val ? 0 : val; // toggle
  emit('vote', newVote);
};
</script>

<template>
  <div class="d-flex align-items-center gap-2">
    <button class="btn btn-sm" :class="vote === 1 ? 'btn-success' : 'btn-outline-secondary'" @click="setVote(1)" :disabled="props.disabled">
      <i :class="vote === 1 ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'"></i>
    </button>

    <div class="fw-bold score-wrap" :class="{ 'burst-animate': burst }" aria-live="polite">
      {{ score }}
      <span class="burst-particles" aria-hidden="true"></span>
    </div>

    <button class="btn btn-sm" :class="vote === -1 ? 'btn-danger' : 'btn-outline-secondary'" @click="setVote(-1)" :disabled="props.disabled">
      <i :class="vote === -1 ? 'bi-hand-thumbs-down-fill' : 'bi-hand-thumbs-down'"></i>
    </button>
  </div>
</template>

<style scoped>
.fw-bold { position: relative; display: inline-block; }

/* burst particles (pseudo element alternative span used above) */
.burst-particles {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 6px;
  height: 6px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0;
}
.burst-animate { animation: glow 420ms ease-out; }
.burst-animate .burst-particles {
  opacity: 1;
  animation: burst 420ms cubic-bezier(.2,.9,.2,1) forwards;
}

/* radial glow */
@keyframes glow {
  0% { box-shadow: 0 0 0 rgba(255,255,255,0); }
  50% { box-shadow: 0 8px 28px rgba(13,110,253,0.14); }
  100% { box-shadow: 0 0 0 rgba(255,255,255,0); }
}

/* simple multi-particle effect using box-shadows */
@keyframes burst {
  0% {
    transform: translate(-50%, -50%) scale(0.2);
    opacity: 1;
    box-shadow:
      0 0 0 rgba(99,102,241,0.0),
      0 0 0 rgba(99,102,241,0.0),
      0 0 0 rgba(99,102,241,0.0);
  }
  40% {
    box-shadow:
      -14px -6px 4px rgba(99,102,241,0.85),
       10px -8px 4px rgba(99,102,241,0.85),
       6px 14px 4px rgba(99,102,241,0.85);
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
    box-shadow: none;
  }
}
</style>