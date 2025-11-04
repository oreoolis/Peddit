<script setup>
import { ref, watch, watchEffect } from 'vue';
import IngredientCard from './IngredientCard.vue';
import { usePetNutritionStore } from '@/stores/petNutritionStore';
import { useRouter } from 'vue-router';
import Button from '../atoms/button.vue';

const nutritionStore = usePetNutritionStore();
const recipeInfo = ref({
    recipe_name: '',
    description: '',
    notes: '',
    recipe_ingredients: [],
    pet_kind: ''
});
const router = useRouter();

const props = defineProps({
    rec_id: {
        type: String,
        default: ''
    },
    show: {
        type: Boolean,
        default: false
    },
    editable: {
        type: Boolean,
        default: true,
    }
});

// Create a ref to hold the stop function
let stopWatcher = null;

watch(() => props.show, (newShow) => {
    if (newShow && props.rec_id) {
        // Start the watcher only when modal is shown
        stopWatcher = watchEffect(async () => {
            if (props.rec_id) {
                try {
                    const res = await nutritionStore.getRecipe(props.rec_id);
                    if (res?.success && res?.data) {
                        recipeInfo.value = res.data;
                    }
                } catch (error) {
                    console.error('Error loading recipe:', error);
                }
            }
        });
    } else if (!newShow && stopWatcher) {
        // Stop the watcher when modal closes
        stopWatcher();
        stopWatcher = null;
        // Reset the data when closing
        recipeInfo.value = {
            recipe_name: '',
            description: '',
            notes: '',
            recipe_ingredients: [],
            pet_kind: ''
        };
    }
});

const emit = defineEmits(['update:show', 'error', 'delete-recipe-modal']);

const editPet = () => {
    router.push({
        path: '/edit-meal',
        query: { meal: props.rec_id }
    });
};

const closeModal = () => {
    emit('update:show', false);
};

const openDeleteModal = () => {
    if (recipeInfo.value?.recipe_name) {
        emit('delete-recipe-modal', {
            id: props.rec_id,
            name: recipeInfo.value.recipe_name
        });
        closeModal();
    }
};
</script>

<template>
    <div v-if="show && recipeInfo?.recipe_name" class="modal-backdrop" @click="closeModal">
        <div class="modal-content bg-white" @click.stop>
            <div class="modal-header d-flex align-items-center">
                <div class="d-flex align-items-center gap-2">
                    <h5 class="modal-title primary headingFont h3 mb-0">{{ recipeInfo?.recipe_name }}</h5>
                    <div v-if="recipeInfo?.pet_kind === 'dog'" class="icon-wrapper" style="width: 32px; height: 32px;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
                            <path
                                d="M64 176C80.6 176 94.2 188.6 95.8 204.7L96.1 211.3C97.8 227.4 111.4 240 128 240L307.1 240L448 300.4L448 544C448 561.7 433.7 576 416 576L384 576C366.3 576 352 561.7 352 544L352 412.7C328 425 300.8 432 272 432C243.2 432 216 425 192 412.7L192 544C192 561.7 177.7 576 160 576L128 576C110.3 576 96 561.7 96 544L96 298.4C58.7 285.2 32 249.8 32 208C32 190.3 46.3 176 64 176zM387.8 32C395.5 32 402.7 35.6 407.4 41.8L424 64L476.1 64C488.8 64 501 69.1 510 78.1L528 96L584 96C597.3 96 608 106.7 608 120L608 144C608 188.2 572.2 224 528 224L464 224L457 252L332.3 198.6L363.9 51.4C366.3 40.1 376.2 32 387.8 32zM480 108C469 108 460 117 460 128C460 139 469 148 480 148C491 148 500 139 500 128C500 117 491 108 480 108z" />
                        </svg>
                    </div>
                    <div v-else-if="recipeInfo?.pet_kind === 'cat'" class="icon-wrapper" style="width: 32px; height: 32px;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor">
                            <path
                                d="M64 96c53 0 96 43 96 96l0 85.8c29.7-44.7 77.8-76.2 133.4-84 25.6 60 85.2 102.1 154.6 102.1 10.9 0 21.6-1.1 32-3.1L480 480c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-140.8-136 108.8 56 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-144 0c-53 0-96-43-96-96l0-224c0-16.6-12.6-30.2-28.7-31.8l-6.6-.3C44.6 158.2 32 144.6 32 128 32 110.3 46.3 96 64 96zM533.8 3.2C544.2-5.5 560 1.9 560 15.5L560 128c0 61.9-50.1 112-112 112S336 189.9 336 128l0-112.5c0-13.6 15.8-21 26.2-12.3L416 48 480 48 533.8 3.2zM400 108a20 20 0 1 0 0 40 20 20 0 1 0 0-40zm96 0a20 20 0 1 0 0 40 20 20 0 1 0 0-40z" />
                        </svg>
                    </div>
                </div>
                <Button label="X" color="danger" :outline="true" class="ms-auto px-4" @click="closeModal" />
            </div>
            <div v-if="!recipeInfo" class="modal-body">
                <div class="container-fluid py-5 text-center">Loading…</div>
            </div>
            <div v-else class="modal-body">
                <div class="container-fluid">
                    <h3 class="headingFont fw-bold">Recipe Description</h3>
                    <div class="recipe-description container bodyFont py-3">
                        <p>{{ recipeInfo?.description }}</p>
                    </div>
                    <h3 class="headingFont fw-bold">Notes</h3>
                    <div class="recipe-description container bodyFont py-3">
                        <p>{{ recipeInfo?.notes }}</p>
                    </div>
                    <h3 class="headingFont fw-bold">Ingredients</h3>
                    <div class="row d-flex justify-content-center g-2">
                        <div 
                            v-if="recipeInfo?.recipe_ingredients?.length > 0"
                            v-for="(ingredients, idx) in recipeInfo.recipe_ingredients" 
                            :key="`ingredient-${props.rec_id}-${idx}`"
                            class="col-6 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center"
                        >
                            <IngredientCard 
                                v-if="ingredients?.food_ingredients"
                                :name="ingredients.food_ingredients.name"
                                :type="ingredients.food_ingredients.type"
                                :nutrition="ingredients.food_ingredients.nutrition" 
                                :amount="ingredients.quantity_g" 
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <Button v-if="editable" label="Edit" color="secondary" @click="editPet">
                </Button>
                <Button v-if="editable" label="Delete Meal" color="danger" @click="deleteMeal">
                </Button>
            </div>
        </div>
    </div>
</template>


<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content {
    border-radius: 8px;
    width: 90%;
    max-width: 100vh;
    max-height: 90%;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    z-index: 9999;
}

.modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title {
    margin: 0;
    font-weight: 600;
}

.modal-body {
    padding: 1.5rem;
}

.modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #dee2e6;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}
</style>
