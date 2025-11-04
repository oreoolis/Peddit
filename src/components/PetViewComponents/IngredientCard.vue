<script setup>
// Using <script setup> for modern Vue syntax
defineProps({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    nutrition: {
        // nutrition is an object (JSON) coming from the ingredient's nutrition JSONB
        type: Object,
        required: true
    },
    image: {
        type: String,
        default: '/src/assets/Sprite/Food/Set3-Meat/13.png'
    },
    amount: {
        // amount may be a number (grams) or a string; accept both
        type: [String, Number],
        required: true
    }
});
</script>

<template>
    <!-- Using Bootstrap card classes for a consistent base -->
    <div class="card ingredient-card text-center p-2">
        <!-- The container no longer needs a fixed size -->
        <div class="image-container">
            <img :src="image" class="card-img-top" alt="Ingredient Image">
        </div>
        <div class="card-body p-1">
            <h6 class="card-title headingFont fw-bold mb-1">{{name }}</h6>
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
  /* Ensure the card itself can be a flex item if needed */
  display: flex;
  flex-direction: column;
  height: 100%;
}

.image-container {
    /* Remove fixed width and height */
    aspect-ratio: 1 / 1; /* This makes the container a perfect square */
    width: 100%; /* Fill the width of the card's padding */
    display: flex;
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
    flex-grow: 1; /* Allows the body to take up remaining space */
}

/* Hover effect from button.vue */
.ingredient-card:hover {
    transform: translateY(-3px); /* A slightly larger lift for a card */
    box-shadow:
      0 18px 44px rgba(10,20,40,0.10),
      0 6px 16px rgba(10,20,40,0.08);
}

/* Shine animation from button.vue */
.ingredient-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -140%;
  width: 40%;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%);
  transform: skewX(-18deg);
  opacity: 0.2;
}

.ingredient-card:hover::before {
  animation: shine 900ms ease-in-out;
}

@keyframes shine {
    0% { left: -100px; }
    60% { left: 100%; }
    to { left: 100%; }
}

/* Active (pressed) effect from button.vue */
.ingredient-card:active {
    transform: translateY(1px); /* A subtle press down */
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1) inset;
}
</style>