<script setup>
import { ref, watch } from 'vue';
import IngredientCard from './IngredientCard.vue';


const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:show', 'uploaded', 'error']);

const view = ref(false);

// // Reset when modal opens/closes
watch(() => props.show, (newVal) => {
    if (!newVal) {
        //resetForm();
    }
});


const closeModal = () => {
    if (!view.value) {
        emit('update:show', false);
    }
};
</script>
<template>
    <div v-if="show" class="modal-backdrop" @click="closeModal">
        <div class="modal-content bg-white" @click.stop>
            <div class="modal-header d-flex">
                <h5 class="modal-title primary headingFont h3">Recipe X's Information</h5>
                <button type="button" class="btn-close ms-auto" @click="closeModal"></button>
            </div>
            <div class="modal-body">
                <div class="container-fluid">
                    <h3 class="headingFont fw-bold">Recipe Description</h3>
                    <div class="recipe-description container bodyFont py-3">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac condimentum nulla. Sed nec
                            felis arcu. Cras at nisi quis tortor maximus finibus. Sed sit amet scelerisque enim, eu
                            pellentesque est. Integer sit amet sollicitudin mauris. Interdum et malesuada fames ac ante
                            ipsum primis in faucibus. Donec dictum turpis mollis, venenatis ex eu, pharetra felis.
                            Vivamus fermentum fringilla aliquet.</p>
                    </div>
                    <h3 class="headingFont fw-bold">Ingredients</h3>
                    <div class="row d-flex justify-content-center">
                        <div class="col-12 col-sm-12 col-md-4 col-lg-2 d-flex justify-content-center">
                            <IngredientCard />
                        </div>
                        <div class="col-12 col-sm-12 col-md-4 col-lg-2 d-flex justify-content-center">
                            <IngredientCard />
                        </div>
                        <div class="col-12 col-sm-12 col-md-4 col-lg-2 d-flex justify-content-center">
                            <IngredientCard />
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
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
    z-index: 1050;
}

.modal-content {
    border-radius: 8px;
    width: 90%;
    max-width: 100vh;
    max-height: 90%;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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