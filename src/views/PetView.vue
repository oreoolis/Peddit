<script setup lang="ts">
import router from '@/router';
import { RouterLink } from 'vue-router';

// TODO: link Pet here
// import Pet from '../components/Pet.vue';

</script>

<template>
    <div class="pet-view container-fluid">
        <div class="pet-card-container">
            <h1 class="text-center px-5 py-5 headingFont ">My Pets</h1>
            <!-- To do v-if if there is no pets rendered from DB, else show current screen -->
            <div class="row justify-content-center g-3">
                <div class="col-lg-5 d-flex justify-content-center">
                    <div class="card overflow-hidden shadow p-3 mb-5 bg-body-tertiary rounded-4"
                        style="width: 40rem; height: 40rem; ">
                        <div class="card-header text-center">
                            <div class="row d-flex justify-content-between">
                                <div class="col-lg-3">
                                    <h3 class="bodyFont">Cat 1</h3>
                                </div>
                                <div class="col-lg-3">
                                    <h3 class="bodyFont">Male</h3>
                                </div>
                            </div>
                        </div>
                        <img src="../assets/ragdoll.jpg" style="height: 60%; object-fit:cover;"
                            class="card-img-top rounded-5 px-3 py-3" alt="...">
                        <div class="card-body">
                            <div class="card-text">
                                <section class="pet-info headingFont">
                                    <h5 class="fw-bold">Status: Good</h5>
                                    <h5 class="mb-0 d-inline-block fw-bold">Score:</h5>
                                    <div class="d-inline-block">
                                        <div class="progress ms-2" role="progressbar" aria-label="Success example"
                                            aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"
                                            style="width: 150px;">
                                            <div class="progress-bar bg-success" style="width: 75%"></div>
                                        </div>
                                    </div>
                                    <h5 class="fw-bold">Meal:
                                        <p class="meal-tooltip bodyFont">Salmon</p>
                                    </h5>
                                </section>
                            </div>
                            <!-- size: none -->
                            <div class=" containertext-end px-3 py-3">
                                <button type="button" class="btn btn-primary btn-lg w-100 bg-primary bodyFont">
                                    Summary
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5 d-flex justify-content-center">
                    <div class="card overflow-hidden shadow p-3 mb-5 bg-body-tertiary rounded-4"
                        style="width: 40rem; height: 40rem; ">
                        <div class="card-header text-center">
                            <div class="row d-flex justify-content-between">
                                <div class="col-lg-3">
                                    <h3 class="bodyFont">Cat 1</h3>
                                </div>
                                <div class="col-lg-3">
                                    <h3 class="bodyFont">Male</h3>
                                </div>
                            </div>
                        </div>
                        <img src="../assets/ragdoll.jpg" style="height: 60%; object-fit:cover;"
                            class="card-img-top rounded-5 px-3 py-3" alt="...">
                        <div class="card-body">
                            <div class="card-text">
                                <section class="pet-info headingFont">
                                    <h5 class="fw-bold">Status: Good</h5>
                                    <h5 class="mb-0 d-inline-block fw-bold">Score:</h5>
                                    <div class="d-inline-block">
                                        <div class="progress ms-2" role="progressbar" aria-label="Success example"
                                            aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"
                                            style="width: 150px;">
                                            <div class="progress-bar bg-success" style="width: 75%"></div>
                                        </div>
                                    </div>
                                    <h5 class="fw-bold">Meal:
                                        <p class="meal-tooltip bodyFont">Salmon</p>
                                    </h5>
                                </section>
                            </div>
                            <!-- size: none -->
                            <div class="container-fluid text-end px-3 py-3">
                                <!-- size: btn-lg -->
                                <button type="button" class="btn btn-primary btn-lg w-100 bg-primary bodyFont">
                                    Summary
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container px-3 py-3">
            <div class="row justify-content-center g-3">
                <div class="col-lg-5 d-flex justify-content-center"></div>
                <div class="col-lg-5 d-flex justify-content-center">
                    <router-link to="/create-pet" custom v-slot="{ href, navigate }">
                        <button class="btn bg-primary bodyFont text-light w-25 rounded-5 shadow" :href="href"
                            role="link" @click="navigate">
                            + Add Pet
                        </button>
                    </router-link>
                </div>
            </div>
        </div>

        <div class="grocery-checklist">
            <h1 class="text-center px-5 py-5 headingFont">Weekly Grocery Checklist</h1>
            <div class="container-fluid bg-light bodyFont fw-bold rounded-3 shadow p-3 mb-5">
                <!-- Max number of cols per row: 3 (col-lg-4) -->
                <div class="row px-3 py-3 justify-evenly ">
                    <div class="col-lg-4">
                        <div class="custom-checkbox-container">
                            <input class="custom-checkbox-input" id="modernCheckbox1" type="checkbox" />
                            <label class="custom-checkbox-label" for="modernCheckbox1">
                                <span class="custom-checkbox-text">HealthyFood1</span>
                            </label>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="custom-checkbox-container">
                            <input class="custom-checkbox-input" id="modernCheckbox2" type="checkbox" />
                            <label class="custom-checkbox-label" for="modernCheckbox2">
                                <span class="custom-checkbox-text">Rectange</span>
                            </label>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="custom-checkbox-container">
                            <input class="custom-checkbox-input" id="modernCheckbox3" type="checkbox" />
                            <label class="custom-checkbox-label" for="modernCheckbox3">
                                <span class="custom-checkbox-text">Triangle</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="row px-3 py-3 justify-evenly">
                    <div class="col-lg-4">
                        <div class="custom-checkbox-container">
                            <input class="custom-checkbox-input" id="modernCheckbox4" type="checkbox" />
                            <label class="custom-checkbox-label" for="modernCheckbox4">
                                <span class="custom-checkbox-text">Circle</span>
                            </label>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="custom-checkbox-container">
                            <input class="custom-checkbox-input" id="modernCheckbox5" type="checkbox" />
                            <label class="custom-checkbox-label" for="modernCheckbox5">
                                <span class="custom-checkbox-text">Square</span>
                            </label>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="custom-checkbox-container">
                            <input class="custom-checkbox-input" id="modernCheckbox6" type="checkbox" />
                            <label class="custom-checkbox-label" for="modernCheckbox6">
                                <span class="custom-checkbox-text">Banana</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="row px-3 py-3 justify-evenly">
                    <div class="col-lg-4">
                        <div class="custom-checkbox-container">
                            <input class="custom-checkbox-input" id="modernCheckbox7" type="checkbox" />
                            <label class="custom-checkbox-label" for="modernCheckbox7">
                                <span class="custom-checkbox-text">Pear</span>
                            </label>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="custom-checkbox-container">
                            <input class="custom-checkbox-input" id="modernCheckbox8" type="checkbox" />
                            <label class="custom-checkbox-label" for="modernCheckbox8">
                                <span class="custom-checkbox-text">Orange</span>
                            </label>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="custom-checkbox-container">
                            <input class="custom-checkbox-input" id="modernCheckbox9" type="checkbox" />
                            <label class="custom-checkbox-label" for="modernCheckbox9">
                                <span class="custom-checkbox-text">Apple</span>
                            </label>
                        </div>
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
            <h1 class="text-center px-5 py-5 headingFont">My Meal Plans</h1>
            <div class="row justify-content-center px-5 py-5 g-1">
                <div class="col-lg-3 d-flex justify-content-center">
                    <div class="card bg-primary shadow" style="width: 18rem;">
                        <img src="../assets/Sprite/Food/Set3-Meat/11.png" class="card-img-top" alt="...">
                        <div class="card-body">
                            <div class="card-text text-center">
                                <h3 class="headingFont text-light">Recipe</h3>
                                <p class="bodyFont text-light">Breed type</p>
                                <div class="container-fluid px-3 py-3">
                                    <button type="button" class="btn btn-light btn-lg w-100">
                                        View Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 d-flex justify-content-center">
                    <div class="card bg-primary shadow" style="width: 18rem;">
                        <img src="../assets/Sprite/Food/Set3-Meat/11.png" class="card-img-top" alt="...">
                        <div class="card-body">
                            <div class="card-text text-center">
                                <h3 class="headingFont text-light">Recipe</h3>
                                <p class="bodyFont text-light">Breed type</p>
                                <div class="container-fluid px-3 py-3">
                                    <button type="button" class="btn btn-light btn-lg w-100">
                                        View Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 d-flex justify-content-center">
                    <div class="card bg-primary shadow" style="width: 18rem;">
                        <img src="../assets/Sprite/Food/Set3-Meat/11.png" class="card-img-top" alt="...">
                        <div class="card-body">
                            <div class="card-text text-center">
                                <h3 class="headingFont text-light">Recipe</h3>
                                <p class="bodyFont text-light">Breed type</p>
                                <div class="container-fluid px-3 py-3">
                                    <button type="button" class="btn btn-light btn-lg w-100">
                                        View Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
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
.pet-info {
    display: block;
}

.meal-tooltip {
    display: inline-block;
    background-color: #237b9f;
    border-radius: 10px;
    color: white;
    padding: 5px 5px 5px 5px;
    font-weight: 100;
}

/* From Uiverse.io by mrhyddenn */
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

/* CSS (updated with faster focus ring transition) */
.custom-checkbox-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  padding: 8px;
}

.custom-checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.custom-checkbox-label {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 32px;
  transition: all 0.2s ease;
}

/* Checkbox box */
.custom-checkbox-label:before {
  content: "";
  position: absolute;
  left: 0;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  border: 2px solid #ccc;
  transition: all 0.3s ease;
  z-index: 1;
}

/* Checkmark */
.custom-checkbox-label:after {
  content: "";
  position: absolute;
  left: 6px;
  top: 3px;
  width: 8px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) scale(0);
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 3;
}

/* Checked state */
.custom-checkbox-input:checked + .custom-checkbox-label:before {
  background: linear-gradient(135deg, #00b7ff 0%, #00b7ff 100%);
  border-color: #00b7ff;
  overflow: hidden;
}

/* Shine effect */
.custom-checkbox-label span.custom-checkbox-shine {
  position: absolute;
  left: 0;
  top: 0;
  width: 20px;
  height: 20px;
  z-index: 2;
  pointer-events: none;
}

.custom-checkbox-input:checked
  + .custom-checkbox-label
  span.custom-checkbox-shine:after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 20px;
  height: 100px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(45deg);
  animation: shine 0.6s ease-in-out infinite;
}

/* Checkmark animation */
.custom-checkbox-input:checked + .custom-checkbox-label:after {
  transform: rotate(45deg) scale(1);
  opacity: 1;
}

/* Hover effect */
.custom-checkbox-container:hover .custom-checkbox-label:before {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

/* Text styling */
.custom-checkbox-text {
  color: #333;
  font-family: Arial, sans-serif;
  font-size: 16px;
  transition: color 0.2s ease;
  position: relative;
  z-index: 4;
}

.custom-checkbox-container:hover .custom-checkbox-text {
  color: #00b7ff;
}

/* Focus state with transition */
.custom-checkbox-input:focus + .custom-checkbox-label:before {
  outline: 2px solid #00b7ff;
  outline-offset: 2px;
  transition: outline 0.1s ease-in-out; /* Added fast transition for outline */
}

/* Ensure outline is initially off with transition readiness */
.custom-checkbox-label:before {
  outline: 0 solid transparent; /* Initial state for smooth transition */
}

/* Shine animation keyframes */
@keyframes shine {
  0% {
    left: -100%;
  }
  40% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}

</style>