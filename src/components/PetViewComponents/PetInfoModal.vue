<script setup>
import { ref, watch } from 'vue';
import MealPlanCards from './MealPlanCard.vue';

const props = defineProps({
  name: String,
  gender: String,
  breed: String,
  birthday: String,
  weight: Number,
  allergies: String,
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
                <h5 class="modal-title primary headingFont h3">Full Summary</h5>
                <button type="button" class="btn-close ms-auto" @click="closeModal"></button>
            </div>
            <form>
                <div class="modal-body">
                    <img src="../../assets/ragdoll.jpg" class="img-thumbnail container-fluid rounded-5 px-3 py-3 shadow"
                        alt="...">
                    <div class="pet-info container fw-bold py-5 px-5 mt-4 rounded-5 bg-light shadow">
                        <h2 class="headingFont fw-semibold m-2">{{ name }}</h2>
                        <div class="row d-flex justify-content-center py-1">
                            <div class="col-lg-6">
                                <h5 class="headingFont fw-semibold d-inline m-1">Gender:</h5>
                                <div class="d-inline">
                                    <p class="bodyFont d-inline">{{gender}}</p>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <h5 class="headingFont fw-semibold d-inline m-1">Birthday:</h5>
                                <div class="d-inline">
                                    <p class="bodyFont d-inline">{{ birthday }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="row d-flex justify-content-center py-1">
                            <div class="col-lg-6">
                                <h5 class="headingFont fw-semibold d-inline m-1">Breed:</h5>
                                <div class="d-inline">
                                    <p class="bodyFont d-inline">{{breed}}</p>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <h5 class="headingFont fw-semibold d-inline m-1">Weight:</h5>
                                <div class="d-inline">
                                    <p class="bodyFont d-inline">{{weight}}kg</p>
                                </div>
                            </div>
                        </div>
                        <div class="row py-1">
                            <div class="col-lg-6">
                                <h5 class="headingFont fw-semibold d-inline m-1">Allergies:</h5>
                                <div class="d-inline">
                                    <p class="bodyFont d-inline">{{allergies}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="preferred-meal-container container py-5 px-5 mt-4 rounded-5 bg-light shadow">
                        <h2 class="headingFont fw-semibold">Preferred Meal</h2>
                            <div class = "row d-flex justify-content-center">
                                <div class = "col-lg-5">
                                    <MealPlanCards/>
                                </div>
                            </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-primary bodyFont" @click="closeModal">
                        Close
                    </button>
                </div>
            </form>
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

.img-thumbnail {
    max-width: 100vh;
    max-height: 60vh;
    position: relative;
    object-fit: cover;
}

p {
    font-size: 19px;
}
</style>