<script setup>
import PetInfoModal from '@/components/PetViewComponents/PetInfoModal.vue';
import { ref, defineProps } from 'vue';

const props = defineProps(['name', 'gender', 'breed', 'birthday', 'weight', 'allergies', 'photo_url'])

const showPetInfo = ref(false);
const openPetInfo = () => {
    showPetInfo.value = true;
}

</script>
<template>
    <div class="pet-card card overflow-hidden shadow p-3 mb-5 bg-body-tertiary rounded-4"
        style="width: 40rem; height: 40rem; ">
        <div class="card-header text-center">
            <div class="row d-flex justify-content-between">
                <div class="col-lg-6">
                    <h2 class="bodyFont fw-bold">{{ name }}</h2>
                </div>
                <div class="col-lg-6">
                    <!-- <<h2 class="bodyFont fw-bold">{{gender}}</h2>> -->
                    <div v-if="gender == 'male'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" fill="blue"
                            class="bi bi-gender-male" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                d="M9.5 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.707L9.871 6.836a5 5 0 1 1-.707-.707L13.293 2zM6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8" />
                        </svg>
                    </div>
                    <div v-if="gender == 'female'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="pink"
                            class="bi bi-gender-female" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13h-2a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <img :src="photo_url" style="height: 60%; object-fit:cover;"
            class="card-img-top rounded-5 px-3 py-3" alt="...">
        <div class="card-body">
            <div class="card-text py-3">
                <section class="pet-info headingFont">
                    <h5 class="fw-bold">Status: Good</h5>
                    <h5 class="mb-0 d-inline-block fw-bold">Score:</h5>
                    <div class="d-inline-block">
                        <div class="progress ms-2" role="progressbar" aria-label="Success example" aria-valuenow="25"
                            aria-valuemin="0" aria-valuemax="100" style="width: 150px;">
                            <div class="progress-bar bg-success" style="width: 75%"></div>
                        </div>
                    </div>
                    <h5 class="fw-bold">Meal:
                        <p class="meal-tooltip bodyFont">Salmon</p>
                    </h5>
                </section>
            </div>
            <div class="summary-container container-fluid position-absolute bottom-0 start-0 end-0 px-3 py-3 bg-primary"
                @click="openPetInfo">
                <div class="text-center text-light fw-bold h5 bodyFont">
                    Summary
                </div>
            </div>
        </div>
    </div>
    <!-- to pass in props here -->
    <PetInfoModal v-model:show="showPetInfo"
        :name="name"
        :gender="gender"
        :breed="breed"
        :birthday="birthday"
        :weight="weight"
        :allergies="allergies"
     />

</template>
<style>
.pet-card {
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.pet-card:hover {
    transform: scale(1.03);
    /* Zooms in the card by 5% */
    box-shadow: 0 8px 16px rgba(75, 75, 75, 0.2);
    /* Adds a subtle shadow */
}

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

.summary-container {
    cursor: pointer;
}

.summary-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #3dacd84f;
    opacity: 0;
    border-radius: 8px;
    transform: scale(0);
    transition: all 0.4s;
    z-index: 0;
}

.summary-container:hover::before {
    opacity: 1;
    transform: scale(1);
}
</style>