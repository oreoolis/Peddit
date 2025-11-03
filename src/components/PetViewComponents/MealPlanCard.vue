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
    width: compact.value ? '12rem' : '18rem',
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
                <p class="bodyFont text-light">{{ desc }}</p>

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
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    border: none;
}

.recipeCard:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 16px rgba(75, 75, 75, 0.2);
}

/* Responsive SVG sizes */
.recipeCard svg {
    width: 17rem;
    height: 9rem;
}

.recipeCard h3 {
    font-size: 1.5rem;
}

.recipeCard p {
    font-size: 1rem;
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
.recipeCard.compact .summary-container.container-fluid.px-5 {
    padding: 0.5rem 0.75rem !important;
}

.summary-container h5 {
    font-size: 1.25rem;
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

/* Mobile */
@media (max-width: 576px) {
    .recipeCard svg {
        width: 11rem;
        height: 6rem;
    }

    .recipeCard h3 {
        font-size: 1.1rem;
    }

    .recipeCard p {
        font-size: 0.85rem;
    }

    .summary-container h5 {
        font-size: 0.9rem;
    }
}

/* Extra small screens */
@media (max-width: 480px) {
    .recipeCard svg {
        width: 9rem;
        height: 5rem;
    }

    .recipeCard h3 {
        font-size: 1rem;
    }

    .recipeCard p {
        font-size: 0.8rem;
    }

    .summary-container h5 {
        font-size: 0.8rem;
    }
}
</style>