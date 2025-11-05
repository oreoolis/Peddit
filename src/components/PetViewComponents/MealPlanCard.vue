<script setup>
import { ref, computed } from 'vue';
import animatedImage from '../atoms/animated/animatedImage.vue';

const props = defineProps({
    rec_id: { type: [String, Number], required: true },
    name: { type: String, required: true },
    desc: { type: String, required: false },
    petKind: { type: String, required: false },
    compact: { type: Boolean, default: false },
    editable: { type: Boolean, default: true },
    actionLabel: { type: String, default: 'View Info' }
})
const emit = defineEmits(['open-meal-info']);

const compact = computed(() => props.compact === true);

const handleOpenMealInfo = () => {
    // Emit the rec_id and the editable flag so parent can forward edit permissions to any modal
    emit('open-meal-info', {
        rec_id: props.rec_id,
        editable: props.editable === undefined ? true : !!props.editable
    })
}

const cardStyle = computed(() => ({
    width: compact.value ? '10rem' : '16rem',
    height: compact.value ? '16rem' : '27rem'
}));

// Image sizing adjusts for compact mode to avoid overflowing the card
const imgSize = computed(() => {
    if (compact.value) return { width: 140, height: 140, frameWidth: 48, frameHeight: 48, frames: 6, fps: 8 };
    return { width: 200, height: 200, frameWidth: 48, frameHeight: 48, frames: 6, fps: 8 };
});

// label for the summary/action area (allows consumer to show "Select Plan" in modals)
const actionLabel = computed(() => props.actionLabel || 'View Info');

</script>
<template>
    <div class="recipeCard card overflow-hidden bg-primary shadow p-3 mb-5 rounded-5 border-1" :style="cardStyle" :class="{ compact: compact }">
        <div class = "mt-0">
            <p v-if="petKind == 'dog'" class="d-flex justify-content-center">
                <animatedImage src="/src/assets/Sprite/Dog/Walk.png" :width="imgSize.width" :height="imgSize.height" :frameWidth="imgSize.frameWidth" :frameHeight="imgSize.frameHeight" :frames="imgSize.frames" :fps="imgSize.fps" />
            </p>
            <p v-else class="d-flex justify-content-center">
                <animatedImage src="/src/assets/Sprite/Cat/Walk.png" :width="imgSize.width" :height="imgSize.height" :frameWidth="imgSize.frameWidth" :frameHeight="imgSize.frameHeight" :frames="imgSize.frames" :fps="imgSize.fps" />
            </p>
        </div>
        <div class="card-body" >
            <div class="card-text text-center">
                <h3 class="headingFont text-light">{{ name }}</h3>
                <p class="bodyFont text-light desc-text">{{ desc }}</p>

            </div>
            <div
                class="summary-container container-fluid position-absolute bottom-0 start-0 end-0 px-3 py-3 bg-primary">
                <div class="summary-container container-fluid position-absolute bottom-0 start-0 end-0 px-5 py-3 bg-white"
                    @click="handleOpenMealInfo">
                        <div class="text-center black fw-bold h5 bodyFont">
                            {{ actionLabel }}
                        </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.recipeCard {
    width: 100%;
    max-width: 18rem;
    min-height: 24rem;
    position: relative; /* contain absolutely positioned summary/footer inside the card */
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    border: none;
}

.recipeCard .card-body {
    /* leave room for the absolute-positioned summary/footer so description isn't covered */
    padding-bottom: 5.5rem; /* matches summary height + spacing */
}

.recipeCard:hover {
    transform: translateY(-6px) scale(1.04);
    box-shadow: 0 14px 30px rgba(25, 25, 25, 0.18), 0 6px 12px rgba(0,0,0,0.08);
}



@keyframes meal-pulse {
  0% { transform: scale(0.95); opacity: 0.9 }
  60% { transform: scale(1.12); opacity: 0.36 }
  100% { transform: scale(1.22); opacity: 0 }
}

/* shine animation when the card becomes selected; runs once on class toggle */
.recipeCard.selected-plan::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 100%);
    transform: translateX(-150%) skewX(-20deg);
    z-index: 50;
    filter: blur(6px);
    animation: shine 900ms cubic-bezier(.2,.9,.2,1) 1;
}

@keyframes shine {
    0% { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
    40% { opacity: 1; }
    100% { transform: translateX(150%) skewX(-20deg); opacity: 0; }
}

/* Responsive SVG sizes */
.recipeCard svg {
    width: 17rem;
    height: 9rem;
}

.recipeCard h3 {
    font-size: 1.5rem;
}

/* Compact mode overrides */
.recipeCard.compact svg {
    width: 11rem;
    height: 6rem;
}
.recipeCard.compact h3 {
    font-size: 1.1rem;
}
.recipeCard.compact p {
    font-size: 0.85rem;
}
.recipeCard.compact .card-body { padding-bottom: 4.25rem; }
.recipeCard.compact .summary-container.container-fluid.px-5 {
    padding: 0.5rem 0.75rem !important;
}

/* ensure description text clamps to two lines and doesn't overflow under the summary */
.desc-text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.summary-container h5 {
    font-size: 1.25rem;
}
.summary-container {
    cursor: pointer;
}

.summary-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #3dacd84f;
    opacity: 0;
    transform: scale(0);
    transition: all 0.4s;
    z-index: 0;
}
.summary-container:hover::before {
    opacity: 1;
    transform: scale(1);
}
/* Tablet and below */
@media (max-width: 768px) {
    .recipeCard svg {
        width: 2rem;
        height: 7.5rem;
    }

    .recipeCard h3 {
        font-size: 1.25rem;
    }

    .recipeCard p {
        font-size: 0.9rem;
    }

    .summary-container h5 {
        font-size: 1rem;
    }
}
@media (max-width: 576px) {
  .recipeCard .kindSvg {
    width: 10rem;
    height: 10rem;
    margin: auto;
  }
}

</style>