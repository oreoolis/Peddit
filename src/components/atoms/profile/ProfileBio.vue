<template>
  <div class="profile-bio" :class="{ 'empty': !hasBio }">
    <p class="bio-text">{{ displayText }}</p>
  </div>
  
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  bio: {
    type: String,
    default: ''
  },
  maxLength: {
    type: Number,
    default: 180
  },
  placeholder: {
    type: String,
    default: 'No bio yet.'
  }
});

const hasBio = computed(() => !!props.bio && props.bio.trim().length > 0);
const displayText = computed(() => {
  const text = hasBio.value ? props.bio.trim() : props.placeholder;
  return text.length > props.maxLength ? text.slice(0, props.maxLength) + '…' : text;
});
</script>

<style scoped>
.profile-bio {
  margin: 8px 0 4px;
}

.bio-text {
  margin: 0;
  color: #3f3f46;
  font-size: 0.95rem;
  line-height: 1.5;
}

.empty .bio-text {
  color: #a1a1aa;
  font-style: italic;
}
</style>

