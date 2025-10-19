<script setup>
import { ref, watch } from 'vue';
import MealPlanCards from './MealPlanCard.vue';
import Button from '../atoms/button.vue';
import PetInfoCard from '../molecules/PetInfoCard.vue';

const props = defineProps({
  name: String,
  gender: String,
  breed: String,
  birthday: String,
  weight: Number,
  allergies: String,
  photo_url: String,
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
            <div class="modal-header d-flex shadow">
                <h5 class="modal-title primary headingFont h3 ">Summary : <i>{{ name }}</i></h5>
                <Button label="X" color="danger" outline="true" class="ms-auto px-4" @click="closeModal"></Button>
            </div>
            <form>
                <div class="modal-body">
                    <div class="row">
                    <img :src="photo_url" class=" col-8 img-fluid container-fluid p-0 rounded-start-5 shadow "
                        alt="...">
                    <PetInfoCard class="col-4 p-0 rounded-end-5"
                            :name="name"
                            :gender="gender"
                            :birthday="birthday"
                            :breed="breed"
                            :weight="weight"
                            :allergies="allergies"
                            />
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
    background-color: white;
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

.img-fluid{
    object-fit: cover;
}

p {
    font-size: 19px;
}

/* entrance for the whole modal content (subtle scale + fade) */
@keyframes modalPop {
  from { opacity: 0; transform: translateY(15px) scale(.950); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* staggered pop for internal data boxes */
@keyframes floatIn {
  from { opacity: 0; transform: translateY(8px) scale(.950); }
  60%  { opacity: 1; transform: translateY(-5px) scale(1.05); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* apply modal entrance animation when backdrop is shown */
.modal-backdrop .modal-content {
  animation: modalPop .28s cubic-bezier(.2,.9,.2,1) both;
}

/* animate data containers with a small stagger for nicer UX */

.preferred-meal-container {
  opacity: 0;
  transform-origin: top center;
  animation: floatIn .36s cubic-bezier(.2,.9,.2,1) both;
}

/* gentle stagger delays */
.pet-info-card { animation-delay: .06s; }
.preferred-meal-container { animation-delay: .14s; }

/* refine interior children micro-motion (useful if those sections contain cards) */
.pet-info-card > * , .preferred-meal-container > * {
  will-change: transform, opacity;
  transition: transform .18s cubic-bezier(.2,.9,.2,1), box-shadow .18s ease;
}

/* slight lift on hover for card-like children (still rely on Bootstrap for structure) */
.preferred-meal-container .card,
.pet-info-card {
  transition: transform .18s cubic-bezier(.2,.9,.2,1), box-shadow .18s ease;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .container:hover,
  .container:focus-within {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    box-shadow: none !important;
  }
}

.modal-content::-webkit-scrollbar {
  width: 15px;
  height: 10px;
}
.modal-content::-webkit-scrollbar-track {
  background: var(--bs-white);
  border-end-end-radius: 8px;
  border-top-right-radius: 8px;
}
.modal-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(var(--bs-primary-rgb),0.88), rgba(var(--bs-primary-rgb),0.48));
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.04);
}
.modal-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(var(--bs-primary-rgb)), rgba(var(--bs-primary-rgb),0.9));
}



</style>