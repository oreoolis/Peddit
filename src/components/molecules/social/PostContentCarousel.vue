<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: { type: Array, default: () => [
      { url: '/src/assets/person.jpg' },
      { url: '/src/assets/golden.jpg' },
      { url: '/src/assets/persian.jpg' }
  ] },
  format: { type: String, default: 'facebook' } // reserved for future variants
});

const containerId = computed(() => `carousel-${Math.random().toString(36).slice(2,9)}`);
</script>

<template>
  <!-- wrap carousel in a bootstrap card for feed appearance -->
  <div v-if="props.data && props.data.length" class="mx-auto my-2 pt-4 rounded-3 px-0 px-md-5">
    <div class="card rounded-3 shadow-sm mx-auto "  >
      <div class="card-body p-0">
        <!-- existing carousel root (unchanged) -->
        <div :id="containerId" class="carousel slide" data-bs-ride="carousel" aria-label="Post images carousel">
          <!-- bootstrap indicators -->
          <div class="carousel-indicators">
            <button
              v-for="(pic, i) in props.data"
              :key="i"
              type="button"
              :data-bs-target="'#' + containerId"
              :data-bs-slide-to="i"
              :class="{ active: i === 0 }"
              :aria-current="i === 0 ? 'true' : undefined"
              :aria-label="'Slide ' + (i + 1)"
            ></button>
          </div>

          <!-- use bootstrap ratio for consistent size -->
          <div class="carousel-inner ratio ratio-4x3 rounded-4 ">
            <div
              v-for="(pic, idx) in props.data"
              :key="idx"
              :class="['carousel-item', { active: idx === 0 }]"
            >
              <div class="d-flex align-items-center justify-content-center w-100 h-100">
                <img
                  :src="pic.url"
                  :alt="pic.alt || ('image-' + idx)"
                  class="d-block post-carousel-img"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <!-- controls (Bootstrap) -->
          <button v-if="props.data.length >1"
            class="carousel-control-prev"
            type="button"
            :data-bs-target="'#' + containerId"
            data-bs-slide="prev"
            aria-label="Previous"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>

          <button v-if="props.data.length >1"
            class="carousel-control-next"
            type="button"
            :data-bs-target="'#' + containerId"
            data-bs-slide="next"
            aria-label="Next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

/* carousel wrapper: dark background to hide letterboxing */
.carousel-inner,
.ratio.ratio-4x3 {
  background: var(--bs-black);
  overflow: hidden;
  max-height: 60vh;
  aspect-ratio: 4 / 3;
}

/* images: fill the container but preserve aspect by default; we'll switch to cover on mobile */
.post-carousel-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
}

/* controls: subtle round buttons */
.carousel-control-prev,
.carousel-control-next {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(77, 75, 75, 0.58);
  display: flex;
  align-items: center;
  justify-content: center;
  top: 50%;
  transform: translateY(-50%);
}

/* icon sizing */
.carousel-control-prev .carousel-control-prev-icon,
.carousel-control-next .carousel-control-next-icon {
  background-size: 18px 18px;
}

/* indicators sizing */
.carousel-indicators [data-bs-target] {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}

/* mobile-specific: use a wider aspect ratio, larger max-height and cover so images feel bigger */
@media (max-width: 576px) {
  .ratio.ratio-4x3 {
    max-height: 75vh;
    aspect-ratio: 16 / 9; /* wider on mobile so image looks bigger and less letterboxed */
    border-radius: 0.5rem;
  }
  .post-carousel-img { object-fit: cover; }

  /* larger touch targets on mobile */
  .carousel-control-prev,
  .carousel-control-next {
    width: 48px;
    height: 48px;
    background: rgba(77, 75, 75, 0.58);
  }
  .carousel-control-prev .carousel-control-prev-icon,
  .carousel-control-next .carousel-control-next-icon {
    background-size: 22px 22px;
  }
}

@media (min-width: 1400px) {
  .ratio.ratio-4x3 { max-height: min(520px, 65vh); }
}

</style>