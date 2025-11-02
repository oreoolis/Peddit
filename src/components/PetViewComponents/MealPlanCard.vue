<script setup>
import { ref, computed } from 'vue';


const props = defineProps(["rec_id", "name", "desc", "petKind", "compact","editable"])
const emit = defineEmits(['open-meal-info']);

const handleOpenMealInfo = () => {
    // Emit the rec_id and the editable flag so parent can forward edit permissions to any modal
    emit('open-meal-info', {
        rec_id: props.rec_id,
        editable: props.editable === undefined ? true : !!props.editable
    })
}

const cardStyle = computed(() => ({
    width: props.compact == true ? '12rem' : '18rem',
    height: props.compact == true ? '16rem' : '27rem'
}));

</script>
<template>
    <div class="recipeCard card overflow-hidden bg-primary shadow p-3 mb-5 rounded-5 border-1" :style="cardStyle">
        <div class = "mt-5">
            <p v-if="petKind == 'dog'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="white"
                    style="width: 17rem; height: 9rem;">
                    <path
                        d="M64 176C80.6 176 94.2 188.6 95.8 204.7L96.1 211.3C97.8 227.4 111.4 240 128 240L307.1 240L448 300.4L448 544C448 561.7 433.7 576 416 576L384 576C366.3 576 352 561.7 352 544L352 412.7C328 425 300.8 432 272 432C243.2 432 216 425 192 412.7L192 544C192 561.7 177.7 576 160 576L128 576C110.3 576 96
                561.7 96 544L96 298.4C58.7 285.2 32 249.8 32 208C32 190.3 46.3 176 64 176zM387.8 32C395.5 32 402.7 35.6 407.4 41.8L424 64L476.1 64C488.8 64 501 69.1 510 78.1L528 96L584 96C597.3 96 608 106.7 608 120L608 144C608 188.2 572.2 224 528 224L464 224L457 252L332.3 198.6L363.9 51.4C366.3 40.1 376.2 32 387.8 32zM480 108C469 108 460 117 460 128C460 139 469 148 480 148C491 148 500 139 500 128C500 117 491 108 480 108z" />
                </svg>
            </p>
            <p v-else>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="white"
                    style="width: 15rem; height: 8rem;">
                    <path
                        d="M64 96c53 0 96 43 96 96l0 85.8c29.7-44.7 77.8-76.2 133.4-84 25.6 60 85.2 102.1 154.6 102.1 10.9 0 21.6-1.1 32-3.1L480 480c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-140.8-136 108.8 56 0c17.7 0 32 14.3 32 32s-14.3 32-32
                        32l-144 0c-53 0-96-43-96-96l0-224c0-16.6-12.6-30.2-28.7-31.8l-6.6-.3C44.6 158.2 32 144.6 32 128 32 110.3 46.3 96 64 96zM533.8 3.2C544.2-5.5 560 1.9 560 15.5L560 128c0 61.9-50.1 112-112 112S336 189.9 336 128l0-112.5c0-13.6 15.8-21 26.2-12.3L416 48 480 48 533.8 3.2zM400 108a20 20 0 1 0 0 40 20 20 0 1 0 0-40zm96 0a20 20 0 1 0 0 40 20 20 0 1 0 0-40z" />
                </svg>
            </p>
        </div>
        <div class="card-body">
            <div class="card-text text-center">
                <h3 class="headingFont text-light">{{ name }}</h3>
                <p class="bodyFont text-light">{{ desc }}</p>

            </div>
            <div
                class="summary-container container-fluid position-absolute bottom-0 start-0 end-0 px-3 py-3 bg-primary">
                <div class="summary-container container-fluid position-absolute bottom-0 start-0 end-0 px-5 py-3 bg-white"
                    @click="handleOpenMealInfo">
                    <div class="text-center black fw-bold h5 bodyFont">
                        View Info
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

.summary-container h5 {
    font-size: 1.25rem;
}

/* Tablet and below */
@media (max-width: 768px) {
    .recipeCard svg {
        width: 14rem;
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