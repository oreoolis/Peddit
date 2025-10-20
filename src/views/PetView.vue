<script setup>
import ItemsChecklist from '@/components/PetViewComponents/ItemsChecklist.vue';
import MealPlanCards from '@/components/PetViewComponents/MealPlanCard.vue';
import PetCards from '@/components/molecules/PetCard.vue';
import { RouterLink } from 'vue-router';
import { ref, watch } from 'vue';
import ShoppingListModal from '@/components/PetViewComponents/ShoppingListModal.vue';
import { usePetStore } from '@/stores/petStore';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/atoms/button.vue';

const petStore = usePetStore();
const {fetchPets} = petStore;
const authStore = useAuthStore();


watch(() => authStore.userId, (newUserId) => {
    if (newUserId){
        fetchPets(newUserId);
    }
}, {immediate: true});

const showShoppingList = ref(false);
const openShoppingList = () => {
    showShoppingList.value = true;
}

const showPetInfo = ref(false);
const openPetInfo = () => {
    showPetInfo.value = true;
}

</script>

<template>
    <div class="pet-view">
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
            <div v-if="!petStore.pets">
                <h1>No pets. Create a pet.</h1>
            </div>
            <!-- To do v-if if there is no pets rendered from DB, else show current screen -->
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 gy-4 justify-content-center px-4 pb-5">
                <div v-for="pet in petStore.pets" :key="pet.id" class="col d-flex align-items-stretch my-2">
                    <PetCards 
                        :name="pet.name"
                        :gender="pet.gender"
                        :breed="pet.breed"
                        :birthday="pet.birthdate"
                        :weight="pet.weight_kg"
                        :allergies="pet.allergies"
                        :photo_url="pet.photo_url"
                    />
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
                            <Button label="+ Edit" color="primary" class="button-edit-list fw-bold bodyFont" @click="openShoppingList">
                                
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
                        <div class="row justify-content-center px-5 py-5 gy-5 gx-4">
                            <div class="col-sm-12 col-md-4 col-lg-3 d-flex justify-content-center">
                                <MealPlanCards />
                            </div>
                            <div class="col-sm-12 col-md-4 col-lg-3 d-flex justify-content-center">
                                <MealPlanCards />
                            </div>
                            <div class="col-sm-12 col-md-4 col-lg-3 d-flex justify-content-center">
                                <MealPlanCards />
                            </div>
                            <div class="col-sm-12 col-md-4 col-lg-3 d-flex justify-content-center">
                                <router-link to="/add-meal-plan" custom v-slot="{ href, navigate }">
                                    <button class="icon-btn add-btn shadow" @click="navigate" :href="href">
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
</style>