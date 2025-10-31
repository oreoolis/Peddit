<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import IngredientCard from './IngredientCard.vue';
import { usePetNutritionStore } from '@/stores/petNutritionStore';
import { useRouter } from 'vue-router';
import PetNutritionTest from '@/views/PetNutritionTest.vue';

const nutritionStore = usePetNutritionStore();
const recipeInfo = ref(null); // hold all recipe information
const router = useRouter()

const props = defineProps({
    rec_id: {
        type: String,
        required: true
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

watch(() => props.rec_id, async (newRecId) => {
    if (newRecId) {
        const res = await nutritionStore.getRecipe(newRecId);
        if (res.success) {
            recipeInfo.value = res.data;
        }
    }
});


const emit = defineEmits(['update:show', 'error']);

const view = ref(false);

const editPet = () => {
    router.push({
        path: '/edit-meal',
        query: { meal: props.rec_id }
    });
}

const closeModal = () => {
    if (!view.value) {
        emit('update:show', false);
    }
};

const deleteMeal = async () => {
    if (confirm("You are going to delete " + recipeInfo.value.recipe_name + ". Are you sure?")) {
        try {
            const res = await nutritionStore.deleteRecipe(props.rec_id);
            if (!res.success) {
                throw new Error(res.error);
            }
            alert(recipeInfo.value.recipe_name + " has been successfully deleted.") // change to parent toast - QoL
            router.push('/pet');
        } catch (error) {
            alert("Error deleting " + recipeInfo.value.recipe_name + ". Please try again.");
        }
    }
}

</script>
<template>
    <div v-if="show" class="modal-backdrop" @click="closeModal">
        <div class="modal-content bg-white" @click.stop>
            <div class="modal-header d-flex">
                <h5 class="modal-title primary headingFont h3">{{ recipeInfo.recipe_name }}</h5>
                <button type="button" class="btn-close ms-auto" @click="closeModal"></button>
            </div>
            <div class="modal-body">
                <div class="container-fluid">
                    <h3 class="headingFont fw-bold">Recipe Description</h3>
                    <div class="recipe-description container bodyFont py-3">
                        <p>{{ recipeInfo.description }}</p>
                    </div>
                    <h3 class="headingFont fw-bold">Notes</h3>
                    <div class="recipe-description container bodyFont py-3">
                        <p>{{ recipeInfo.notes }}</p>
                    </div>
                    <h3 class="headingFont fw-bold">Ingredients</h3>
                    <div class="row d-flex justify-content-center">
                        <div v-for="(ingredients, idx) in recipeInfo.recipe_ingredients" :key="idx"
                            class="col-12 col-sm-12 col-md-4 col-lg-2 d-flex justify-content-center">
                            <IngredientCard :name="ingredients.food_ingredients.name"
                                :type="ingredients.food_ingredients.type"
                                :nutrition="ingredients.food_ingredients.nutrition" :amount="ingredients.quantity_g" />
                        </div>
                    </div>
                    <button v-if="editable" type="button" class="btn btn-secondary bodyFont text-end" @click="editPet">
                        Edit
                    </button>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" v-if="editable" class="btn btn-danger bodyFont" @click="deleteMeal">
                    Delete Meal
                </button>
                <button type="button" class="btn btn-primary bodyFont" @click="closeModal">
                    Close
                </button>
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
    justify-content: between;
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