<script setup>
import { ref, watch } from 'vue';
import Button from '../../atoms/button.vue';
import searchBar from '../../atoms/searchBar.vue';
import MealPlanCard from '@/components/PetViewComponents/MealPlanCard.vue';
import { usePetNutritionStore } from '@/stores/petNutritionStore';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/authStore';

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    user_MealPlans:{
        type : Array,
        default : ()=>[
            {rec_id: "1",name : "Beef Blast",desc: "Some desc"},
            {rec_id: "2",name : "Veggie Delight",desc: "Some other desc"},
            {rec_id: "3",name : "Water Only",desc: "Something"}
        ]

    }
});

const emit = defineEmits(['update:show', 'create-post']);

// Form state
const postContent = ref('');
const selectedPlanId = ref(null);

// Character limits for share modal
const CONTENT_MAX_CHARS = 5000;

const enforceChars = (text = '', max = Infinity) => {
    if (!text) return '';
    return text.slice(0, max);
}

const contentCharsRemaining = () => Math.max(0, CONTENT_MAX_CHARS - (postContent.value?.length || 0));

watch(postContent, (val) => {
    if (val == null) return;
    const enforced = enforceChars(val, CONTENT_MAX_CHARS);
    if (enforced !== val) postContent.value = enforced;
});

// Stores
const petNutritionStore = usePetNutritionStore();
const { recipes: storeRecipes } = storeToRefs(petNutritionStore);
const authStore = useAuthStore();

// Local meal plans shown in modal (defaults to prop sample)
const userMealPlans = ref(props.user_MealPlans || []);

// Fetch the current user's recipes when modal opens
watch(() => props.show, async (newVal) => {
    if (!newVal) {
        postContent.value = '';
        selectedPlanId.value = null;
        return;
    }

    // If user is logged in, fetch their recipes from the store
    const userId = authStore.user?.id;
    if (userId) {
        try {
            await petNutritionStore.fetchRecipes(userId);
            // Map store recipes to the simple shape used by this modal
            userMealPlans.value = (storeRecipes.value || []).map(r => ({
                rec_id: r.id,
                name: r.recipe_name,
                desc: r.description,
                petKind: r.pet_kind ?? null
            }));
        } catch (err) {
            console.warn('Failed to fetch user meal plans for Share modal:', err);
            userMealPlans.value = props.user_MealPlans || [];
        }
    } else {
        // Not logged in: use provided sample or empty
        userMealPlans.value = props.user_MealPlans || [];
    }
});

const closeModal = () => {
    emit('update:show', false);
};

const selectPlan = (payload) => {
    // payload might be an object emitted by MealPlanCard or a primitive id
    if (!payload) return;
    const id = (typeof payload === 'object') ? (payload.rec_id ?? payload.id) : payload;
    selectedPlanId.value = id;
};

const handleSubmit = () => {
    // enforce limits again before submit
    postContent.value = enforceChars(postContent.value, CONTENT_MAX_CHARS);

    if ( postContent.value) {
        emit('create-post', {
            content: postContent.value,
            recipeId: selectedPlanId.value ?? null
        });
        closeModal();
    } else {
        alert('Please fill out both the title and content.');
    }
};
</script>

<template>
    <div v-if="show" class="modal-backdrop" @click="closeModal">
        <div class="modal-content bg-white" @click.stop>
            <div class="modal-header">
                <h5 class="modal-title headingFont">Share A Recipe</h5>
                <Button icon="bi-x-lg" outline color="danger" @click="closeModal" label="X" class="ms-auto" />
            </div>
            <form @submit.prevent="handleSubmit">
                <div class="modal-body">
                    <!-- Post Content -->
                    <div class="mb-3">
                        <label class="form-label headingFont fw-bold h5">Content</label>
                        <searchBar
                            v-model="postContent"
                            type="textarea"
                            placeholder="What's on your mind?"
                        />
                        <div class="form-text text-muted small mt-1">
                            {{ contentCharsRemaining() }} chars remaining
                        </div>
                    </div>

                    <!-- Meal Plan -->
                    <div class="mb-3">
                        <label  class="form-label headingFont fw-bold h5 mb-3">Select a Meal Plan</label>
                        <div class="d-flex px-2 gap-3">
                        <div v-if="userMealPlans.length === 0" class="text-muted">No meal plans found</div>
                        <MealPlanCard class="me-2"
                        v-for="Meal in userMealPlans"
                        :key="Meal.rec_id"
                        :rec_id="Meal.rec_id"
                        :name="Meal.name"
                        :desc="Meal.desc"
                        :petKind="Meal.petKind"
                        :editable="false"
                        :compact="true"
                        @open-meal-info="selectPlan"
                        :class="{ 'selected-plan': selectedPlanId === Meal.rec_id }"
                        ></MealPlanCard>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <Button type="submit" label="Post">
                        <i class="bi bi-send mx-1"></i>
                    </Button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
/* These styles are copied directly from AddIngredientModal for consistency */
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
    z-index: 1050;
}

.modal-content {
    border-radius: 8px;
    width: 90%;
    max-width: 600px; /* A bit wider for post content */
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
}

.modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color:white;
}

.modal-title {
    margin: 0;
    font-weight: 600;
}

.modal-body {
    padding: 1.5rem;
    overflow-y: auto;
}

.modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #dee2e6;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

/* Specific style for the textarea */
textarea.form-control {
    resize: vertical; /* Allow vertical resizing */
    min-height: 120px;
}
.preview-image {
  width: 150px;
  height: 150px;
  border: 2px solid #e0e0e0;
}

.selected-plan {
        transform: scale(1.03);
        box-shadow: 0 6px 18px rgba(0,0,0,0.12);
        border-radius: 12px;
        outline: 3px solid rgba(var(--bs-primary-rgb), 0.18);
}
</style>