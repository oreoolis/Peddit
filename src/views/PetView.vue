<script setup>
import ItemsChecklist from '@/components/PetViewComponents/ItemsChecklist.vue';
import MealPlanCard from '@/components/PetViewComponents/MealPlanCard.vue';
import PetCards from '@/components/molecules/create-edit-pet/PetCard.vue';
import { RouterLink, useRoute } from 'vue-router';
import { ref, watch, onMounted } from 'vue';
import ShoppingListModal from '@/components/PetViewComponents/ShoppingListModal.vue';
import PetInfoModal from '@/components/Organisms/PetInfoModal.vue';
import MealInfoModal from '@/components/PetViewComponents/MealInfoModal.vue';
import ToastStatus from '@/components/molecules/ToastStatus.vue';
import Button from '@/components/atoms/button.vue';
import { usePetStore } from '@/stores/petStore';
import { useAuthStore } from '@/stores/authStore';
import { usePetNutritionStore } from '@/stores/petNutritionStore';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/stores/toastStore';
import DeletePetModal from '@/components/PetViewComponents/DeletePetModal.vue';
import DeleteRecipeModal from '@/components/PetViewComponents/DeleteRecipeModal.vue';

const petStore = usePetStore();
const toastStore = useToastStore();
const authStore = useAuthStore();
const nutritionStore = usePetNutritionStore();
const { recipes } = storeToRefs(nutritionStore);

watch(() => authStore.userId, (newUserId) => {
    if (newUserId) {
        petStore.fetchPets(newUserId);
        nutritionStore.fetchRecipes(newUserId);
    }
}, { immediate: true });


// display pet modal
const selectedPetData = ref(null);
const showPetInfo = ref(false);
const openPetInfo = (petData) => {
    selectedPetData.value = petData;
    showPetInfo.value = true;
}

const selectedRecipeId = ref(null);
const showMealInfo = ref(false);

// emit to delete recipe
const showRecipeDeleteModal = ref(false);
const selectedRecipeInfo = ref({ id: '', name: '' });
const openRecipeDeleteModal = (recipeData) => {
    console.log('Received delete recipe data:', recipeData); // Debug line
    if (recipeData && recipeData.id) {
        selectedRecipeInfo.value = {
            id: recipeData.id,
            name: recipeData.name || ''
        };
        showRecipeDeleteModal.value = true;
    } else {
        console.error('Invalid recipe data received:', recipeData);
    }
}


// emit to delete pet
const showDeleteModal = ref(false);
const selectedItemInfo = ref(null);
const openDeleteModal = (itemData) => {
    selectedItemInfo.value = itemData;
    showDeleteModal.value = true;
}
// whether modal should show edit/delete actions when opened from various places
const modalEditable = ref(true);
const openMealInfo = (payload) => {
    // payload might be an id or an object { rec_id, editable }
    if (payload && typeof payload === 'object') {
        selectedRecipeId.value = payload.rec_id ?? payload.id ?? null;
        modalEditable.value = typeof payload.editable === 'boolean' ? payload.editable : true;
    } else {
        selectedRecipeId.value = payload;
        modalEditable.value = true;
    }
    showMealInfo.value = true;
}

const userStore = useUserStore();
const { shoppingList } = storeToRefs(userStore);

const handleDel = async (ingredient_id) => {
    userStore.deleteShoppingListItem(ingredient_id);
    console.log("outer del");
}

const handleChecked = async ({ ingredient_id, isChecked }) => {
    userStore.updateShoppingListItem(ingredient_id, !isChecked);
    console.log("outer checked");
}

onMounted(async () => {
    try {
        // Fetch shopping list
        await userStore.fetchShoppingList();

        console.log("Fetched shopping list:", shoppingList.value);
        console.log("Recipes: ", recipes.value);
    } catch (err) {
        console.error("Error fetching shopping list:", err);
    }
});

</script>

<template>
    <div class="pet-view">
        <ToastStatus :showOpSuccess="toastStore.showOpSuccess" :message="toastStore.message" />
        <div class="pet-card-container container-fluid">
            <!-- Header Section -->
            <div class="row justify-content-center align-items-center py-5">
                <div class="col-lg-9">
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <h1 class="headingFont fw-semibold display-4 mb-0">My Pets</h1>
                        <router-link to="/create-pet" v-if="petStore.pets?.length > 0" custom
                            v-slot="{ href, navigate }">
                            <Button label="+ Add Pet" color="primary" :href="href" role="link" @click="navigate"
                                class="shadow-sm">
                            </Button>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="row">
                <!-- Loading State -->
                <div v-if="petStore?.loading" class="loading-wrapper">
                    <section class="loading-dots-container">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </section>
                </div>

                <!-- Empty State -->
                <div v-else-if="petStore.pets?.length === 0" class="empty-state-container">
                    <div class="empty-state-content">
                        <div class="empty-state-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="12" cy="8" r="7"></circle>
                                <path d="M12 15v6"></path>
                                <path d="M9 18h6"></path>
                            </svg>
                        </div>
                        <h2 class="headingFont fw-semibold mb-3">No Pets Yet</h2>
                        <p class="bodyFont text-muted mb-4">Start by adding your first furry friend to track their
                            health and nutrition.</p>
                        <router-link to="/create-pet" custom v-slot="{ href, navigate }">
                            <Button label="Add Your First Pet" color="primary" :href="href" role="link"
                                @click="navigate" class="shadow-sm px-4 py-2">
                            </Button>
                        </router-link>
                    </div>
                </div>

                <!-- Pet Cards Grid -->
                <div v-else class="row justify-content-center">
                    <div class="col-12 col-lg-10 px-5">
                        <div class="row g-4 pb-1 d-flex justify-content-center">
                            <div v-for="pet in petStore.pets" :key="pet.id"
                                class="col-xl-5 col-sm-12 col-md-6 g-5 mb-5">
                                <PetCards :id="pet?.id" :name="pet?.name" :kind="pet?.kind" :gender="pet?.gender"
                                    :breed="pet?.breed" :birthday="pet?.birthdate" :weight="pet?.weight_kg"
                                    :allergies="pet?.allergies" :neutered="pet?.neutered" :photo_url="pet?.photo_url"
                                    :recipe_id="pet?.preferred_recipe" @open-pet-info="openPetInfo" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grocery-checklist container-fluid">
            <div class="row d-flex justify-content-center">
                <div class="col-lg-9">
                    <h1 class="headingFont fw-semibold display-4 mt-5 mb-2">My Grocery Checklist</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12 d-flex justify-content-center">
                    <div class="bg-light container bodyFont fw-bold rounded-3 shadow p-3 mt-3">
                        <!--Use v-for to loop through list of grocery items, Max number of cols per row: 3 (col-lg-4) -->
                        <!-- TODO: Bern -->
                        <div v-if="shoppingList?.length === 0">
                            <div class="text-center fw-bold mt-5">
                                <h3>No available recipes to get ingredients!</h3>
                                <h3>Create one to populate the shopping list!</h3>
                            </div>
                        </div>
                        <div class="row px-3 py-3 g-2">
                            <div v-for="ingredient in shoppingList" class="col-12 col-sm-6 col-md-4 col-lg-3">
                                <ItemsChecklist 
                                    :label="ingredient?.food_ingredients?.name"
                                    :ingredient_id="ingredient?.ingredient_id" 
                                    :qty="ingredient?.quantity_g" 
                                    :isChecked="ingredient?.is_purchased" 
                                    @delete="handleDel"
                                    @checked="handleChecked"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="meal-plans-container container-fluid">
            <div class="row d-flex justify-content-center mt-5 py-4">
                <div class="col-lg-9">
                    <!-- Header Section -->
                    <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                        <h1 class="headingFont fw-semibold display-4 mb-0">My Meal Plans</h1>
                        <div class="d-flex gap-3">
                            <router-link to="/add-meal-plan" custom v-slot="{ href, navigate }">
                                <button class="icon-btn add-btn shadow-sm" @click="navigate" :href="href" role="link">
                                    <div class="add-icon"></div>
                                    <div class="btn-txt">New Plan</div>
                                </button>
                            </router-link>
                            <button class="button-recommend bodyFont shadow-sm">
                                Auto Recommend
                            </button>
                        </div>
                    </div>

                    <!-- Meal Plan Cards Section -->
                    <div class="meal-plan-cards container-fluid px-0">
                        <!-- Loading State -->
                        <div v-if="nutritionStore?.loading" class="loading-container">
                            <section class="loading-dots-container">
                                <div class="dot"></div>
                                <div class="dot"></div>
                                <div class="dot"></div>
                                <div class="dot"></div>
                                <div class="dot"></div>
                            </section>
                        </div>

                        <!-- Empty State -->
                        <div v-else-if="recipes?.length === 0" class="empty-state text-center py-5">
                            <h2 class="headingFont fw-semibold mb-3">No Meal Plans Yet</h2>
                            <p class="bodyFont text-muted mb-4">Create your first meal plan to get started!</p>
                        </div>

                        <!-- Recipe Cards Grid -->
                        <div v-else class="row g-4">
                            <div v-for="recipe in nutritionStore?.recipes" :key="recipe.id"
                                class="col-auto d-flex justify-content-center">
                                <div style="width: 100%; max-width: 340px;">
                                    <MealPlanCard :rec_id="recipe?.id" :name="recipe?.recipe_name"
                                        :desc="recipe?.description" :petKind="recipe?.pet_kind"
                                        @open-meal-info="openMealInfo(recipe?.id)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- <ShoppingListModal v-model:show="showShoppingList" /> -->
        <PetInfoModal v-model:show="showPetInfo" :id="selectedPetData?.id" :name="selectedPetData?.name"
            :kind="selectedPetData?.kind" :gender="selectedPetData?.gender" :breed="selectedPetData?.breed"
            :birthday="selectedPetData?.birthday" :weight="selectedPetData?.weight"
            :allergies="selectedPetData?.allergies" :neutered="selectedPetData?.neutered"
            :photo_url="selectedPetData?.photo_url" :recipeDetails="selectedPetData?.recipeDetails"
            @open-meal-info="openMealInfo" @delete-item-modal="openDeleteModal" />
        <MealInfoModal v-model:show="showMealInfo" :rec_id="selectedRecipeId" :editable="modalEditable"
            @delete-recipe-modal="openRecipeDeleteModal" />
        <DeletePetModal v-model:show="showDeleteModal" :name="selectedItemInfo?.name" :id="selectedItemInfo?.id" />
        <DeleteRecipeModal v-model:show="showRecipeDeleteModal" :name="selectedRecipeInfo?.name"
            :id="selectedRecipeInfo?.id" />
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

/* Loading Wrapper */
.loading-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    padding: 3rem 0;
}

/* Empty State Styling */
.empty-state-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 500px;
    padding: 3rem 1.5rem;
}

.empty-state-content {
    text-align: center;
    max-width: 500px;
    background: white;
    padding: 3rem 2rem;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-state-icon {
    color: #cbd5e1;
    margin-bottom: 1.5rem;
    display: inline-block;
}

.empty-state-icon svg {
    width: 100px;
    height: 100px;
}

.empty-state-content h2 {
    color: #2d3748;
    font-size: 1.75rem;
}

.empty-state-content p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #64748b;
}

/* Pet Cards Grid - Using Bootstrap's row-cols for responsive grid */
.row-cols-1>* {
    padding: 0.75rem;
}

/* Smooth transitions for cards */
.col {
    transition: transform 0.2s ease;
}

/* Add hover effect on the whole card column */
.col:hover {
    transform: translateY(-5px);
}

/* Improved shadow utilities */
.shadow-sm {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .pet-card-container .display-4 {
        font-size: 2rem;
    }

    .empty-state-content {
        padding: 2rem 1.5rem;
    }

    .empty-state-icon svg {
        width: 80px;
        height: 80px;
    }
}

@media (max-width: 576px) {
    .d-flex.gap-3 {
        flex-direction: column;
        align-items: flex-start !important;
        width: 100%;
    }
}

/* Grid spacing improvements */
.g-4 {
    --bs-gutter-x: 1.5rem;
    --bs-gutter-y: 1.5rem;
}

@media (min-width: 1200px) {
    .g-4 {
        --bs-gutter-x: 2rem;
        --bs-gutter-y: 2rem;
    }
}

@media (max-width: 576px) {
    .d-flex.gap-3 {
        flex-direction: row;
        align-items: center;
        width: 100%;
        justify-content: space-between;
    }

    .pet-card-container .display-4 {
        font-size: 2.5rem;
        margin-bottom: 0;
    }

    .meal-plans-container .display-4 {
        font-size: 2.5rem;
        margin-bottom: 0;
        text-align: center;
    }
}
</style>