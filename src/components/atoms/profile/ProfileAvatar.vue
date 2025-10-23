<template>
  <div class="profile-avatar-wrapper">
    <img :src="avatarUrl" :alt="alt" class="profile-avatar" :class="sizeClass">
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  avatarUrl: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Profile Picture'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
});

const sizeClass = computed(() => `avatar-${props.size}`);
</script>

<style scoped>
.profile-avatar-wrapper {
  position: relative;
}

.profile-avatar {
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
}

.avatar-sm {
  width: 60px;
  height: 60px;
}

.avatar-md {
  width: 120px;
  height: 120px;
}

.avatar-lg {
  width: 140px;
  height: 140px;
}

.avatar-xl {
  width: 180px;
  height: 180px;
}
</style>
