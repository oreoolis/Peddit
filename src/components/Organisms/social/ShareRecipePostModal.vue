<script setup>
import { ref, watch } from 'vue';
import Button from '../../atoms/button.vue';
import searchBar from '../../atoms/searchBar.vue';
import MealPlanCard from '@/components/PetViewComponents/MealPlanCard.vue';
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
// Form state
const postContent = ref('');

// TODO: Get Current User's Recipes

// Reset form when modal is closed
watch(() => props.show, (newVal) => {
    if (!newVal) {
        postContent.value = '';
    }
});

const closeModal = () => {
    emit('update:show', false);
};
// Need some logic for Recipe Id
const handleSubmit = () => {
    if ( postContent.value) {
        emit('create-post', {
            content: postContent.value,
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
                    </div>

                    <!-- Meal Plan -->
                    <div class="mb-3">
                        <label  class="form-label headingFont fw-bold h5 mb-3">Select a Meal Plan</label>
                        <div class="d-flex px-2 gap-3">
                        <MealPlanCard class="me-2"
                        v-for="Meal in props.user_MealPlans"
                        :key="Meal"
                        :rec_id="Meal.rec_id"
                        :name="Meal.name"
                        :desc="Meal.desc"
                        :editable="false"
                        :compact="true"
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
</style>