<script setup>
import MealInfoModal from './MealInfoModal.vue';
import { ref } from 'vue';
const props = defineProps({
    Recipe_Name: {
        default: "Recipe_Name",
        type: String,
    },
    Recipe_Description: {
        default: "Recipe Description",
        type: String,
    },
    Breed_Type: {
        default: "Breed_Type",
        type: String,
    },
    Image: {
        default: "./src/assets/Sprite/Food/Set3-Meat/11.png",
        type: String,
    }

    }
);
const showMealInfo = ref(false);
const openMealInfo = () => {
    showMealInfo.value = true;
}
</script>
<template>
    <div class="recipeCard card overflow-hidden bg-primary shadow p-3 mb-5 rounded-5" style="width: 18rem; height: 27rem;">
        <!-- to show the first ingredient item -->
        <img :src="Image" class="card-img-top " alt="...">
        <div class="card-body">
            <div class="card-text text-center">
                <h3 class="headingFont text-light">{{props.Recipe_Name}}</h3>
                <p class="bodyFont text-light">{{Breed_Type}}</p>
                <p class="bodyFont text-light">{{Recipe_Description}}</p>
            </div>
            <div class="summary-container container-fluid position-absolute bottom-0 start-0 end-0 px-3 py-3 bg-primary"
                @click="openMealInfo">
                <div class="summary-container container-fluid position-absolute bottom-0 start-0 end-0 px-5 py-3 bg-white"
                    @click="openMealInfo">
                    <div class="text-center grey fw-bold h5 bodyFont">
                        View Info
                    </div>
                </div>
            </div>
        </div>
    </div>
    <MealInfoModal v-model:show="showMealInfo" />
</template>
<style>
.recipeCard {
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    border: none;
}

.recipeCard:hover {
    transform: scale(1.03);
    /* Zooms in the card by 5% */
    box-shadow: 0 8px 16px rgba(75, 75, 75, 0.2);
    /* Adds a subtle shadow */
}
</style>