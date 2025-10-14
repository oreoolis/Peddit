<script setup>
import ItemsChecklist from '@/components/PetViewComponents/ItemsChecklist.vue';
import MealPlanCards from '@/components/PetViewComponents/MealPlanCards.vue';
import PetCards from '@/components/PetViewComponents/PetCards.vue';
import router from '@/router';
import { RouterLink } from 'vue-router';

// TODO: link Pet here
// import Pet from '../components/Pet.vue';

</script>

<template>
    <div class="pet-view container-fluid">
        <div class="pet-card-container">
            <h1 class="text-center px-5 py-5 headingFont fw-semibold">My Pets</h1>
            <!-- To do v-if if there is no pets rendered from DB, else show current screen -->
            <div class="row justify-content-center g-3">
                <div class="col-lg-5 d-flex justify-content-center">
                    <PetCards />
                </div>
                <div class="col-lg-5 d-flex justify-content-center">
                    <PetCards />
                </div>
            </div>
        </div>
        <div class="container-fluid px-5 py-2">
            <div class="row g-3">
                <div class="col-lg-12 col-sm-12 d-flex justify-content-lg-end justify-content-sm-center">
                    <router-link to="/create-pet" custom v-slot="{ href, navigate }">
                        <button class="button-add-pet" :href = "href" role = "link" @click = "navigate">
                            + Add Pet
                        </button>
                    </router-link>
                </div>
            </div>
        </div>

        <div class="grocery-checklist">
            <h1 class="text-center px-5 py-5 headingFont fw-semibold">Weekly Grocery Checklist</h1>
            <div class="container-fluid bg-light bodyFont fw-bold rounded-3 shadow p-3 mb-5">
                <!--Use v-for to loop through list of grocery items, Max number of cols per row: 3 (col-lg-4) -->
                <div class="row px-3 py-3 justify-evenly ">
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
                    <button type="button" class="btn btn-warning ">
                        Edit
                    </button>
                </div>
            </div>
        </div>

        <div class="meal-plans-container">
            <h1 class="text-center px-5 py-5 headingFont fw-semibold">My Meal Plans</h1>
            <div class="row justify-content-center px-5 py-5 g-1">
                <div class="col-lg-3 d-flex justify-content-center">
                    <MealPlanCards />
                </div>
                <div class="col-lg-3 d-flex justify-content-center">
                    <MealPlanCards />

                </div>
                <div class="col-lg-3 d-flex justify-content-center">
                    <MealPlanCards />
                </div>
                <div class="col-lg-3 d-flex justify-content-center pt-5">
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
</template>

<style>

/* Add Pet */
.button-add-pet {
  position: relative;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  padding-block: 0.5rem;
  padding-inline: 1.25rem;
  background-color: rgb(0 107 179);
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
  font-size: 15px;
}

.button-add-pet:hover {
  transform: scale(1.05);
  border-color: #fff9;
}

.button-add-pet:hover .icon {
  transform: translate(4px);
}

.button-add-pet:hover::before {
  animation: shine 1.5s ease-out infinite;
}

.button-add-pet::before {
  content: "";
  position: absolute;
  width: 100px;
  height: 100%;
  background-image: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0) 30%,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0) 70%
  );
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
</style>