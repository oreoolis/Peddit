<script setup>
import MealPlanCards from '@/components/PetViewComponents/MealPlanCards.vue';
import { onMounted } from 'vue';

const selectDog = () => {
    const dogTrigger = document.getElementById("dog-breed-card");
    const toastElement = document.getElementById('liveToast');
    if (dogTrigger && toastElement) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastElement);
        dogTrigger.addEventListener('click', () => {
            toastBootstrap.show();
            document.getElementById("message").innerText = "You have chosen Dog!";
            document.getElementById("message").style.fontWeight = "bold";
            // to append dog as value in form
            //toastElement.style.backgroundColor = 
        });
    }

}

const selectCat = () => {
    const catTrigger = document.getElementById("cat-breed-card");
    const toastElement = document.getElementById('liveToast');
    if (catTrigger && toastElement) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastElement);
        catTrigger.addEventListener('click', () => {
            toastBootstrap.show();
            document.getElementById("message").innerText = "You have chosen Cat!";
            document.getElementById("message").style.fontWeight = "bold";
            // to append cat as value in form

        });
    }
}
</script>

<template>
    <div class="container-fluid">
        <!-- toast message -->
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
        <form>
            <div class="pet-selector px-5 py-5">
                <h1 class="headingFont display-3 text-center fw-semibold">Create Your Pet</h1>
                <div class="row justify-content-center g-3 py-5">
                    <div class="col-12 col-sm-6 col-md-6 col-lg-5 col-xl-4">
                        <div @click="selectDog" class="dog-breed-card" id="dog-breed-card">
                            <p class="pet-title brandFont text-light display-1">Dog</p>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6 col-md-6 col-lg-5 col-xl-4">
                        <div @click = "selectCat" class="cat-breed-card" id="cat-breed-card">
                            <p class="pet-title brandFont text-light display-1">Cat</p>
                        </div>
                    </div>
                </div>
            </div>


            <div class="input-forms container-fluid px-3 py-3">
                <div class="mb-3 input-group-lg">
                    <label for="" class="form-label headingFont fw-bold h5">Pet Name</label>
                    <input type="text" name="" id="" class="form-control input-lg" placeholder=""
                        aria-describedby="helpId" />
                </div>
                <div class="mb-3 input-group-lg">
                    <label for="" class="form-label headingFont fw-bold h5">Birthday</label>
                    <input type="text" name="" id="" class="form-control" placeholder="" aria-describedby="helpId" />
                </div>
                <div class="mb-3 input-group-lg">
                    <label for="" class="form-label headingFont fw-bold h5">Breed</label>
                    <input type="text" name="" id="" class="form-control" placeholder="" aria-describedby="helpId" />
                </div>
                <div class="mb-3 input-group-lg">
                    <label for="" class="form-label headingFont fw-bold h5">Allergies (Optional)</label>
                    <input type="text" name="" id="" class="form-control" placeholder="" aria-describedby="helpId" />
                </div>
            </div>

            <div class="meal-plan container-fluid px-3">
                <div class="row justify-content-between">
                    <div class="col-lg-8 col-sm-4">
                        <h3 class="headingFont fw-bold">Meal Plan</h3>
                    </div>
                    <div class="col-lg-2 col-sm-5">
                        <!-- size: btn-lg -->
                        <button class="button-recommend">
                            Auto Recommend
                        </button>
                    </div>
                </div>
            </div>

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
        </form>
        <!-- size: btn-lg -->
        <button type="button" class="btn btn-lg bg-primary w-100 headingFont text-light fw-bold shadow">
            Create Pet
        </button>
    </div>
</template>

<style>
.pet-title {
    text-shadow: 1px 5px 5px black;
}

.dog-breed-card {
    box-sizing: border-box;
    width: 100%;
    max-width: 500px;
    height: 300px;
    background-image: url("../assets/Pixel Art/dog (1).png");
    background-position: center;
    background-size: cover;
    border: 1px solid white;
    box-shadow: 12px 17px 51px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(6px);
    border-radius: 17px;
    text-align: center;
    cursor: pointer;
    transition: all 0.5s;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    font-weight: bolder;
    color: black;
    margin: 0 auto;
}

.cat-breed-card {
    box-sizing: border-box;
    width: 100%;
    max-width: 500px;
    height: 300px;
    background-image: url("../assets/Pixel Art/cat (5).png");
    background-position: center;
    background-size: cover;
    border: 1px solid white;
    box-shadow: 12px 17px 51px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(6px);
    border-radius: 17px;
    text-align: center;
    cursor: pointer;
    transition: all 0.5s;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    font-weight: bolder;
    color: black;
    margin: 0 auto;
}

/* Responsive heights using Bootstrap breakpoints */
@media (min-width: 576px) {

    .dog-breed-card,
    .cat-breed-card {
        height: 350px;
    }
}

@media (min-width: 768px) {

    .dog-breed-card,
    .cat-breed-card {
        height: 400px;
    }
}

@media (min-width: 992px) {

    .dog-breed-card,
    .cat-breed-card {
        height: 450px;
    }
}

@media (min-width: 1200px) {

    .dog-breed-card,
    .cat-breed-card {
        height: 500px;
    }
}

.dog-breed-card:hover,
.cat-breed-card:hover {
    border: 1px solid black;
    transform: scale(1.05);
}

.dog-breed-card:active,
.cat-breed-card:active {
    transform: scale(0.95) rotateZ(1.7deg);
}


/* Add Pet */
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
  font-size: 15px;
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
</style>