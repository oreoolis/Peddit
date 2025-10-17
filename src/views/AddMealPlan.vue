<script setup>
import AddIngredientModal from '@/components/PetViewComponents/AddIngredientModal.vue';
import IngredientCard from '@/components/PetViewComponents/IngredientCard.vue';
import { ref } from 'vue';

const showIngredientModal = ref(false);
const openIngredientModal = () => {
showIngredientModal.value = true;
}

</script>
<template>
    <div class="add-meal-plan d-flex justify-content-center align-items-center min-vh-100">
        <!-- Use container instead of container-fluid for centered layout with padding -->
        <div class="meal-form container py-5">
            <div class="row justify-content-center">
                <div class="col-lg-10 col-xl-9">
                    <!-- Header -->
                    <h1 class="headingFont display-4 fw-semibold mb-5">Create Meal Plan</h1>
                    
                    <form>
                        <!-- Meal Name -->
                        <div class="mb-4">
                            <label for="mealName" class="form-label headingFont fw-bold h5">Meal Name</label>
                            <input 
                                type="text" 
                                id="mealName"
                                class="form-control form-control-lg bodyFont"
                                placeholder="Salmon Delight" 
                            />
                        </div>

                        <!-- Meal Description -->
                        <div class="mb-4">
                            <label for="mealDescription" class="form-label headingFont fw-bold h5">Meal Description</label>
                            <textarea 
                                id="mealDescription"
                                class="form-control form-control-lg bodyFont"
                                placeholder="Add 2 cups of ingredients" 
                                rows="3"
                            ></textarea>
                        </div>

                        <!-- Ingredients Section -->
                        <div class="mb-4">
                            <h5 class="headingFont fw-bold mb-3">Ingredients</h5>
                            
                            <!-- Single responsive grid for all ingredient cards -->
                            <div class="row g-3 mb-3">
                                <div class="col-6 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center">
                                    <IngredientCard />
                                </div>
                                <div class="col-6 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center">
                                    <IngredientCard />
                                </div>
                                <div class="col-6 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center">
                                    <IngredientCard />
                                </div>
                                <div class="col-6 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center">
                                    <IngredientCard />
                                </div>
                                <!-- Add Ingredient Button -->
                                <div class="col-6 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center align-items-center">
                                    <button 
                                        class="icon-btn add-btn shadow" 
                                        @click.prevent="openIngredientModal" 
                                        type="button"
                                    >
                                        <div class="add-icon"></div>
                                        <div class="btn-txt">New Item</div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Nutritional Output Card -->
                        <div class="meal-plan-output bg-light p-4 rounded-4 shadow-sm mb-4">
                            <h3 class="headingFont fw-bold mb-4 p-3 bg-white rounded-3 shadow-sm">
                                Estimated Cost: $X/Week
                            </h3>
                            
                            <div class="row g-3">
                                <div class="col-sm-6 col-lg-3">
                                    <div class="nutrition-item">
                                        <span class="headingFont fw-bold">Protein:</span>
                                        <span class="bodyFont ms-2">20mg</span>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-lg-3">
                                    <div class="nutrition-item">
                                        <span class="headingFont fw-bold">Carbs:</span>
                                        <span class="bodyFont ms-2">20mg</span>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-lg-3">
                                    <div class="nutrition-item">
                                        <span class="headingFont fw-bold">Salt:</span>
                                        <span class="bodyFont ms-2">20mg</span>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-lg-3">
                                    <div class="nutrition-item">
                                        <span class="headingFont fw-bold">Water:</span>
                                        <span class="bodyFont ms-2">20mg</span>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-lg-3">
                                    <div class="nutrition-item">
                                        <span class="headingFont fw-bold">Fiber:</span>
                                        <span class="bodyFont ms-2">20mg</span>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-lg-3">
                                    <div class="nutrition-item">
                                        <span class="headingFont fw-bold">Vitamin A:</span>
                                        <span class="bodyFont ms-2">20mg</span>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-lg-3">
                                    <div class="nutrition-item">
                                        <span class="headingFont fw-bold">Vitamin B:</span>
                                        <span class="bodyFont ms-2">20mg</span>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-lg-3">
                                    <div class="nutrition-item">
                                        <span class="headingFont fw-bold">Vitamin C:</span>
                                        <span class="bodyFont ms-2">20mg</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Submit Button -->
                        <button 
                            type="submit" 
                            class="btn btn-primary btn-lg w-100 py-3 fw-bold headingFont shadow"
                        >
                            Create Meal Plan
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <AddIngredientModal v-model:show="showIngredientModal" @error="console.error" />
    </div>
</template>

<style scoped>
/* Center entire page in viewport */
.add-meal-plan {
    position: relative;
}

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
</style>