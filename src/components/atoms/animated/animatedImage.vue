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
  ,
  // optional displayed size (pixels or CSS string like '100%')
  width: { type: [Number, String], default: null },
  height: { type: [Number, String], default: null }
});

const frameIndex = ref(0);
const sheetWidth = ref(null);
const sheetHeight = ref(null);
const intervalId = ref(null);

// element ref and computed/derived style pieces
const el = ref(null);
const containerStyle = ref({
  width: props.width && typeof props.width === 'number' ? `${props.width}px` : `${props.frameWidth}px`,
  height: props.height && typeof props.height === 'number' ? `${props.height}px` : `${props.frameHeight}px`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: `0px 0px`,
  backgroundSize: undefined,
  backgroundImage: `url(${props.src})`,
  imageRendering: 'pixelated'
});

const measuredWidth = ref(props.width && typeof props.width === 'number' ? props.width : props.frameWidth);
const measuredHeight = ref(props.height && typeof props.height === 'number' ? props.height : props.frameHeight);

function getDisplaySize() {
  const w = (props.width && typeof props.width === 'number') ? props.width : (el.value ? el.value.clientWidth : measuredWidth.value);
  const h = (props.height && typeof props.height === 'number') ? props.height : (el.value ? el.value.clientHeight : measuredHeight.value);
  return { w, h };
}

function updateBackgroundPosition() {
  const idx = frameIndex.value;
  const { w, h } = getDisplaySize();
  if (props.direction === 'horizontal') {
    const x = idx * w;
    containerStyle.value.backgroundPosition = `${-x}px 0px`;
  } else {
    const y = idx * h;
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

    // if the element is already mounted, capture its current size for scaling; otherwise use props/frame size
    if (el.value) {
      measuredWidth.value = el.value.clientWidth || measuredWidth.value;
      measuredHeight.value = el.value.clientHeight || measuredHeight.value;
    }

    // compute displayed size and scaling
    const { w, h } = getDisplaySize();
    const scaleX = w / props.frameWidth;
    const scaleY = h / props.frameHeight;

    // set backgroundSize so the sprite sheet is scaled to match displayed frame size
    if (sheetWidth.value && sheetHeight.value) {
      containerStyle.value.backgroundSize = `${Math.round(sheetWidth.value * scaleX)}px ${Math.round(sheetHeight.value * scaleY)}px`;
    }

    // set container width/height when numeric props present
    if (props.width && typeof props.width === 'number') containerStyle.value.width = `${props.width}px`;
    if (props.height && typeof props.height === 'number') containerStyle.value.height = `${props.height}px`;

    // ensure initial position correct
    updateBackgroundPosition();
  };
  img.src = props.src;

  // Observe element size changes so percentage/string sizes work
  let ro = null;
  if (window.ResizeObserver) {
    ro = new ResizeObserver(() => {
      if (!el.value) return;
      measuredWidth.value = el.value.clientWidth;
      measuredHeight.value = el.value.clientHeight;

      // update container style width/height when props are not numeric
      if (!(props.width && typeof props.width === 'number')) containerStyle.value.width = `${measuredWidth.value}px`;
      if (!(props.height && typeof props.height === 'number')) containerStyle.value.height = `${measuredHeight.value}px`;

      // recompute backgroundSize based on new measured size
      const { w, h } = getDisplaySize();
      const scaleX = w / props.frameWidth;
      const scaleY = h / props.frameHeight;
      if (sheetWidth.value && sheetHeight.value) {
        containerStyle.value.backgroundSize = `${Math.round(sheetWidth.value * scaleX)}px ${Math.round(sheetHeight.value * scaleY)}px`;
      }

      updateBackgroundPosition();
    });
    // observe after next tick to ensure el is available
    if (el.value) ro.observe(el.value);
  }

  startTimer();

  // cleanup observer when unmounting
  onUnmounted(() => {
    if (ro && ro.disconnect) ro.disconnect();
  });
});

onUnmounted(() => {
  stopTimer();
});

// react to prop changes
watch(() => props.play, (v) => (v ? startTimer() : stopTimer()));
watch(() => props.fps, () => { if (props.play) startTimer(); });
watch(() => props.src, () => {
  // update backgroundImage and reload natural size so scaling remains correct
  containerStyle.value.backgroundImage = `url(${props.src})`;
  frameIndex.value = 0;
  // reload natural size and recompute backgroundSize
  const img = new Image();
  img.onload = () => {
    sheetWidth.value = img.naturalWidth;
    sheetHeight.value = img.naturalHeight;
    const { w, h } = getDisplaySize();
    const scaleX = w / props.frameWidth;
    const scaleY = h / props.frameHeight;
    if (sheetWidth.value && sheetHeight.value) {
      containerStyle.value.backgroundSize = `${Math.round(sheetWidth.value * scaleX)}px ${Math.round(sheetHeight.value * scaleY)}px`;
    }
    updateBackgroundPosition();
  };
  img.src = props.src;
});
</script>

<template>
  <div
    class="sprite"
    ref="el"
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