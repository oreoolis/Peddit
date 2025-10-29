<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  src: { type: String, required: true },
  frameWidth: { type: Number, required: true },
  frameHeight: { type: Number, required: true },
  frames: { type: Number, required: true }, // total frames
  fps: { type: Number, default: 10 },
  play: { type: Boolean, default: true },
  direction: { type: String, default: 'horizontal' } // 'horizontal' or 'vertical'
});

const frameIndex = ref(0);
const sheetWidth = ref(null);
const sheetHeight = ref(null);
const intervalId = ref(null);

// computed/derived style pieces
const containerStyle = ref({
  width: `${props.frameWidth}px`,
  height: `${props.frameHeight}px`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: `0px 0px`,
  backgroundSize: undefined,
  backgroundImage: `url(${props.src})`,
  imageRendering: 'pixelated'
});

function updateBackgroundPosition() {
  const idx = frameIndex.value;
  if (props.direction === 'horizontal') {
    const x = idx * props.frameWidth;
    containerStyle.value.backgroundPosition = `${-x}px 0px`;
  } else {
    const y = idx * props.frameHeight;
    containerStyle.value.backgroundPosition = `0px ${-y}px`;
  }
}

// advance frame (snaps to next)
function advanceFrame() {
  frameIndex.value = (frameIndex.value + 1) % Math.max(1, props.frames);
  updateBackgroundPosition();
}

// start/stop timer
function startTimer() {
  stopTimer();
  if (!props.play) return;
  const ms = Math.max(1, Math.round(1000 / Math.max(1, props.fps)));
  intervalId.value = setInterval(advanceFrame, ms);
}
function stopTimer() {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
}

onMounted(() => {
  // preload image to detect natural size, then set backgroundSize so pixel cropping is exact
  const img = new Image();
  img.onload = () => {
    sheetWidth.value = img.naturalWidth;
    sheetHeight.value = img.naturalHeight;
    // If sprite is a horizontal strip, set backgroundSize to physical sheet width x frameHeight
    if (props.direction === 'horizontal') {
      containerStyle.value.backgroundSize = `${sheetWidth.value}px ${props.frameHeight}px`;
    } else {
      containerStyle.value.backgroundSize = `${props.frameWidth}px ${sheetHeight.value}px`;
    }
    // ensure initial position correct
    updateBackgroundPosition();
  };
  img.src = props.src;

  startTimer();
});

onUnmounted(() => {
  stopTimer();
});

// react to prop changes
watch(() => props.play, (v) => (v ? startTimer() : stopTimer()));
watch(() => props.fps, () => { if (props.play) startTimer(); });
watch(() => props.src, () => {
  // update backgroundImage and reload natural size
  containerStyle.value.backgroundImage = `url(${props.src})`;
  frameIndex.value = 0;
  updateBackgroundPosition();
});
</script>

<template>
  <div
    class="sprite"
    :style="containerStyle"
    aria-hidden="true"
    role="img"
  />
</template>

<style scoped>
.sprite {
  display: inline-block;
  overflow: hidden;
  /* ensure container uses the exact frame viewport */
  box-sizing: border-box;
}
</style>