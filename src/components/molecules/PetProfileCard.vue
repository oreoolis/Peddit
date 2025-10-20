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
    <div class="text-center w-100 pt-2 rounded profile-card card">
        <!-- Circular Pet Image -->
        <div class="mt-2 d-inline">
            <h5 class="pet-name headingFont">{{ petName }} <img src="../assets/Sprite/GenderIcon/FemaleIcon.png" alt=""></h5>
            
        </div>         
        <div class="d-inline-block">
            <img 
                :src="petImage"
                :alt="petName" 
                class="pet-image" 
            />
        </div>

        <!-- Pet Info -->
        <div class="my-1">
            <!-- text-truncate to truncate long breed names? -->
            <p class="text-muted mb-0 small bodyFont"><b>Breed:</b> {{ petBreed }}</p>
            <p class="text-muted mb-0 small bodyFont"><b>Meal:</b> **Insert Meal Here**</p>
        </div>
        <div>
            <p class="bg-primary white rounded-bottom">Summary</p>
        </div>
    </div>
</template>

<style scoped>
    .pet-image {
        width: 100%;
        padding: 5%;
        height: auto;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        border-radius: 25px;
        
    }

    .pet-name {
        font-weight: 600;
        color: #1a1a1a;
        font-size: 1rem;
    }
    .profile-card {
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .profile-card:hover {
        transform: scale(1.02);
        box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    }

</style>