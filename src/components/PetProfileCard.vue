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
    <div class="pet-profile-card text-center bg-secondary">
        <!-- Circular Pet Image -->
        <div class="position-relative d-inline-block">
            <img 
                :src="petImage"
                :alt="petName" 
                class="pet-image rounded-circle" 
            />
        </div>

        <!-- Pet Info -->
        <div class="pet-info mt-2">
            <h5 class="pet-name mb-1">{{ petName }}</h5>
            <p class="pet-breed text-muted mb-0">{{ petBreed }}</p>
        </div>
    </div>
</template>

<style scoped>
    .pet-profile-card {
        max-width: 150px;
        padding: 1rem;
    }

    .pet-image {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border: 1px solid #f8f9fa;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .pet-name {
        font-weight: 600;
        color: #1a1a1a;
        font-size: 1rem;
    }

    .pet-breed {
        font-size: 0.875rem;
    }
</style>