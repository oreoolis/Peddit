<script setup>
import ItemsChecklist from '@/components/PetViewComponents/ItemsChecklist.vue';
import MealPlanCards from '@/components/PetViewComponents/MealPlanCard.vue';
import PetCards from '@/components/molecules/create-edit-pet/PetCard.vue';
import { RouterLink, useRoute } from 'vue-router';
import { ref, watch, onMounted } from 'vue';
import ShoppingListModal from '@/components/PetViewComponents/ShoppingListModal.vue';
import { usePetStore } from '@/stores/petStore';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/atoms/button.vue';
import { usePetNutritionStore } from '@/stores/petNutritionStore';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';

const petStore = usePetStore();
const { } = storeToRefs(petStore);
const authStore = useAuthStore();
const nutritionStore = usePetNutritionStore();
const { recipes } = storeToRefs(nutritionStore);
const route = useRoute();

watch(() => authStore.userId, (newUserId) => {
    if (newUserId) {
        petStore.fetchPets(newUserId);
        nutritionStore.fetchRecipes(newUserId);
    }
}, { immediate: true });

const showShoppingList = ref(false);
const openShoppingList = () => {
    showShoppingList.value = true;
}

const showPetInfo = ref(false);
const openPetInfo = () => {
    showPetInfo.value = true;
}

const userStore = useUserStore();
const { shoppingList } = storeToRefs(userStore);

onMounted(async () => {
    if (route.state?.showOpSuccess) { // if route state exists, load showEditSuccess
        const toastElement = document.getElementById('liveToast');
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastElement, { autohide: true, delay: 3000 });
        if (document.getElementById("message")) {
            document.getElementById("message").innerText = route.state.message;
            document.getElementById("message").style.fontWeight = "bold";
        }
        toastBootstrap.show();
    }

    try {
        // Fetch shopping list
        await userStore.fetchShoppingList();
        // debug - shows what the store returned
        console.log("Fetched shopping list:", shoppingList.value);
        console.log(recipes.value);
        //await userStore.addMultipleToShoppingList();
    } catch (err) {
        console.error("Error fetching shopping list:", err);
    }

    console.log("HELLSO");
});

</script>

<template>
    <div class="pet-view">
        <!-- Toast Message -->
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success">
                    <strong class="me-auto text-light">Peddit</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body" id="message">
                </div>
            </div>
        </div>

        <div class="pet-card-container container-fluid">
            <div class="row d-flex justify-content-center">
                <div class="col-3">
                    <h1 class="text-start px-3 py-5 headingFont fw-semibold display-4 ">My Pets</h1>
                </div>
                <div class="col-7 d-flex align-items-center justify-content-end ">
                    <div class="py-5 px-3 ">
                        <router-link to="/create-pet" custom v-slot="{ href, navigate }">
                            <Button label="+ Add Pet" color="primary" :href="href" role="link" @click="navigate">
                            </Button>
                        </router-link>
                    </div>
                </div>
            </div>
            <div v-if="petStore.loading">
                <section class="loading-dots-container mb-3">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </section>
            </div>
            <div v-else-if="petStore.pets.length == 0">
                <h1 class="headingFont text-center" style="color: lightcoral">No pets. Create a pet.</h1>
            </div>
            <!-- To do v-if if there is no pets rendered from DB, else show current screen -->
            <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 g-4 gy-4 justify-content-center ">
                <div v-for="pet in petStore.pets" :key="pet.id" class="col-xl-3 col-md-5 mb-4 ">
                    <PetCards :id="pet.id" :name="pet.name" :kind="pet.kind" :gender="pet.gender" :breed="pet.breed"
                        :birthday="pet.birthdate" :weight="pet.weight_kg" :allergies="pet.allergies"
                        :photo_url="pet.photo_url" :recipe_id="pet.preferred_recipe" />
                </div>
            </div>
        </div>

        <div class="grocery-checklist container-fluid">
            <div class="row d-flex justify-content-center">
                <div class="col-lg-9">
                    <h1 class="headingFont fw-semibold display-4 mt-5 mb-2">Weekly Grocery Checklist</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12 d-flex justify-content-center">
                    <div class="bg-light container bodyFont fw-bold rounded-3 shadow p-3 mt-3">
                        <!--Use v-for to loop through list of grocery items, Max number of cols per row: 3 (col-lg-4) -->
                        <div class="row px-3 py-3">
                            <div class="col-lg-4">
                                <ItemsChecklist />
                            </div>
                            <div class="col-lg-4">
                                <ItemsChecklist />
                            </div>
                            <div class="col-lg-4">
                                <ItemsChecklist />
                            </div>
                        </div>
                        <div class="row px-3 py-3 justify-evenly">
                            <div class="col-lg-4">
                                <ItemsChecklist />
                            </div>
                            <div class="col-lg-4">
                                <ItemsChecklist />
                            </div>
                            <div class="col-lg-4">
                                <ItemsChecklist />
                            </div>
                        </div>
                        <div class="row px-3 py-3 justify-evenly">
                            <div class="col-lg-4">
                                <ItemsChecklist />
                            </div>
                            <div class="col-lg-4">
                                <ItemsChecklist />
                            </div>
                            <div class="col-lg-4">
                                <ItemsChecklist />
                            </div>
                        </div>
                        <div class="text-end px-1 py-1">
                            <!-- size: none -->
                            <Button label="+ Edit" color="primary" class="button-edit-list fw-bold bodyFont"
                                @click="openShoppingList">

                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="meal-plans-container container-fluid ">
            <div class="row d-flex justify-content-center mt-5 py-2">
                <div class="col-lg-9">
                    <h1 class="headingFont fw-semibold display-4">My Meal Plans</h1>
                    <button class="button-recommend bodyFont">
                        Auto Recommend
                    </button>
                    <div class="meal-plan-cards container-fluid">
                        <div v-if="nutritionStore.loading">
                            <section class="loading-dots-container">
                                <div class="dot"></div>
                                <div class="dot"></div>
                                <div class="dot"></div>
                                <div class="dot"></div>
                                <div class="dot"></div>
                            </section>
                        </div>
                        <div v-if="nutritionStore.recipes.length == 0">
                            <h1>No recipes. Create one now!</h1>
                        </div>
                        <div v-else class="row">
                            <div v-for="recipe in nutritionStore.recipes"
                                class="col-sm-12 col-md-3 col-lg-4 d-flex justify-content-center">
                                <MealPlanCards :rec_id="recipe.id" :name="recipe.recipe_name"
                                    :desc="recipe.description" />
                            </div>
                            <div class="col-sm-12 col-md-3 col-lg-4 d-flex justify-content-center">
                                <router-link to="/add-meal-plan" custom v-slot="{ href, navigate }">
                                    <button class="icon-btn add-btn shadow" @click="navigate" :href="href" role="link">
                                        <div class="add-icon"></div>
                                        <div class="btn-txt">New Plan</div>
                                    </button>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ShoppingListModal v-model:show="showShoppingList" />
    </div>
</template>

<style>
/* Add Meal Plan */
.icon-btn {
    width: 50px;
    height: 50px;
    border: 1px solid #cdcdcd;
    background: white;
    border-radius: 25px;
    overflow: hidden;
    position: relative;
    transition: width 0.2s ease-in-out;
    font-weight: 500;
    font-family: inherit;
}

.add-btn:hover {
    width: 120px;
}

.add-btn::before,
.add-btn::after {
    transition: width 0.2s ease-in-out, border-radius 0.2s ease-in-out;
    content: "";
    position: absolute;
    height: 4px;
    width: 10px;
    top: calc(50% - 2px);
    background: rgb(0, 0, 0);
}

.add-btn::after {
    right: 14px;
    overflow: hidden;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
}

.add-btn::before {
    left: 14px;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
}

.icon-btn:focus {
    outline: none;
}

.btn-txt {
    opacity: 0;
    transition: opacity 0.2s;
}

.add-btn:hover::before,
.add-btn:hover::after {
    width: 4px;
    border-radius: 2px;
}

.add-btn:hover .btn-txt {
    opacity: 1;
}

.add-icon::after,
.add-icon::before {
    transition: all 0.2s ease-in-out;
    content: "";
    position: absolute;
    height: 20px;
    width: 2px;
    top: calc(50% - 10px);
    background: rgb(0, 0, 0);
    overflow: hidden;
}

.add-icon::before {
    left: 22px;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
}

.add-icon::after {
    right: 22px;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
}

.add-btn:hover .add-icon::before {
    left: 15px;
    height: 4px;
    top: calc(50% - 2px);
}

.add-btn:hover .add-icon::after {
    right: 15px;
    height: 4px;
    top: calc(50% - 2px);
}

/* Recommend Meal */
.button-recommend {
    position: relative;
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
    padding-block: 0.5rem;
    padding-inline: 1.25rem;
    background-color: rgb(78, 78, 78);
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #ffff;
    gap: 10px;
    font-weight: bold;
    border: 3px solid #ffffff4d;
    outline: none;
    overflow: hidden;
    font-size: 18px;
}

.button-recommend:hover {
    transform: scale(1.05);
    border-color: #fff9;
}

.button-recommend:hover .icon {
    transform: translate(4px);
}

.button-recommend:hover::before {
    animation: shine 1.5s ease-out infinite;
}

.button-recommend::before {
    content: "";
    position: absolute;
    width: 100px;
    height: 100%;
    background-image: linear-gradient(120deg,
            rgba(255, 255, 255, 0) 30%,
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0) 70%);
    top: 0;
    left: -100px;
    opacity: 0.6;
}

@keyframes shine {
    0% {
        left: -100px;
    }

    60% {
        left: 100%;
    }

    to {
        left: 100%;
    }
}

/* loading animation */
/* From Uiverse.io by adamgiebl */
.loading-dots-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
}

.dot {
    height: 20px;
    width: 20px;
    margin-right: 10px;
    border-radius: 10px;
    background-color: #b3d4fc;
    animation: pulse 1.5s infinite ease-in-out;
}

.dot:last-child {
    margin-right: 0;
}

.dot:nth-child(1) {
    animation-delay: -0.3s;
}

.dot:nth-child(2) {
    animation-delay: -0.1s;
}

.dot:nth-child(3) {
    animation-delay: 0.1s;
}

@keyframes pulse {
    0% {
        transform: scale(0.8);
        background-color: #b3d4fc;
        box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
    }

    50% {
        transform: scale(1.2);
        background-color: #6793fb;
        box-shadow: 0 0 0 10px rgba(178, 212, 252, 0);
    }

    100% {
        transform: scale(0.8);
        background-color: #b3d4fc;
        box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
    }
}
</style>