<script setup>
import { ref, watch, onMounted } from 'vue';
import MealPlanCard from '../PetViewComponents/MealPlanCard.vue';
import Button from '../atoms/button.vue';
import PetInfoCard from '../molecules/PetInfoCard.vue';
import buttonTogglable from '../atoms/buttonTogglable.vue';
import { usePetStore } from '@/stores/petStore';
import { useRouter } from 'vue-router';
import { usePetNutritionStore } from '@/stores/petNutritionStore';

const petStore = usePetStore();
// const nutritionStore = usePetNutritionStore();
const router = useRouter();

const recipeInfo = ref({});

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    kind: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    allergies: {
        type: String,
        required: true
    },
    neutered: {
        type: String,
        required: true
    },
    photo_url: {
        type: String,
        required: true
    },
    recipeDetails: {
        type: Object,
        required: false
    },
    show: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:show', 'uploaded', 'error', 'click', 'open-meal-info']);
const handleOpenMealInfo = (payload) => {
    // If child MealPlanCard forwards a payload, re-emit it so parents can respect editable flags.
    if (payload && typeof payload === 'object') {
        emit('open-meal-info', payload);
        return;
    }

    // Fallback: emit the recipe id from props
    emit('open-meal-info', {
        rec_id: props.recipeDetails?.id
    });
}
const view = ref(false);

const editPet = () => {
    router.push({
        path: '/edit-pet',
        query: { id: props.id }
    });
}


const deletePet = async () => {
    if (confirm("You are going to delete " + props.name + ". Are you sure?")) {
        try {
            const res = await petStore.deletePet(props.id);
            if (!res.success) {
                throw new Error(res.error);
            }
            alert(props.name + " has been successfully deleted.") // change to parent toast - QoL
            router.push('/pet');
        } catch (error) {
            alert("Error deleting " + props.name + ". Please try again.");
        }
    }
}

const closeModal = () => {
    if (!view.value) {
        emit('update:show', false);
    }
};

</script>
<template>
    <div v-if="show" class="modal-backdrop" @click="closeModal">
        <div class="modal-content bg-white" @click.stop>
            <div class="modal-header d-flex shadow sticky-top">
                <h5 class="modal-title primary headingFont h3 ">Summary : <i>{{ name }}</i></h5>
                <Button label="X" color="danger" outline="true" class="ms-auto px-4" @click="closeModal"></Button>
            </div>
            <form>
                <div class="modal-body">
                    <div class="row">
                        <img :src="photo_url" class=" col-8 img-fluid container-fluid p-0 rounded-start-5 shadow "
                            alt="...">
                        <PetInfoCard class="col-4 p-0 rounded-end-5" :name="name" :gender="gender" :birthday="birthday"
                            :breed="breed" :weight="weight" :allergies="allergies" :neutered="neutered"/>
                    </div>
                    <div class="preferred-meal-container container py-5 px-5 mt-4 rounded-5 bg-light shadow">
                        <h2 class="headingFont fw-semibold">Preferred Meal</h2>
                        <div class="row d-flex justify-content-center">
                            <div v-if="props.recipeDetails" class="col-lg-5 mt-5">
                                <MealPlanCard :rec_id="props.recipeDetails.id" 
                                :name="props.recipeDetails.recipe_name" 
                                :desc="props.recipeDetails.description"
                                :petKind="props.recipeDetails.pet_kind ?? props.kind"
                                @open-meal-info="handleOpenMealInfo"
                                :editable="false"/>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- NOTE: this should only be seen if this summary page is the pet's owner -->
                <div class="modal-footer ">
                    <buttonTogglable class="px-4 mx-1" iconLinkON="bi-pen-fill" labelON="Editing..." colorON="primary"
                        iconLinkOFF="bi-pen" labelOFF="Edit" colorOFF="primary" @click="editPet"></buttonTogglable>

                    <Button label="Delete" class="px-4" color="danger" type="button" @click="deletePet">
                        <i class="bi bi-trash3 mx-1"></i>
                    </Button>
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

.img-fluid {
    object-fit: cover;
}

p {
    font-size: 19px;
}

/* entrance for the whole modal content (subtle scale + fade) */
@keyframes modalPop {
    from {
        opacity: 0;
        transform: translateY(15px) scale(.950);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* staggered pop for internal data boxes */
@keyframes floatIn {
    from {
        opacity: 0;
        transform: translateY(8px) scale(.950);
    }

    60% {
        opacity: 1;
        transform: translateY(-5px) scale(1.05);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* apply modal entrance animation when backdrop is shown */
.modal-backdrop .modal-content {
    animation: modalPop .28s cubic-bezier(.2, .9, .2, 1) both;
}

/* animate data containers with a small stagger for nicer UX */

.preferred-meal-container {
    opacity: 0;
    transform-origin: top center;
    animation: floatIn .36s cubic-bezier(.2, .9, .2, 1) both;
}

/* gentle stagger delays */
.pet-info-card {
    animation-delay: .06s;
}

.preferred-meal-container {
    animation-delay: .14s;
}

/* refine interior children micro-motion (useful if those sections contain cards) */
.pet-info-card>*,
.preferred-meal-container>* {
    will-change: transform, opacity;
    transition: transform .18s cubic-bezier(.2, .9, .2, 1), box-shadow .18s ease;
}

/* slight lift on hover for card-like children (still rely on Bootstrap for structure) */
.preferred-meal-container .card,
.pet-info-card {
    transition: transform .18s cubic-bezier(.2, .9, .2, 1), box-shadow .18s ease;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {


}
</style>