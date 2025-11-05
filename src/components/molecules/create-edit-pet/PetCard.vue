<script setup>
import { ref, defineProps, computed, onMounted, toRef, watch } from 'vue';
import Button from '@/components/atoms/button.vue';
import { usePetNutritionStore } from '@/stores/petNutritionStore';


const props = defineProps(['id', 'name', 'kind', 'gender', 'breed', 'birthday', 'weight', 'allergies', 'neutered', 'photo_url', 'recipe_id'])
const nutritionStore = usePetNutritionStore();
const recipeDetails = ref({});
const emit = defineEmits(['open-pet-info']);

const handleOpenPetInfo = () => {
    emit('open-pet-info', {
        id: props.id,
        name: props.name,
        kind: props.kind,
        gender: props.gender,
        breed: props.breed,
        birthday: props.birthday,
        weight: props.weight,
        allergies: props.allergies,
        neutered: props.neutered,
        photo_url: props.photo_url,
        recipeDetails: recipeDetails.value
        
    });
}

const recipeId = toRef(props, 'recipe_id');

watch(recipeId, async (id) => {
    if (!id) {
        recipeDetails.value = null;
        return;
    }
    const res = await nutritionStore.getRecipe(id);
    if (res.success) {
        recipeDetails.value = res.data;
    }
    },
    { immediate: false }
)


// onMounted(async () => {
//     if(!props.recipe_id) return; //Stops the bug
//     const res = await nutritionStore.getRecipe(props.recipe_id);
//     if (res.success){
//         recipeDetails.value = res.data;
//     }
// })

</script>
<template>
    <div class="pet-card card overflow-hidden shadow p-3 mb-5 bg-body-tertiary rounded-4 h-100 position-relative w-100">
        <div class="card-header p-0 text-center bg-transparent border-0">
            <div class="row">
                <div class="col-9 my-auto ">
                    <h4 class="bodyFont fw-bold text-start">{{ name }}</h4>
                </div>
                <div class="col-3 text-end">
                    <div v-if="props.gender == 'male'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" fill="blue"
                            class="bi bi-gender-male" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                d="M9.5 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.707L9.871 6.836a5 5 0 1 1-.707-.707L13.293 2zM6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8" />
                        </svg>
                    </div>
                    <div v-if="props.gender == 'female'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" fill="red"
                            class="bi bi-gender-female" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13h-2a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5" />
                        </svg>
                    </div>
                    <div v-if="props.gender == 'unknown'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 64 64" 
                            fill="purple">
                            <g fill-rule="evenodd">
                            <path d="M30.2 2.1Q12.8 3.3 12 21.3h11.7c.1-4.1 2.5-7.2 6.7-7.7s8.2.6 9.4 3.4c1.3 3.1-1.6 6.7-3 8.2-2.6 2.8-6.8 4.9-8.9 7.9s-2.5 6.9-2.7 11.7h10.3c.1-3.1.3-6 1.7-7.9 2.3-3.1 5.7-4.5 8.5-7 2.7-2.3 5.6-5.1 6-9.5 1.6-12.9-9-19.1-21.5-18.3" />
                            <ellipse cx="30.515" cy="55.567" rx="6.532" ry="6.433"/></g></svg>
                    </div>
                </div>
            </div>
        </div>
         <div class="ratio mb-3" style="--bs-aspect-ratio: 75%;">
            <img :src="props.photo_url" class="w-100 h-100 rounded-5 object-fit-cover" alt="pet photo">
        </div>
        <div class="ratio mb-3 image-area">
            <img :src="props.photo_url" class="w-100 h-100 rounded-5 object-fit-cover" alt="pet photo">
        </div>

        <div class="card-body d-flex flex-column ">
            <div class="card-text py-1">
                <section class="pet-info headingFont ">

                    <h4 class="fw-bold d-flex align-items-center" >Current Diet: 
                        <Button v-if="recipeDetails.recipe_name" class="h-75 mx-1" :label="recipeDetails.recipe_name"
                        >
                        </Button>
                        <Button v-else class="h-75 mx-1" label="None">
                        </Button>
                    </h4>
                </section>
            </div>
            <div class="summary-container container-fluid position-absolute bottom-0 end-0 px-3 py-3 bg-primary"
                @click="handleOpenPetInfo">
                <div class="text-center text-light fw-bold h5 bodyFont">
                    Summary
                </div>
            </div>
        </div>       
    </div>

</template>
<style>
.pet-card {
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    /* Prevent card from becoming too narrow on small viewports */
    min-width: 220px;
}

.pet-card:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 16px rgba(75, 75, 75, 0.2);
    z-index: 1;
}

.pet-info {
    display: block;
}

.meal-tooltip {
    display: inline-block;
    background-color: #237b9f;
    border-radius: 10px;
    color: white;
    padding: 5px 5px 5px 5px;
    font-weight: 100;
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

/* Responsive text sizes */
@media (max-width: 576px) {
    .pet-card h4 {
        font-size: 1rem;
    }

    .pet-info h4 {
        font-size: 0.95rem;
    }

    .summary-container h5 {
        font-size: 1rem;
    }
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
@media (max-width: 480px) {
    .pet-card h4 {
        font-size: 0.9rem;
    }

    .pet-info h4 {
        font-size: 0.85rem;
    }

    .summary-container h5 {
        font-size: 0.9rem;
    }
}
</style>
