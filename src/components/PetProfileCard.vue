<script setup>
    defineProps({
        petName: {
            type: String,
            required: true
        },
        petBreed: {
            type: String,
            required: true
        },
        petImage: {
            type: String,
            required: true
        }
    })
</script>

<template>
    <div class="text-center bg-secondary w-100 py-3">
        <!-- Circular Pet Image -->
        <div class="d-inline-block">
            <img 
                :src="petImage"
                :alt="petName" 
                class="pet-image rounded-circle" 
            />
        </div>

        <!-- Pet Info -->
        <div class="mt-2">
            <h5 class="pet-name mb-1">{{ petName }}</h5>
            <!-- text-truncate to truncate long breed names? -->
            <p class="text-muted mb-0 small">{{ petBreed }}</p>
        </div>
    </div>
</template>

<style scoped>
    .pet-image {
        width: 100%;
        max-width: 100px;
        height: auto;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        border: 1px solid #f8f9fa;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .pet-name {
        font-weight: 600;
        color: #1a1a1a;
        font-size: 1rem;
    }
</style>