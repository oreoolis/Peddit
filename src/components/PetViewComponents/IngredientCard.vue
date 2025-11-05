<script setup>
// Using <script setup> for modern Vue syntax
const props = defineProps({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    nutrition: {
        type: [String, Object],
        required: true
    },
    meatImg: {
        type: String,
        default: '/src/assets/Sprite/Food/Meat.png'
    },
    fruitImg: {
        type: String,
        default: '/src/assets/Sprite/Food/Fruit.png'
    },
    vegeImg: {
        type: String,
        default: '/src/assets/Sprite/Food/Vegetable.png'
    },
    grainImg: {
        type: String,
        default: '/src/assets/Sprite/Food/Grain.png'
    },
    otherImg: {
        type: String,
        default: '/src/assets/Sprite/Food/Others.png'
    },
    amount: {
        type: [String, Number],
        required: true
    },
    kind: {
        type: String,
        default: ''
    }
});
</script>


<template>
    <div class="card ingredient-card text-center p-2">
        <div class="image-container">
            <!-- classify ingredient type -->
            <img v-if="kind == 'others'" :src="otherImg" class="card-img-top" alt="Ingredient Image">
            <img v-else-if="kind == 'grain'" :src="grainImg" class="card-img-top" alt="Ingredient Image">
            <img v-else-if="kind == 'vegetable'" :src="vegeImg" class="card-img-top" alt="Ingredient Image">
            <img v-else-if="kind == 'fruit'" :src="fruitImg" class="card-img-top" alt="Ingredient Image">
            <img v-else :src="meatImg" class="card-img-top" alt="Ingredient Image">
        </div>
        <div class="card-body p-1">
            <h6 class="card-title headingFont fw-bold mb-1">{{ name }}</h6>
            <p class="card-text bodyFont text-muted small mb-0">{{ amount }}g</p>
        </div>
    </div>
</template>


<style scoped>
.ingredient-card {
    border: 1px solid var(--bs-border-color-translucent);
    cursor: pointer;
    user-select: none;
    position: relative;
    overflow: hidden;
    transition: box-shadow .18s ease, transform .12s ease;
    will-change: transform, box-shadow;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);

    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    min-width: 0;
}


.image-container {
    aspect-ratio: 1 / 1;
    width: 100%;
    align-items: center;
    justify-content: center;
    background-color: var(--bs-light);
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
}


.card-img-top {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
}


.card-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
}


.card-title {
    word-break: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    line-clamp: 2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}


.card-text {
    word-break: break-word;
    overflow-wrap: break-word;
}



.ingredient-card:hover {
    transform: translateY(-3px);
    box-shadow:
        0 18px 44px rgba(10, 20, 40, 0.10),
        0 6px 16px rgba(10, 20, 40, 0.08);
}



.ingredient-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: -140%;
    width: 40%;
    height: 100%;
    pointer-events: none;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0) 100%);
    transform: skewX(-18deg);
    opacity: 0.2;
}


.ingredient-card:hover::before {
    animation: shine 900ms ease-in-out;
}


@keyframes shine {
    0% {
        left: -100px;
    }

    60% {
        left: 100%;
    }

    to {
        left: 100%;
    }
}



.ingredient-card:active {
    transform: translateY(1px);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1) inset;
}


@media (max-width: 576px) {
    .ingredient-card {
        min-height: auto;
    }

    .card-title {
        font-size: 0.8rem;
        margin-bottom: 0.25rem !important;
    }

    .card-text {
        font-size: 0.75rem;
    }
}


@media (min-width: 576px) {
    .card-title {
        font-size: 0.875rem;
    }

    .card-text {
        font-size: 0.75rem;
    }
}
</style>
