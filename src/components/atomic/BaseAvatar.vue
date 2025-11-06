<template>
  <img
    :src="src"
    :alt="alt"
    class="base-avatar"
    :class="sizeClass"
    :style="customStyle"
    @error="handleError"
  />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Avatar'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  pixelSize: {
    type: [Number, String],
    default: null
  },
  fallback: {
    type: String,
    default: 'https://picsum.photos/seed/defaultpet/200/200.jpg'
  }
});

const emit = defineEmits(['error']);

const sizeClass = computed(() => `avatar-${props.size}`);

const customStyle = computed(() => {
  if (props.pixelSize != null) {
    const v = typeof props.pixelSize === 'number' ? `${props.pixelSize}px` : String(props.pixelSize);
    return { '--avatar-size': v };
  }
  return { '--avatar-size': getSizeValue() };
});

const getSizeValue = () => {
  const sizes = {
    xs: '40px',
    sm: '60px',
    md: '80px',
    lg: '100px',
    xl: '120px'
  };
  return sizes[props.size] || sizes.md;
};

const handleError = (event) => {
  event.target.src = props.fallback;
  emit('error');
};
</script>

<style scoped>
.base-avatar {
  width: var(--avatar-size, 80px);
  height: var(--avatar-size, 80px);
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.base-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 576px) {
  .avatar-xl { --avatar-size: 120px; }
  .avatar-lg { --avatar-size: 100px; }
  .avatar-md { --avatar-size: 80px; }
  .avatar-sm { --avatar-size: 60px; }
  .avatar-xs { --avatar-size: 40px; }
}
</style>
