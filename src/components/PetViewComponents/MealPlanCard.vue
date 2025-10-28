<script setup>
import MealInfoModal from './MealInfoModal.vue';
import { ref,computed } from 'vue';


const props = defineProps(["rec_id", "name", "desc","editable","compact","Image"])

const showMealInfo = ref(false);
const openMealInfo = () => {
    showMealInfo.value = true;
}
const cardStyle = computed(() => ({
  width: props.compact == true ? '12rem' : '18rem',
  height: props.compact == true ? '16rem' : '27rem'
}));

</script>
<template>
    <div class="recipeCard card overflow-hidden bg-primary shadow p-3 mb-5 rounded-5 border-1" :style="cardStyle">
        <!-- to show the first ingredient item -->
        <img :src="Image" class="card-img-top " alt="...">
        <div class="card-body">
            <div class="card-text text-center">
                <h3 class="headingFont text-light">{{name}}</h3>
                <p class="bodyFont text-light">{{desc}}</p>
            </div>
            <div class="summary-container container-fluid position-absolute bottom-0 start-0 end-0 px-3 py-3 bg-primary">
                <div class="summary-container container-fluid position-absolute bottom-0 start-0 end-0 px-5 py-3 bg-white"
                    @click="openMealInfo">
                    <div class="text-center black fw-bold h5 bodyFont">
                        View Info
                    </div>
                </div>
            </div>
        </div>
    </div>
    <MealInfoModal v-model:show="showMealInfo" :rec_id="rec_id" :editable="editable"/>
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